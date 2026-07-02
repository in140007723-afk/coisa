import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { formatPrice, slugify, type Product } from "@/lib/product-store";
import { getProducts, getCategories } from "@/lib/admin-store";

function getCategorySlugVariants(value: string): string[] {
  const normalized = (value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!normalized) return [];

  const variants = new Set<string>([normalized]);
  if (normalized.endsWith("-ies")) variants.add(`${normalized.slice(0, -3)}y`);
  if (normalized.endsWith("-es")) variants.add(normalized.slice(0, -2));
  if (normalized.endsWith("-s")) variants.add(normalized.slice(0, -1));
  return Array.from(variants);
}

function normalizeProduct(item: any): Product {
  const categoryName = item?.categoryName || item?.category || "";
  const categorySlug = getCategorySlugVariants(categoryName)[0] || slugify(categoryName);

  return {
    id: String(item?.id ?? ""),
    name: item?.name ?? "",
    category: categoryName,
    categorySlug,
    brand: item?.brand ?? "Coisa Computers",
    model: item?.model ?? "Custom",
    price: Number(item?.price ?? 0),
    stock: Number(item?.stock ?? item?.stockQuantity ?? 0),
    condition: item?.condition ?? "Brand New",
    description: item?.description ?? "",
    imageUrl: Array.isArray(item?.images) && item.images[0] ? item.images[0] : item?.imageUrl ?? item?.image ?? "",
    slug: item?.slug ?? slugify(item?.name ?? ""),
    featured: Boolean(item?.featured),
    tags: Array.isArray(item?.tags) ? item.tags : [],
    specifications: typeof item?.specifications === "object" && item?.specifications ? item.specifications : {},
    createdAt: item?.created_at ?? item?.createdAt ?? "not-available",
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const categoryName = resolvedParams?.category ? decodeURIComponent(resolvedParams.category) : "";
  const normalizedCategorySlug = slugify(categoryName || "");

  const productsRaw = await getProducts();
  const categoriesRaw = await getCategories();
  const products = (productsRaw || []).map(normalizeProduct);
  const categoryNamesById = new Map((categoriesRaw || []).map((category: any) => [String(category?.id ?? ""), String(category?.name ?? "")]))
  const requestedCategorySlugs = getCategorySlugVariants(categoryName || "");
  const filteredProducts = products.filter((p) => {
    const candidateSlugs = [
      p.categorySlug || "",
      ...getCategorySlugVariants(p.category || ""),
      ...getCategorySlugVariants(categoryNamesById.get(String((p as any).categoryId || "")) || ""),
    ];
    return candidateSlugs.some((slug) => requestedCategorySlugs.includes(slug));
  });

  return (
    <SiteShell title="Category Products" description={`Browse products in ${categoryName || "this category"}.`}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0066FF]">Category</p>
            <h2 className="text-3xl font-semibold text-slate-900">{categoryName || "Products"}</h2>
          </div>
          <Link href="/products" className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0066FF] hover:text-[#0066FF]">
            Back to catalog
          </Link>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            No products have been uploaded for this category yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredProducts.map((product) => (
              <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0066FF]">{product.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{product.name}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
                </div>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl || "/images/tech-showcase.svg"}
                    alt={product.name}
                    className="mt-4 h-40 w-full rounded-2xl object-cover"
                  />
                ) : null}
                <p className="mt-4 text-sm leading-7 text-slate-600">{product.description}</p>
                {product.tags && product.tags.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{tag}</span>
                    ))}
                  </div>
                ) : null}
                {product.specifications && Object.keys(product.specifications).length ? (
                  <div className="mt-3 text-sm text-slate-600">
                    {Object.entries(product.specifications).slice(0,3).map(([k, v]) => (
                      <div key={k}><strong className="text-slate-800">{k}:</strong> <span className="ml-1">{String(v)}</span></div>
                    ))}
                  </div>
                ) : null}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-slate-900">{formatPrice(product.price)}</p>
                  <Link href={`/products/${product.slug}`} className="rounded-full bg-[#0066FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0052cc]">
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

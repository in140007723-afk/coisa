import { NextResponse } from "next/server";
import { createProduct, getProducts, getCategories } from "@/lib/admin-store";

interface Product {
  id: string | number;
  name: string;
  category: string;
  categorySlug?: string;
  brand?: string;
  model?: string;
  price?: number;
  stock?: number;
  condition?: string;
  description?: string;
  imageUrl?: string;
  slug?: string;
  featured?: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt?: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCategorySlugVariants(value: string) {
  const normalized = slugify(value || "");
  if (!normalized) return [] as string[];

  const variants = new Set<string>([normalized]);
  if (normalized.endsWith("-ies")) variants.add(`${normalized.slice(0, -3)}y`);
  if (normalized.endsWith("-es")) variants.add(normalized.slice(0, -2));
  if (normalized.endsWith("-s")) variants.add(normalized.slice(0, -1));
  return Array.from(variants);
}

function mapProductToPublic(product: any): Product {
  const specs = typeof product.specifications === "string" && product.specifications.trim()
    ? { Details: product.specifications }
    : (product.specifications && typeof product.specifications === "object" ? product.specifications : {});

  const categoryNameResolved = product.categoryName || product.category || "General";
  const categorySlug = getCategorySlugVariants(categoryNameResolved)[0] || slugify(categoryNameResolved);

  return {
    id: product.id,
    name: product.name,
    category: categoryNameResolved,
    categorySlug,
    brand: product.brand || "Coisa Computers",
    model: product.model || "Custom",
    price: Number(product.price || 0),
    stock: Number(product.stockQuantity ?? product.stock ?? 0),
    condition: product.status === "active" ? "Brand New" : product.status,
    description: product.description || "",
    imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : product.image || "/images/tech-showcase.svg",
    slug: slugify(product.name || ""),
    featured: Boolean(product.featured),
    tags: Array.isArray(product.tags) ? product.tags : [],
    specifications: specs,
    createdAt: product.createdAt,
  };
}

export async function GET() {
  const products = await getProducts();
  const categories = await getCategories();
  const categoryById: Record<string, string> = {};
  (categories || []).forEach((c: any) => {
    if (c.id) categoryById[String(c.id)] = String(c.name || "");
  });

  const mapped = products.map((p: any) => {
    // prefer resolving category by categoryId (canonical), then explicit categoryName, then fall back to category field
    const categoryNameResolved = categoryById[String(p.categoryId || "")] || p.categoryName || p.category || "General";
    return mapProductToPublic({ ...p, category: categoryNameResolved, categoryName: categoryNameResolved });
  });

  return NextResponse.json(mapped);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await createProduct({
      name: body.name,
      categoryId: body.categoryId ?? body.category ?? "",
      categoryName: body.categoryName || body.category || "",
      brand: body.brand || "Coisa Computers",
      model: body.model || "Custom",
      description: body.description || "",
      specifications: typeof body.specifications === "string" ? body.specifications : JSON.stringify(body.specifications || {}),
      price: Number(body.price || 0),
      discountPrice: Number(body.discountPrice || 0),
      stockQuantity: Number(body.stock || body.stockQuantity || 0),
      images: Array.isArray(body.images) ? body.images : body.imageUrl ? [body.imageUrl] : [],
      featured: Boolean(body.featured),
      status: body.status || "active",
      sku: body.sku || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      warranty: body.warranty || "",
    });
    return NextResponse.json({ success: true, product: mapProductToPublic(created) });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[DELETE /api/products] Error:", error);
    return NextResponse.json({ error: "Backend connection failed" }, { status: 500 });
  }
}

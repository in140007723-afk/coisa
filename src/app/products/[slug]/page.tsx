"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { formatPrice, readProducts, type Product } from "@/lib/product-store";

function normalizeProduct(item: any): Product {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    category: item?.category ?? "",
    brand: item?.brand ?? "Coisa Computers",
    model: item?.model ?? "Custom",
    price: Number(item?.price ?? 0),
    stock: Number(item?.stock ?? 0),
    condition: item?.condition ?? "Brand New",
    description: item?.description ?? "",
    imageUrl: item?.image_url ?? item?.imageUrl ?? "",
    slug: item?.slug ?? "",
    featured: Boolean(item?.featured),
    tags: Array.isArray(item?.tags) ? item.tags : [],
    specifications: typeof item?.specifications === "object" && item?.specifications ? item.specifications : {},
    createdAt: item?.created_at ?? item?.createdAt ?? "not-available",
  };
}

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        if (response.ok) {
          const payload = await response.json();
          if (Array.isArray(payload)) {
            setProducts(payload.map(normalizeProduct));
            return;
          }
        }
      } catch {
        // fall back to local storage below
      }

      setProducts(readProducts());
    }

    loadProducts();
  }, []);

  const product = useMemo(() => {
    const slug = resolvedParams?.slug ? decodeURIComponent(resolvedParams.slug) : "";
    return products.find((item) => item.slug === slug) ?? null;
  }, [products, resolvedParams]);

  return (
    <SiteShell title={product?.name ?? "Product Details"} description={product?.description ?? "Product details for Coisa Computers"}>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/products" className="text-sm font-semibold text-[#0066FF]">
            ← Back to products
          </Link>
          {product && <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{product.category}</span>}
        </div>

        {product ? (
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <img
                  src={product.imageUrl || "/logo.png.jpeg"}
                  alt={product.name}
                  className="h-72 w-full rounded-2xl object-cover"
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    target.src = "/images/tech-showcase.svg";
                  }}
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-[#0066FF]">{tag}</span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0066FF]">Product details</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">{product.name}</h2>
              <p className="mt-3 text-base leading-8 text-slate-600">{product.description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Brand</p>
                  <p className="mt-1 font-semibold text-slate-900">{product.brand}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Model</p>
                  <p className="mt-1 font-semibold text-slate-900">{product.model}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatPrice(product.price)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Availability</p>
                  <p className="mt-1 font-semibold text-slate-900">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900">Specifications</h3>
                <div className="mt-4 space-y-3">
                  {Object.entries(product.specifications).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-b border-slate-100 pb-3 text-sm text-slate-600">
                      <span>{label}</span>
                      <span className="font-semibold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-full bg-[#0066FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0052cc]">
                  Request quote
                </Link>
                <a href="https://wa.me/254709424843?text=Hello%2C%20I%20am%20interested%20in%20this%20product." target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0066FF] hover:text-[#0066FF]">
                  WhatsApp now
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            This product is not available yet.
          </div>
        )}
      </section>
    </SiteShell>
  );
}

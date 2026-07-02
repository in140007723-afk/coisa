"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { readCategories } from "@/lib/product-store";

const defaultCategoryBoxes = readCategories();

export default function ProductsPage() {
  const [categories, setCategories] = useState<{ id?: string; name: string; description?: string; image?: string }[]>(defaultCategoryBoxes);

  useEffect(() => {
    async function loadCategoriesFromApi() {
      try {
        const res = await fetch("/api/admin/categories");
        if (res.ok) {
          const payload = await res.json();
          setCategories((payload.categories || []).map((c: any) => ({ id: c.id, name: c.name, description: c.description, image: c.image })));
          return;
        }
      } catch (e) {
        // ignore
      }
      setCategories(defaultCategoryBoxes);
    }

    loadCategoriesFromApi();
  }, []);

  return (
    <SiteShell title="Products & Equipment" description="Browse high-performance computers and IT hardware curated for homes, schools, and businesses.">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0066FF]">Catalog</p>
            <h2 className="text-3xl font-semibold text-slate-900">Professional products for every technology need</h2>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            Search, filter, and request quotes in minutes
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category.name} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-48 w-full object-cover"
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-slate-900">{category.name}</h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{category.description || ""}</p>
                <Link href={`/products/category/${encodeURIComponent(category.name)}`} className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0066FF]">
                  View Category
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

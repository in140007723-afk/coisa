"use client";

import { useEffect, useState } from "react";

interface Product {
  id?: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  model: string;
  description: string;
  specifications: string;
  price: number | "";
  discountPrice: number | "";
  stockQuantity: number | "";
  images: string[];
  featured: boolean;
  status: string;
  sku: string;
  tags: string[] | string;
  warranty: string;
}

const emptyForm: Product = {
  name: "",
  categoryId: "",
  categoryName: "",
  brand: "",
  model: "",
  description: "",
  specifications: "",
  price: "",
  discountPrice: "",
  stockQuantity: "",
  images: [] as string[],
  featured: false,
  status: "active",
  sku: "",
  tags: "",
  warranty: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function loadProducts() {
    const response = await fetch("/api/admin/products", { credentials: "include" });
    const data = await response.json();
    setProducts(data.products || []);
  }

  async function loadCategories() {
    try {
      const res = await fetch("/api/admin/categories", { credentials: "include" });
      if (res.ok) {
        const payload = await res.json();
        setCategories(payload.categories || []);
        return;
      }
    } catch (e) {
      // ignore
    }
    setCategories([]);
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
    const handler = () => loadCategories();
    window.addEventListener("categories-updated", handler as EventListener);
    return () => window.removeEventListener("categories-updated", handler as EventListener);
  }, []);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body, credentials: "include" });
    const data = await response.json();
    setUploading(false);
    if (data.success) {
      setForm((current) => ({ ...current, images: [...current.images, data.url] }));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price || 0),
      discountPrice: Number(form.discountPrice || 0),
      stockQuantity: Number(form.stockQuantity || 0),
      tags: typeof form.tags === "string" ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : form.tags,
      categoryName: form.categoryName || (categories.find(c => c.id === form.categoryId)?.name || ""),
    };
    const url = editingId ? "/api/admin/products" : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";
    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload), credentials: "include" });
    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), credentials: "include" });
    loadProducts();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Product Management</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Products</h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Product name e.g. MacBook Pro 14" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" required />
          <select value={form.categoryId} onChange={(event) => {
            const selectedId = event.target.value;
            const selected = categories.find((c) => c.id === selectedId);
            setForm({ ...form, categoryId: selectedId, categoryName: selected?.name || "" });
          }} className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" required>
            <option value="">Select category e.g. Laptop</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} placeholder="Brand e.g. Apple" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} placeholder="Model e.g. M2 Pro" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} placeholder="SKU e.g. MBP14-2023" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input value={form.warranty} onChange={(event) => setForm({ ...form, warranty: event.target.value })} placeholder="Warranty e.g. 1 year" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value === "" ? "" : Number(event.target.value) })} placeholder="Price e.g. 129999.99" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input type="number" value={form.discountPrice} onChange={(event) => setForm({ ...form, discountPrice: event.target.value === "" ? "" : Number(event.target.value) })} placeholder="Discount price e.g. 119999.99" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value === "" ? "" : Number(event.target.value) })} placeholder="Stock quantity e.g. 10" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="Tags (comma separated) e.g. gaming,laptop" className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white">
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-200"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured</label>
        </div>
        <div className="space-y-4">
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description e.g. Lightweight laptop with M2 chip" rows={4} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" required />
          <textarea value={form.specifications} onChange={(event) => setForm({ ...form, specifications: event.target.value })} placeholder="Technical specifications e.g. 16GB RAM, 1TB SSD, 14-inch" rows={4} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-300">
            <p className="mb-2 font-medium text-slate-100">Upload product images</p>
            <input type="file" accept="image/*" onChange={handleUpload} className="w-full text-sm text-slate-300" />
          </div>
          {uploading ? <p className="text-sm text-cyan-300">Uploading image...</p> : null}
          {form.images.length ? (
            <div className="flex flex-wrap gap-2">
              {form.images.map((image) => (
                <div key={image} className="relative h-16 w-16">
                  <img src={image} alt="Product preview" className="h-16 w-16 rounded-xl object-cover" onError={(e) => { e.currentTarget.src = '/images/tech-showcase.svg'; }} />
                  <button type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter(img => img !== image) }))} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                </div>
              ))}
            </div>
          ) : null}
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-4 py-3 font-semibold text-white">{editingId ? "Update Product" : "Save Product"}</button>
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-950/80 text-left text-slate-300">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-800/60">
                <td className="px-4 py-3 font-medium text-white">{product.name}</td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">KSh {product.price}</td>
                <td className="px-4 py-3">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const productCategoryId = (product as any).categoryId || "";
                      const matched = categories.find((c) => c.id === productCategoryId) || categories.find((c) => c.name === ((product as any).categoryName || (product as any).category || ""));
                      setEditingId(product.id || null);
                      const productTags = Array.isArray(product.tags) ? product.tags.join(",") : product.tags || "";
                      setForm({ ...emptyForm, ...product, tags: productTags, categoryId: matched ? matched.id : productCategoryId, categoryName: matched ? matched.name : ((product as any).categoryName || "") });
                    }} className="rounded-full border border-slate-700 px-3 py-1 text-xs">Edit</button>
                    <button onClick={() => handleDelete(product.id || "")} className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-300">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

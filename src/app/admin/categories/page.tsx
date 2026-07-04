"use client";

import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

const emptyForm = { name: "", image: "", description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function loadCategories() {
    const response = await fetch("/api/admin/categories", { credentials: "include" });
    const data = await response.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    loadCategories();
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
      setForm((current) => ({ ...current, image: data.url }));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const response = await fetch("/api/admin/categories", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { ...form, id: editingId } : form), credentials: "include" });
    if (response.ok) {
      setForm(emptyForm);
      setEditingId(null);
      await loadCategories();
      try {
        window.dispatchEvent(new CustomEvent("categories-updated"));
      } catch (e) {
        // ignore in non-browser environments
      }
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/categories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }), credentials: "include" });
    await loadCategories();
    try {
      window.dispatchEvent(new CustomEvent("categories-updated"));
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Category Management</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Categories</h2>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Category name" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" required />
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows={4} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" />
          <input type="file" accept="image/*" onChange={handleUpload} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300" />
          {uploading ? <p className="text-sm text-cyan-300">Uploading image...</p> : null}
          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-4 py-3 font-semibold text-white">{editingId ? "Update Category" : "Save Category"}</button>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
          {form.image ? <img src={form.image} alt="Category preview" className="h-48 w-full rounded-2xl object-cover" /> : <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-700 text-sm text-slate-500">Image preview</div>}
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
            <div className="mb-3 h-28 overflow-hidden rounded-2xl">
              {category.image ? <img src={category.image} alt={category.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-slate-800 text-sm text-slate-500">No image</div>}
            </div>
            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{category.description}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setEditingId(category.id); setForm(category); }} className="rounded-full border border-slate-700 px-3 py-1 text-xs">Edit</button>
              <button onClick={() => handleDelete(category.id)} className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-300">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

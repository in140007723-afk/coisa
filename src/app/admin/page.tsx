import Link from "next/link";
import { getDashboardStats, getEnquiries, getProducts } from "@/lib/admin-store";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const recentProducts = await getProducts({ limit: 4 });
  const recentEnquiries = await getEnquiries({ limit: 5 });

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: stats.products, hint: "Managed inventory" },
          { label: "Categories", value: stats.categories, hint: "Organized groups" },
          { label: "Enquiries", value: stats.enquiries, hint: "Customer requests" },
          { label: "New Enquiries", value: stats.newEnquiries, hint: "Needs attention" },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            <p className="mt-2 text-sm text-cyan-300">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Recently uploaded products</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Latest inventory</h3>
            </div>
            <Link href="/admin/products" className="text-sm text-cyan-300 hover:text-cyan-200">View all</Link>
          </div>
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                <div>
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-slate-400">{product.brand} • {product.stockQuantity} in stock</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">{product.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Latest enquiries</p>
              <h3 className="mt-1 text-xl font-semibold text-white">Customer activity</h3>
            </div>
            <Link href="/admin/enquiries" className="text-sm text-cyan-300 hover:text-cyan-200">Open</Link>
          </div>
          <div className="space-y-3">
            {recentEnquiries.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{item.customerName}</p>
                  <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300">{item.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{item.subject}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

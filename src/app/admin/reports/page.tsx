export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Reports</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Sales and performance overview</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <h3 className="text-lg font-semibold text-white">Store KPIs</h3>
          <p className="mt-3 text-sm text-slate-400">Track product performance, enquiry volume, and inventory health.</p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
          <h3 className="text-lg font-semibold text-white">Upcoming analytics</h3>
          <p className="mt-3 text-sm text-slate-400">Charts and deeper reporting can be connected to the same admin data layer.</p>
        </div>
      </div>
    </div>
  );
}

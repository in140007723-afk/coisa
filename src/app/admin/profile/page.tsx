"use client";

import Link from "next/link";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Profile</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Administrator account</h2>
        <p className="mt-2 text-sm text-slate-400">Manage your account and open the password settings area from here.</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Name</label>
            <input className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" defaultValue="System Admin" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" defaultValue="coisacomputers@gmail.com" />
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <h3 className="text-lg font-semibold text-white">Security</h3>
          <p className="mt-2 text-sm text-slate-400">Change your administrator password from the password settings page.</p>
          <Link href="/admin/settings" className="mt-4 inline-flex rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-4 py-2 text-sm font-semibold text-white">
            Open password settings
          </Link>
        </div>
      </div>
    </div>
  );
}

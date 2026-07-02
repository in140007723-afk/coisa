"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (!currentPassword) {
      setMessage("Please enter your current password.");
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setMessage("Password must be at least 4 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.success) {
      setMessage(data.message || "Unable to update password.");
      return;
    }

    setMessage("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Settings</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Password settings</h2>
        <p className="mt-2 text-sm text-slate-400">Update the admin password here. The new password will be stored in the database.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Current password</label>
            <input value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Enter your current password" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">New password</label>
            <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Enter a new password" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
            <input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Confirm the new password" required />
          </div>
        </div>

        {message ? <div className={`mt-4 rounded-2xl border p-3 text-sm ${message.includes("success") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-rose-500/30 bg-rose-500/10 text-rose-300"}`}>{message}</div> : null}

        <button type="submit" disabled={loading} className="mt-6 rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

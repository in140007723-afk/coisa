"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("coisacomputers@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok || !data.success) {
      setError(data.message || "Invalid credentials");
      return;
    }

    // Ensure the httpOnly session cookie is accepted by the browser/server
    // before navigating to the admin shell. Retry a few times if needed.
    let verified = false;
    for (let i = 0; i < 4; i++) {
      try {
        const v = await fetch("/api/auth/verify", { cache: "no-store", credentials: "include" });
        if (v.ok) {
          verified = true;
          break;
        }
      } catch (e) {
        /* ignore */
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    if (!verified) {
      setError("Login succeeded but session verification failed. Try again.");
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-blue-950/40">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Admin Access</p>
            <h1 className="mt-3 text-3xl font-semibold">Coisa Computers Admin</h1>
            <p className="mt-3 text-sm text-slate-400">Secure login for managing products, enquiries, and orders.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0" />
            </div>
            {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</div> : null}
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            <Link href="/" className="text-cyan-300 hover:text-cyan-200">Back to website</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminThemeToggle } from "@/components/admin-theme-toggle";

async function checkServerSession(): Promise<"authenticated" | "unauthenticated" | "unknown"> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("/api/auth/verify", {
      cache: "no-store",
      credentials: "include",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      return "authenticated";
    }

    if (res.status === 401 || res.status === 403) {
      return "unauthenticated";
    }

    return "unknown";
  } catch {
    return "unknown";
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const lastCheckedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") {
      lastCheckedPathRef.current = pathname;
      setIsReady(true);
      setIsAuthenticated(true);
      return;
    }

    if (lastCheckedPathRef.current === pathname) {
      return;
    }

    lastCheckedPathRef.current = pathname;

    let mounted = true;
    (async () => {
      const result = await checkServerSession();
      if (!mounted) return;

      if (result === "authenticated") {
        setIsAuthenticated(true);
        setIsReady(true);
        return;
      }

      if (result === "unauthenticated") {
        setIsAuthenticated(false);
        setIsReady(true);
        router.replace("/admin/login");
        return;
      }

      setIsAuthenticated(true);
      setIsReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (!isReady) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">Checking access…</div>;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="admin-shell min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-[var(--admin-border)] bg-[var(--admin-panel)] lg:w-72 lg:border-b-0 lg:border-r">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-lg font-semibold">C</div>
              <div>
                <p className="font-semibold">Coisa Admin</p>
                <p className="text-sm text-slate-400">Management Portal</p>
              </div>
            </div>
          </div>
          <nav className="px-4 pb-6">
            {[
              ["/admin", "Dashboard"],
              ["/admin/products", "Products"],
              ["/admin/categories", "Categories"],
              ["/admin/enquiries", "Customer Enquiries"],
              ["/admin/reports", "Reports"],
              ["/admin/profile", "Profile"],
            ].map(([href, label]) => (
              <Link key={href} href={href as string} className="mb-2 flex rounded-2xl px-4 py-3 text-sm font-medium text-[var(--admin-muted)] transition hover:bg-[var(--admin-panel-strong)] hover:text-[var(--admin-text)]">
                {label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <header className="border-b border-[var(--admin-border)] bg-[var(--admin-panel)] px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-[var(--admin-muted)]">Welcome back</p>
                <h2 className="text-xl font-semibold text-[var(--admin-text)]">Admin Dashboard</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-panel-strong)] px-3 py-2 text-sm text-[var(--admin-text)]">{new Date().toLocaleDateString()}</div>
                <AdminThemeToggle />
                <Link href="/api/admin/logout" className="rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300">Logout</Link>
              </div>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

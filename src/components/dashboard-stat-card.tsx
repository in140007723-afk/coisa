import type { ReactNode } from "react";

export function DashboardStatCard({
  icon,
  title,
  value,
  trend,
  difference,
  className,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
  trend: "up" | "down" | "steady";
  difference: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl bg-slate-900 p-3 text-cyan-300">{icon}</div>
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${trend === "up" ? "bg-emerald-500/15 text-emerald-300" : trend === "down" ? "bg-rose-500/15 text-rose-300" : "bg-slate-800/80 text-slate-300"}`}>
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {difference}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

import { PlusCircle, ImagePlus, FileText, Database, ShieldCheck, Shield, UploadCloud } from "lucide-react";

const actions = [
  { id: "add-product", label: "Add Product", icon: PlusCircle },
  { id: "add-category", label: "Add Category", icon: Shield },
  { id: "upload-images", label: "Upload Images", icon: ImagePlus },
  { id: "create-blog", label: "Create Blog Post", icon: FileText },
  { id: "view-quotations", label: "View Quotations", icon: FileText },
  { id: "generate-report", label: "Generate Report", icon: Database },
  { id: "backup-db", label: "Backup Database", icon: UploadCloud },
];

export function QuickActions({ onAction }: { onAction: (actionId: string) => void }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Quick actions</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Shortcut commands</h3>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action.id)}
              className="group flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-4 text-left transition hover:border-cyan-500 hover:bg-slate-900"
            >
              <div className="rounded-2xl bg-cyan-500 p-3 text-white transition group-hover:bg-cyan-400">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{action.label}</p>
                <p className="mt-1 text-sm text-slate-400">Open the {action.label.toLowerCase()} workflow.</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

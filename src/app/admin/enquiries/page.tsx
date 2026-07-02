"use client";

import { useEffect, useState } from "react";

interface Enquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  adminReply: string;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  async function loadEnquiries() {
    const response = await fetch("/api/admin/enquiries");
    const data = await response.json();
    setEnquiries(data.enquiries || []);
  }

  useEffect(() => {
    loadEnquiries();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/enquiries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    loadEnquiries();
  }

  async function submitReply(id: string) {
    await fetch("/api/admin/enquiries", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, adminReply: reply, status: "Replied" }) });
    setReply("");
    loadEnquiries();
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/enquiries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    loadEnquiries();
  }

  const selected = enquiries.find((item) => item.id === selectedId) || enquiries[0];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Customer Enquiries</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Inbox</h2>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
          {enquiries.map((item) => (
            <button key={item.id} onClick={() => { setSelectedId(item.id); setReply(item.adminReply || ""); }} className={`w-full rounded-2xl border p-4 text-left ${selectedId === item.id || (!selectedId && item.id === selected?.id) ? "border-cyan-400/40 bg-slate-800" : "border-slate-800 bg-slate-950/70"}`}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{item.customerName}</p>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">{item.status}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{item.subject}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{selected.subject}</p>
                <p className="mt-1 text-sm text-slate-400">{selected.customerName} • {selected.email}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(selected.id, "Pending")} className="rounded-full border border-slate-700 px-3 py-1 text-sm">Pending</button>
                <button onClick={() => updateStatus(selected.id, "Closed")} className="rounded-full border border-slate-700 px-3 py-1 text-sm">Closed</button>
                <button onClick={() => handleDelete(selected.id)} className="rounded-full border border-rose-500/40 px-3 py-1 text-sm text-rose-300">Delete</button>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">Customer message</p>
              <p className="mt-2 leading-7">{selected.message}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
              <p className="font-medium text-white">Admin reply</p>
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={4} className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white" placeholder="Write a response..." />
              <div className="mt-3 flex gap-3">
                <button onClick={() => submitReply(selected.id)} className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-4 py-2 text-sm font-semibold text-white">Send Reply</button>
                <button onClick={() => updateStatus(selected.id, "Pending")} className="rounded-full border border-slate-700 px-4 py-2 text-sm">Mark Pending</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

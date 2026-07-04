"use client";

import { Facebook, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { createInquiry, readInquiries, saveInquiries } from "@/lib/product-store";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    organization: "",
    message: "",
    selectedProducts: "",
  });
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextInquiry = createInquiry({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      organization: form.organization.trim(),
      message: form.message.trim(),
      selectedProducts: form.selectedProducts.split("\n").map((item) => item.trim()).filter(Boolean),
    });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextInquiry),
      });

      if (response.ok) {
        const inquiries = readInquiries();
        saveInquiries([nextInquiry, ...inquiries]);
      }
    } catch {
      const inquiries = readInquiries();
      saveInquiries([nextInquiry, ...inquiries]);
    }

    setSubmitted(true);
    setForm({ name: "", phone: "", email: "", organization: "", message: "", selectedProducts: "" });
  }

  return (
    <SiteShell title="Contact Coisa Computers" description="Reach out for products, services, quotations, and support.">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0066FF]">Contact us</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Let’s talk about your next project</h2>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Whether you need a laptop, a laptop bag, a desktop, or repair support, our team is ready to help.
          </p>
          <div className="mt-8 space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0066FF]">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <div className="mt-1 space-y-1 text-[#0066FF]">
                  <a href="tel:0709424843" className="block">0709424843</a>
                  <a href="tel:+254709424843" className="block">+254 709 424 843</a>
                  <a href="tel:+254728953325" className="block">+254 728 953 325</a>
                  <a href="tel:+254705656849" className="block">+254 705 656 849</a>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0066FF]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">WhatsApp</p>
                <a href="https://wa.me/254709424843" target="_blank" rel="noreferrer" className="mt-1 inline-block text-[#0066FF]">+254 709 424 843</a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0066FF]">
                <Facebook className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Facebook</p>
                <a href="https://www.facebook.com/coisacomputers" target="_blank" rel="noreferrer" className="mt-1 inline-block text-[#0066FF]">Coisa Computers</a>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0066FF]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Location</p>
                <p className="mt-1">Kericho, directly opposite Huduma Centre Kericho Parking Gate</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-900">Email:</span> <a href="mailto:coisacomputers@gmail.com" className="text-[#0066FF]">coisacomputers@gmail.com</a></div>
            <div className="rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-900">Hours:</span> Mon–Sat 8:00 AM – 7:00 PM, Sunday 2:00 PM – 7:00 PM</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Send an inquiry</h3>
          <div className="mt-6 grid gap-4">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-500" required />
            <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone number" className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-500" required />
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-500" required />
            <input value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} placeholder="Organization" className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-500" />
            <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="How can we help?" rows={4} className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-500" required />
            <textarea value={form.selectedProducts} onChange={(event) => setForm({ ...form, selectedProducts: event.target.value })} placeholder="Products of interest (one per line)" rows={4} className="rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-500" />
          </div>
          <button type="submit" className="mt-6 rounded-full bg-[#0066FF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0052cc]">
            Submit inquiry
          </button>
          {submitted && <p className="mt-4 text-sm font-semibold text-emerald-600">Your inquiry has been recorded.</p>}
        </form>
      </section>
    </SiteShell>
  );
}

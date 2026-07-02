import { SiteShell } from "@/components/site-shell";

const services = [
  {
    title: "Computer Repairs",
    description: "Fast diagnostics and professional repair for desktops, laptops, and peripherals.",
    benefits: ["Same-day diagnostics", "Affordable replacement parts", "Data-safe repairs"],
  },
  {
    title: "Laptop Bags",
    description: "Durable laptop bags designed for professionals, students, and everyday travel.",
    benefits: ["Padded compartments", "Professional design", "Secure carry options"],
  },
  {
    title: "Laptop Accessories",
    description: "Useful accessories such as chargers, sleeves, mice, and productivity essentials.",
    benefits: ["Reliable accessories", "Affordable upgrades", "Easy compatibility"],
  },
  {
    title: "Software Installation",
    description: "Setup and configuration of operating systems, business software, and security tools.",
    benefits: ["Licensed software", "Driver and patch updates", "User training"],
  },
  {
    title: "IT Consultancy",
    description: "Technology planning and strategic advice tailored to your growth and operations.",
    benefits: ["Digital transformation planning", "Infrastructure advisory", "Procurement support"],
  },
  {
    title: "Data Recovery",
    description: "Secure recovery of critical business and personal data from damaged devices.",
    benefits: ["Confidential handling", "High recovery success", "Emergency support"],
  },
];

export default function ServicesPage() {
  return (
    <SiteShell title="Our Services" description="A full suite of professional IT services built to keep your business productive and secure.">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">{service.title}</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{service.description}</p>
              <div className="mt-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0066FF]">Benefits</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#00C2FF]" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mt-6 rounded-full bg-[#0066FF] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0052cc]">
                Request Pricing
              </button>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

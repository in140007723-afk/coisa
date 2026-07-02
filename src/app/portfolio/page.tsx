import { SiteShell } from "@/components/site-shell";

const projects = [
  {
    title: "Laptop Bag Supply for Schools",
    industry: "Education",
    result: "Delivered durable carry solutions and accessories for students and staff.",
    image: "/images/tech-showcase.svg",
  },
  {
    title: "Laptop Setup for Small Offices",
    industry: "SMEs",
    result: "Delivered reliable laptops and accessories for productive daily operations.",
    image: "/images/tech-showcase.svg",
  },
  {
    title: "Accessory and Travel Pack Bundle",
    industry: "Retail",
    result: "Built practical bundles for professionals and frequent travellers.",
    image: "/images/tech-showcase.svg",
  },
];

export default function PortfolioPage() {
  return (
    <SiteShell title="Portfolio" description="A showcase of reliable laptop, accessory, and IT solutions delivered across industries.">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img src={project.image} alt={project.title} className="h-56 w-full object-cover" />
              <div className="p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0066FF]">{project.industry}</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">{project.title}</h3>
                <p className="mt-3 text-base leading-8 text-slate-600">{project.result}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

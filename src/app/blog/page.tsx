import { SiteShell } from "@/components/site-shell";

const posts = [
  { title: "How to choose the right laptop for your business", category: "Product Reviews", excerpt: "A practical guide to balancing performance, battery life, and budget." },
  { title: "Top cybersecurity habits for modern teams", category: "Cybersecurity", excerpt: "Protect devices and networks with a few smart everyday habits." },
  { title: "Why a good laptop bag matters for daily travel", category: "Accessories", excerpt: "Improve comfort and protection with the right carry solution." },
];

export default function BlogPage() {
  return (
    <SiteShell title="Insights & Advice" description="Helpful technology articles for buyers, business owners, and IT teams.">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0066FF]">{post.category}</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{post.title}</h3>
              <p className="mt-4 text-base leading-8 text-slate-600">{post.excerpt}</p>
              <button className="mt-6 text-sm font-semibold text-[#0066FF]">Read More →</button>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

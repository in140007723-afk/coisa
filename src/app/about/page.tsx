import { SiteShell } from "@/components/site-shell";

const values = ["Integrity", "Innovation", "Reliability", "Customer Focus", "Excellence"];

const team = [
  { name: "Grace Njeri", role: "Managing Director", bio: "Leads strategic growth and client partnerships." },
  { name: "Daniel Mugo", role: "Technical Lead", bio: "Oversees installations, support, and system design." },
  { name: "Amina Hassan", role: "Solutions Consultant", bio: "Builds tailored IT roadmaps for growing businesses." },
];

const timeline = [
  { year: "2012", title: "Founded", text: "Started as a trusted local IT service provider." },
  { year: "2016", title: "Expanded Product Line", text: "Added laptops, desktops, printers, and travel-friendly laptop accessories." },
  { year: "2020", title: "Enterprise Support", text: "Scaled support services for schools, NGOs, and corporates." },
  { year: "2024", title: "Digital Growth", text: "Strengthened online quoting, remote support, and cloud solutions." },
];

export default function AboutPage() {
  return (
    <SiteShell title="About Coisa Computers" description="A professional technology partner delivering reliable devices, systems, and support for modern organizations.">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-semibold text-slate-900">Company Overview</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Coisa Computers is a professional technology company focused on delivering dependable laptops, accessories, laptop bags, and tailored IT solutions to individuals, schools, businesses, and government institutions.
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Our team combines product expertise, hands-on technical support, and friendly service to help customers make smart technology choices with confidence.
            </p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-[#0066FF] to-[#0F172A] p-8 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Why we exist</p>
            <h3 className="mt-4 text-2xl font-semibold">Make technology simple, secure, and scalable.</h3>
            <p className="mt-4 text-base leading-8 text-blue-50">
              We help clients choose the right devices, deploy reliable infrastructure, and keep operations running smoothly through expert support.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Mission</h3>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              To deliver innovative technology solutions that empower people and businesses to work smarter, faster, and more securely.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">Vision</h3>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              To become the leading technology solutions provider recognized for quality, trust, and excellence in every deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900">Core Values</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {values.map((value) => (
              <div key={value} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-700">
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] font-semibold text-white">
                {member.name.split(" ").map((part) => part[0]).join("")}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{member.name}</h3>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0066FF]">{member.role}</p>
              <p className="mt-4 text-base leading-7 text-slate-600">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900">Company Timeline</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.year} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-[#0066FF]">{item.year}</p>
                <h4 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

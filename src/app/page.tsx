"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Cpu, Headphones, MonitorSmartphone, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { SiteShell } from "@/components/site-shell";

const whyChooseUs = [
  { icon: ShieldCheck, title: "Quality Products", description: "Premium devices from trusted brands and reliable suppliers." },
  { icon: Wrench, title: "Expert Technicians", description: "Skilled teams for repairs, installations, and support." },
  { icon: Headphones, title: "Fast Support", description: "Responsive service for urgent technical issues and inquiries." },
  { icon: BriefcaseBusiness, title: "Affordable Pricing", description: "Competitive pricing for individuals and growing businesses." },
  { icon: Cpu, title: "Genuine Accessories", description: "Original peripherals, laptop sleeves, chargers, and travel essentials." },
  { icon: MonitorSmartphone, title: "Business Solutions", description: "Scalable IT setups tailored to your daily operations." },
];

const featuredProducts = [
  { name: "Laptops", description: "Business-ready laptops for work, study, and mobility.", image: "/images/laptop.png" },
  { name: "Desktop PCs", description: "Reliable workstations for offices, schools, and creative users.", image: "/images/desktop.png" },
  { name: "Laptop Bags", description: "Professional and travel-friendly bags for students, commuters, and business users.", image: "/images/laptopbag.png" },
  { name: "Printers", description: "High-quality printers for home, office, and business printing needs.", image: "/images/printers.png" },
  { name: "Computer Accessories", description: "Essential accessories like mice, keyboards, chargers, and cables.", image: "/images/accessories.png" },
];

const services = [
  { title: "Computer Repairs", icon: Wrench },
  { title: "Software Installation", icon: Sparkles },
  { title: "Laptop Bags", icon: MonitorSmartphone },
  { title: "Accessories", icon: ShieldCheck },
  { title: "Data Recovery", icon: Cpu },
  { title: "IT Consultancy", icon: BriefcaseBusiness },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "1000+", label: "Devices Sold" },
  { value: "300+", label: "Projects Completed" },
  { value: "24/7", label: "Support" },
];

const testimonials = [
  { name: "Sarah Kimani", company: "BrightPath Academy", review: "The team upgraded our computer lab quickly and professionally. Service was outstanding from start to finish." },
  { name: "James Otieno", company: "Northstar Logistics", review: "We needed a secure office network and they delivered a clean, high-performance setup with excellent support." },
];

const faqs = [
  { question: "Do you offer both retail and business IT services?", answer: "Yes. We support individuals, schools, NGOs, and corporate clients with hardware sales, installations, repairs, and managed IT support." },
  { question: "Can I request a quotation online?", answer: "Absolutely. Use the contact form or request quote button to share your needs and receive a tailored proposal." },
  { question: "Do you provide installation and maintenance support?", answer: "Yes. We handle laptop setup, accessory fitting, software deployment, maintenance plans, and ongoing technical support." },
];

export default function Home() {
  return (
    <SiteShell title="Your Trusted Technology Partner" description="Providing high-quality laptops, accessories, laptop bags, and professional IT services for individuals and businesses.">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Premium technology, dependable support</p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Modern devices, <span className="text-cyan-300">smart IT solutions</span>, and expert service in one place.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              From laptops and desktops to laptop bags, accessories, repairs, maintenance, and dependable tech support, Coisa Computers helps organizations stay productive and secure.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/products" className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl">
                Shop Products
              </Link>
              <Link href="/contact" className="rounded-full border border-cyan-400/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-cyan-300 hover:text-cyan-200">
                Request a Quote
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="rounded-[2rem] border border-blue-400/30 bg-[#0b1f3d] p-3 shadow-[0_30px_80px_-24px_rgba(0,102,255,0.4)]">
            <Image
              src="/images/home.png"
              alt="Home page technology showcase"
              width={1024}
              height={420}
              className="h-[420px] w-full rounded-[1.5rem] object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Why choose us</p>
          <h3 className="text-3xl font-semibold text-white">Trusted by clients who value quality and speed</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {whyChooseUs.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#0d2a57] to-[#123d83] p-8 shadow-[0_12px_40px_-18px_rgba(0,102,255,0.25)] transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#00C2FF] text-white shadow-lg shadow-blue-500/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-6 text-xl font-semibold text-white">{item.title}</h4>
                <p className="mt-3 text-base leading-7 text-slate-300">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-[#071120] via-[#0d2b59] to-[#0d63df] p-8 text-white shadow-[0_30px_80px_-24px_rgba(0,102,255,0.45)] lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Featured products</p>
            <h3 className="text-3xl font-semibold">Premium solutions for every workflow</h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {featuredProducts.map((product) => (
              <div key={product.name} className="overflow-hidden rounded-[1.5rem] bg-white/10 backdrop-blur-sm">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={192}
                  className="h-48 w-full object-cover"
                  unoptimized
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold">{product.name}</h4>
                  <p className="mt-3 text-sm leading-7 text-blue-50">{product.description}</p>
                  <Link href="/products" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Services overview</p>
          <h3 className="text-3xl font-semibold text-white">Comprehensive technology support</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#0d2a57] to-[#123d83] p-8 shadow-[0_12px_35px_-18px_rgba(0,102,255,0.22)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50/10 text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="mt-6 text-xl font-semibold text-white">{service.title}</h4>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-[#0d2a57] to-[#123d83] p-8 shadow-[0_12px_35px_-18px_rgba(0,102,255,0.2)] md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-slate-50 p-6 text-center">
              <p className="text-3xl font-semibold text-cyan-300">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Testimonials</p>
          <h3 className="text-3xl font-semibold text-white">What our clients say</h3>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/70 p-8 shadow-[0_12px_35px_-18px_rgba(2,132,199,0.2)]">
              <p className="text-base leading-8 text-slate-600">“{item.review}”</p>
              <div className="mt-6">
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm text-slate-500">{item.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-[#0d2a57] to-[#123d83] p-8 shadow-[0_12px_40px_-18px_rgba(0,102,255,0.2)] lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Frequently asked questions</p>
            <h3 className="text-3xl font-semibold text-white">Everything you need to know before you reach out</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-blue-400/20 bg-[#0b1f3d] p-6">
                <h4 className="font-semibold text-white">{faq.question}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-[#071120] via-[#0F172A] to-[#0066FF] p-10 text-center text-white shadow-[0_30px_80px_-24px_rgba(15,23,42,0.6)]">
          <h3 className="text-3xl font-semibold">Need reliable IT solutions?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-300">
            Let’s discuss your project, hardware needs, or support requirements and build a solution that fits your business.
          </p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-[#00C2FF] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Contact Us Today
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

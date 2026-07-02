import { Clock3, Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <header className="sticky top-0 z-50 border-b border-blue-500/30 bg-[#071120]/95 text-white shadow-[0_12px_40px_-20px_rgba(0,102,255,0.45)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/70 bg-gradient-to-br from-[#0066FF] to-[#00C2FF] shadow-lg shadow-blue-500/20">
              <Image src="/logo.png.jpeg" alt="Coisa Computers logo" width={48} height={48} className="h-full w-full object-contain" unoptimized />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Coisa Computers</p>
              <p className="text-sm text-blue-100">Technology Solutions</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-blue-100 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white hover:underline decoration-cyan-400 decoration-2 underline-offset-4">
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="rounded-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:translate-y-[-1px] hover:shadow-xl"
          >
            Request Quote
          </Link>
        </div>
      </header>

      <main>
        <section className="border-b border-blue-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(0,102,255,0.28),_transparent_24%),linear-gradient(135deg,_#071120_0%,_#103a78_45%,_#0e59c6_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/40 bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                {title}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {description}
              </h1>
            </div>
          </div>
        </section>
        {children}
      </main>

      <footer className="border-t border-blue-500/30 bg-[#071120] text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div>
            <p className="text-lg font-semibold text-white">Coisa Computers</p>
            <p className="mt-3 max-w-sm text-sm leading-7">
              Delivering dependable laptops, accessories, laptop bags, and professional IT support for homes, schools, and businesses.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-300" />
                <a href="tel:+254709424843" className="transition hover:text-white">+254 709 424 843</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-cyan-300" />
                <a href="https://wa.me/254709424843" target="_blank" rel="noreferrer" className="transition hover:text-white">WhatsApp: +254 709 424 843</a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-cyan-300" />
                <a href="https://www.facebook.com/coisacomputers" target="_blank" rel="noreferrer" className="transition hover:text-white">Facebook: Coisa Computers</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <span>Kericho, Opposite Huduma Centre Kericho Parking Gate</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-300" />
                <a href="mailto:coisacomputers@gmail.com" className="transition hover:text-white">coisacomputers@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-cyan-300" />
                <span>Mon–Sat: 8:00 AM – 7:00 PM | Sun: 2:00 PM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

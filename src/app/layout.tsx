import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coisa Computers | Laptop Store, Accessories & IT Solutions",
  description: "Coisa Computers provides laptops, accessories, laptop bags, computer sales, repairs, and trusted IT support in Kericho.",
  keywords: ["Coisa Computers", "Laptop Store", "Laptop Bags", "Computer Sales", "IT Support", "Kericho"],
  icons: {
    icon: [{ url: "/logo.png.jpeg?v=2", type: "image/jpeg" }],
    shortcut: [{ url: "/logo.png.jpeg?v=2", type: "image/jpeg" }],
    apple: [{ url: "/logo.png.jpeg?v=2", type: "image/jpeg" }],
  },
  openGraph: {
    title: "Coisa Computers | Laptop Store, Accessories & IT Solutions",
    description: "Professional technology provider for laptops, accessories, laptop bags, repairs, and tailored business support.",
    type: "website",
    url: "https://coisacomputers.co.ke",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png.jpeg?v=2" type="image/jpeg" sizes="any" />
        <link rel="shortcut icon" href="/logo.png.jpeg?v=2" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.png.jpeg?v=2" />
      </head>
      <body className="min-h-full flex flex-col bg-sky-50 text-slate-800">{children}</body>
    </html>
  );
}

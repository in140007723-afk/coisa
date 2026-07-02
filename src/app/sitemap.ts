import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://coisacomputers.co.ke";
  return [
    { url: baseUrl },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/products` },
    { url: `${baseUrl}/services` },
    { url: `${baseUrl}/portfolio` },
    { url: `${baseUrl}/blog` },
    { url: `${baseUrl}/contact` },
  ];
}

import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Old namuun.mn URLs keep working: /products/<id> → /p/<slug>, /products → /shop, info pages → /info.
const catalog = JSON.parse(readFileSync(path.join(process.cwd(), "src", "data", "catalog.json"), "utf8")) as { products: { id: string; slug: string }[] };
const productRedirects = catalog.products.map((p) => ({ source: `/products/${p.id}`, destination: `/p/${p.slug}`, permanent: true }));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Photos are pre-sized WebP (380 px thumbs, up to 760 px large, named by source hash), so they are served as-is.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/products", destination: "/shop", permanent: true },
      ...productRedirects,
      { source: "/products/:id", destination: "/shop", permanent: false },
      { source: "/category/:path*", destination: "/shop", permanent: false },
      { source: "/checkout/:path*", destination: "/cart", permanent: false },
      { source: "/checkout", destination: "/cart", permanent: true },
      { source: "/about", destination: "/info", permanent: true },
      { source: "/faq", destination: "/info#faq", permanent: true },
      { source: "/contact", destination: "/info#branches", permanent: true },
      { source: "/branches", destination: "/info#branches", permanent: true },
      { source: "/delivery-terms", destination: "/info#delivery", permanent: true },
      { source: "/terms", destination: "/info", permanent: false },
      { source: "/privacy", destination: "/info", permanent: false },
      { source: "/order-check", destination: "/info#status", permanent: false },
      { source: "/news/:path*", destination: "/", permanent: false },
      { source: "/partners", destination: "/shop", permanent: false },
      { source: "/profile/:path*", destination: "/", permanent: false },
      { source: "/login", destination: "/", permanent: false },
      { source: "/register", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/img/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;

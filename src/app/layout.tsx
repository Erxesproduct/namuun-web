import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AddedToast, BottomBar } from "@/components/header-tools";
import { business } from "@/content/business";
import { siteUrl } from "@/lib/site-url";
import { nunito } from "./fonts";
import "./globals.css";

const description = `${business.title}: ${business.tagline}. Живх, угж, соосог, хуурай сүү, хүүхдийн хоол, арьс арчилгаа, ахуйн бараа. Pigeon, Huggies, Momotaro, Dr.Brown's зэрэг 50 брэнд. Улаанбаатарт 24–48 цагт хүргэнэ, 7 салбар.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.title}: ${business.tagline}`, template: `%s · ${business.name}` },
  description,
  openGraph: { type: "website", siteName: business.title, locale: "mn_MN", description, images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0e2b52", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={nunito.variable} suppressHydrationWarning>
      <head>
        {/* scroll-reveal hides blocks only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-night focus:px-4 focus:py-2 focus:text-white">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BottomBar />
        <AddedToast />
      </body>
    </html>
  );
}

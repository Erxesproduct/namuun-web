import "server-only";

import data from "@/data/catalog.json";

export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Product = {
  /** namuun.mn product id; erxes product code NM-<id> */
  id: string;
  /** the shop's item code (POS code), used for stock */
  code: string;
  slug: string;
  title: string;
  brand: string | null;
  /** diapers | baby | food | care | home | mama | toys | namuun */
  group: string;
  /** diaper size (NB…XXXL, JB) or a sub-shelf */
  sub: string | null;
  /** formula stage 1–4 */
  stage: number | null;
  /** diapers: the weight range written in the name, kg */
  kg: [number, number] | null;
  /** diapers: «наадаг» (tape) or «өмсдөг» (pants) */
  fit: "tape" | "pants" | null;
  /** pieces in the pack, as written in the name */
  pcs: number | null;
  price: number;
  /** online stock across the branches on 2026-11-20 (sum of positive balances); null = no balance record */
  stock: number | null;
  /** namuun.mn branch ids that had it */
  branches: number[];
  featured: boolean;
  rating: { avg: number; n: number } | null;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; short: string; line: string; icon: string; count: number; subs: { name: string; count: number }[] };
export type Brand = { name: string; slug: string; count: number };
export type Branch = { n: number; place: string; address: string; phone: string; tel: string; apiId: number | null; apiName: string | null; online: boolean };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const brands = data.brands as Brand[];
export const branches = data.branches as Branch[];
export const shop = data.shop;
export const catalogInfo = { source: data.source, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getById = (id: string) => byId.get(id);
export const getGroup = (id: string) => groups.find((g) => g.id === id);
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);
export const brandSlug = (name: string) => brands.find((b) => b.name === name)?.slug ?? null;
export const sku = (id: string) => `NM-${id}`;

export const soldOut = (p: Pick<Product, "stock">) => p.stock === 0;
export const cover = (p: Product) => p.images[0]?.thumb ?? null;

/** In stock first, the shop's featured items, then most stocked (a proxy for best sellers), then newest. */
export const byPopularity = (a: Product, b: Product) =>
  Number(!soldOut(b)) - Number(!soldOut(a)) || Number(b.featured) - Number(a.featured) || (b.stock ?? 0) - (a.stock ?? 0) || b.createdAt.localeCompare(a.createdAt);
export const popular = [...products].sort(byPopularity);
export const newest = [...products].filter((p) => !soldOut(p)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const inGroup = (g: string) => popular.filter((p) => p.group === g);

/** Diaper sizes with the weight most packs of that size print (median of the ranges in the names). */
export const DIAPER_SIZES = (() => {
  const g = getGroup("diapers");
  if (!g) return [];
  const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  return g.subs.map((s) => {
    const ranges = products.filter((p) => p.group === "diapers" && p.sub === s.name && p.kg).map((p) => p.kg!);
    const from = ranges.length ? median(ranges.map((r) => r[0])) : null;
    const toRaw = ranges.length ? median(ranges.map((r) => r[1])) : null;
    return { size: s.name, count: s.count, from, to: toRaw != null && toRaw >= 40 ? null : toRaw, samples: ranges.length };
  });
})();

export const SIZE_NAMES: Record<string, string> = { JB: "Дутуу төрсөн", NB: "Нярай", S: "S", M: "M", L: "L", XL: "XL", XXL: "XXL", XXXL: "XXXL" };

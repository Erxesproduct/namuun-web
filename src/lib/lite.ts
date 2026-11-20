import data from "@/data/lite.json";

/** One per product, for the browser (cart, search, hearts): i id, s slug, n title, b brand, g group, p price, k stock (null = unknown), t thumb. */
export type LiteProduct = { i: string; s: string; n: string; b: string | null; g: string; p: number; k: number | null; t: string | null };

export const liteProducts = data as LiteProduct[];
const byId = new Map(liteProducts.map((v) => [v.i, v]));
export const getLite = (id: string) => byId.get(id);
export const isSoldOut = (v: Pick<LiteProduct, "k">) => v.k === 0;

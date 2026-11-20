// node scripts/export-erxes.mjs → docs/erxes/namuun-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `NM-${id.toUpperCase()}`;

// categories: NM → the shop's shelves (diapers, baby, food, …) → sizes / sub-shelves, plus delivery
const cats = [["code", "name", "parent code"], ["NM", "Намуун", ""]];
for (const g of c.groups) {
  cats.push([code(g.id), g.name, "NM"]);
  for (const [i, s] of g.subs.entries()) cats.push([`${code(g.id)}-${i + 1}`, s.name, code(g.id)]);
}
cats.push(["NM-DELIVERY", "Хүргэлт", "NM"]);
writeFileSync(path.join(out, "namuun-categories.csv"), csv(cats));

const subCode = (p) => {
  const g = c.groups.find((x) => x.id === p.group);
  const i = (g?.subs ?? []).findIndex((s) => s.name === p.sub);
  return i >= 0 ? `${code(p.group)}-${i + 1}` : code(p.group);
};
const rows = [["code", "name", "category code", "type", "unit price", "brand", "namuun item code", "online stock 2026-11-20", "diaper size", "diaper kg", "diaper type", "pieces", "namuun product id", "image (website path)"]];
for (const p of c.products)
  rows.push([
    `NM-${p.id}`,
    p.title.slice(0, 200),
    subCode(p),
    "product",
    p.price,
    p.brand ?? "",
    p.code,
    p.stock ?? "",
    p.group === "diapers" ? (p.sub ?? "") : "",
    p.kg ? `${p.kg[0]}-${p.kg[1] >= 40 ? "" : p.kg[1]}` : "",
    p.fit === "pants" ? "өмсдөг" : p.fit === "tape" ? "наадаг" : "",
    p.pcs ?? "",
    p.id,
    p.images[0]?.src ?? "",
  ]);
writeFileSync(path.join(out, "namuun-products.csv"), csv(rows));

// namuun.mn delivery configs: the default for all branches, and the Алтай хотхон branch's own zone (open question)
const d = c.shop.delivery;
const a = c.shop.altai;
writeFileSync(
  path.join(out, "namuun-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "source"],
    ["NM-DELIVERY-UB", `Хүргэлт: ${d.area}`, "NM-DELIVERY", "service", d.fee, "namuun.mn delivery config «Бүх салбарт хамааралтай үндсэн тохиргоо» (no free limit)"],
    ["NM-DELIVERY-ALTAI", "Хүргэлт: Алтай хотхон салбарын бүс (Сонгинохайрхан)", "NM-DELIVERY", "service", a.fee, `namuun.mn delivery config of Алтай хотхон салбар, ${a.days} хоног; not used by the website yet (open question)`],
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery 2`);

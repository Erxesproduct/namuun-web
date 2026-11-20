/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes form + erxes QPay invoice → /api/payments/check).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases: nothing reaches erxes while erxes is not configured, and with
 * erxes configured the validation cases are rejected before anything is sent.
 * With --send it also places ONE test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу», and checks its invoice status once.
 * Creating an invoice never charges anyone: QPay only charges when someone scans the QR and pays.
 * Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const P = catalog.products;
// namuun.mn rules: delivery 3,000₮ in Улаанбаатар (no free limit), online orders from 30,000₮ (goods), QPay only.
const FEE = catalog.shop.delivery.fee;
const FREE = catalog.shop.delivery.freeOver;
const MIN = catalog.shop.minOrder;
const feeFor = (subtotal) => (FREE != null && subtotal >= FREE ? 0 : FEE);

const ok = P.filter((p) => p.stock !== 0);
const counted = ok.filter((p) => p.stock != null && p.stock >= 2);
const big = [...counted].filter((p) => p.price >= MIN).sort((a, b) => a.price - b.price)[0];
const cheap = [...counted].filter((p) => p.price < MIN / 3).sort((a, b) => a.price - b.price)[0];
const mid = counted.find((p) => p.id !== big.id && p.price >= MIN / 2 && p.price < MIN);
const soldout = P.find((p) => p.stock === 0);
const few = ok.find((p) => p.stock != null && p.stock < 10);
const unknown = P.find((p) => p.stock == null);
const item = (p, qty) => ({ id: p.id, qty });

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  area: "Баянзүрх",
  khoroo: 17,
  address: "Тест хаяг, 1-р байр, 2-р орц, 34 тоот",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  items: [item(big, 1), item(mid, 1)],
};
const SUBTOTAL = big.price + mid.price;

async function post(url, body) {
  const res = await fetch(`${base}${url}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected, fee) => (r) => valid(r) && r.json?.total === expected && (fee === undefined || r.json?.deliveryFee === fee);
const key = (n) => `test-${n}-${Date.now().toString(36)}-abcdef`;
const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown product is ignored (then empty)", { ...order, items: [{ id: "999999", qty: 1 }] }, rejects("items")],
  ["numeric id is ignored", { ...order, items: [{ id: Number(big.id), qty: 1 }] }, rejects("items")],
  ...(soldout ? [[`sold-out product is not orderable (NM-${soldout.id})`, { ...order, items: [item(soldout, 1)] }, rejects("items")]] : []),
  ...(few ? [[`more than the stock (${few.stock}) is not orderable (NM-${few.id})`, { ...order, items: [item(few, few.stock + 1)] }, rejects("items")]] : []),
  ...(cheap ? [[`under the ${MIN}₮ online minimum is refused (${cheap.price}₮)`, { ...order, items: [item(cheap, 1)] }, rejects("items")]] : []),
  [`one ${big.price}₮ item + ${FEE}₮ delivery`, { ...order, items: [item(big, 1)] }, total(big.price + feeFor(big.price), feeFor(big.price))],
  [`two items ${SUBTOTAL}₮ + delivery`, order, total(SUBTOTAL + feeFor(SUBTOTAL), feeFor(SUBTOTAL))],
  [`quantity is priced (2 × ${big.price}₮)`, { ...order, items: [item(big, 2)] }, total(big.price * 2 + feeFor(big.price * 2))],
  ...(unknown && unknown.price * 3 >= MIN ? [[`no stock record: still orderable (NM-${unknown.id})`, { ...order, items: [item(unknown, 3)] }, valid]] : []),
  ["district is required", { ...order, area: "" }, rejects("area")],
  ["an aimag is not a district", { ...order, area: "Орхон" }, rejects("area")],
  ["khoroo must be 1–45", { ...order, khoroo: 99 }, rejects("khoroo")],
  ["address is required", { ...order, address: "" }, rejects("address")],
  ["QPay is accepted", order, valid],
  ["bank transfer is not offered", { ...order, payment: "transfer" }, rejects("payment")],
  ["cash is not offered", { ...order, payment: "cash" }, rejects("payment")],
  ["company VAT receipt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company VAT receipt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 20 is ignored", { ...order, items: [item(big, 21)] }, rejects("items")],
  ["the browser's price is ignored", { ...order, items: order.items.map((i) => ({ ...i, price: 1 })) }, total(SUBTOTAL + feeFor(SUBTOTAL))],
  ["the same checkout key gives the same reference", { ...order, key: "same-key-0123456789abcdef" }, (r) => valid(r) && /^NM-\d{6}-[0-9A-F]{6}$/.test(r.json?.reference ?? "")],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true && r.json?.payment === null],
];

let failed = 0;
console.log(`Order API checks against ${base}\n`);
for (const [label, body, check] of cases) {
  const r = await post("/api/orders", { key: key(cases.findIndex((c) => c[0] === label)), ...body });
  const pass = check(r);
  if (!pass) failed++;
  if (label.startsWith("the same checkout key")) {
    const again = await post("/api/orders", { ...body });
    const same = again.json?.reference === r.json?.reference;
    if (!same) failed++;
    console.log(`${same ? "✓" : "✗"} retry with that key returns ${again.json?.reference}`);
  }
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""}${r.json?.total != null ? " total " + r.json.total : ""})`);
}

const bad = await post("/api/payments/check", { invoiceId: "../../etc" });
const badOk = bad.status === 400;
if (!badOk) failed++;
console.log(`${badOk ? "✓" : "✗"} payment check rejects a malformed invoice id (${bad.status})`);
const probe = await post("/api/payments/check", { invoiceId: "notAnInvoice123" });
const probeOk = probe.status === 503 ? probe.json?.error === "not_configured" : probe.status === 200 || probe.status === 502;
if (!probeOk) failed++;
console.log(`${probeOk ? "✓" : "✗"} payment check answers honestly (${probe.status} ${probe.json?.error ?? probe.json?.status})`);

if (send) {
  const r = await post("/api/orders", { key: key("send"), ...order });
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order recorded in erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${SUBTOTAL + feeFor(SUBTOTAL)})`);
    if (r.json.total !== SUBTOTAL + feeFor(SUBTOTAL)) {
      failed++;
      console.log("✗ unexpected total");
    }
    if (r.json.payment) {
      console.log(`✓ QPay invoice created in erxes: ${r.json.payment.invoiceId} (not paid; nobody is charged)`);
      const c = await post("/api/payments/check", { invoiceId: r.json.payment.invoiceId });
      console.log(`${c.status === 200 ? "✓" : "✗"} invoice status: ${c.json?.status ?? c.json?.error}`);
      if (c.status !== 200) failed++;
    } else console.log(`– no invoice: ${r.json.paymentError ?? "ERXES_PAYMENT_IDS not set"}`);
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

const n = cases.length + 3;
console.log(failed ? `\n${failed} check(s) failed` : `\nall ${n} checks passed`);
process.exit(failed ? 1 : 0);

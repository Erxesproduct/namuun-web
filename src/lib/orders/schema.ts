import { business, deliveryFee, type PaymentId } from "@/content/business";
import { getById, soldOut, type Product } from "@/lib/catalog";
import { DISTRICTS } from "./places";

export { DISTRICTS };

export type OrderLine = { product: Product; qty: number; unitPrice: number; lineTotal: number };
export type Order = {
  name: string;
  phone: string;
  email: string | null;
  /** Ulaanbaatar district + khoroo + address (namuun.mn delivers in Улаанбаатар хот; the countryside is arranged by phone) */
  area: string;
  khoroo: number;
  address: string;
  payment: PaymentId;
  /** VAT receipt: to a person (by phone) or to an organization (7-digit registry number). Issued by erxes, never by the website. */
  receipt: { type: "person" } | { type: "company"; regNo: string };
  note: string | null;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Honeypot: real visitors never fill it. */
  website: string;
};

export type OrderField = "name" | "phone" | "email" | "area" | "khoroo" | "address" | "payment" | "regNo" | "items";
export type OrderErrors = Partial<Record<OrderField, string>>;

export const MAX_QTY = 20;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** 8-digit Mongolian number, optionally prefixed with +976 / 976. Returns the 8 digits or null. */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/[\s\-()]/g, "").replace(/^\+?976/, "");
  return /^[5-9]\d{7}$/.test(digits) ? digits : null;
}

export function validateOrder(body: unknown): { ok: true; order: Order } | { ok: false; errors: OrderErrors } {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: OrderErrors = {};

  const name = str(b.name, 80);
  if (name.length < 2) errors.name = "Нэрээ оруулна уу.";
  const phone = normalizePhone(str(b.phone, 20));
  if (!phone) errors.phone = "8 оронтой утасны дугаар оруулна уу.";
  const email = str(b.email, 120) || null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Имэйл хаяг буруу байна.";

  const payment = business.payments.find((p) => p.id === (b.payment ?? "qpay"))?.id;
  if (!payment) errors.payment = "Төлбөрийн хэлбэрээ сонгоно уу.";

  const receiptType = b.receiptType === "company" ? "company" : "person";
  const regNo = str(b.regNo, 20).replace(/\s/g, "");
  if (receiptType === "company" && !/^\d{7}$/.test(regNo)) errors.regNo = "Байгууллагын 7 оронтой регистрийн дугаар оруулна уу.";
  const note = str(b.note, 500) || null;

  // Prices and availability always come from the catalog, never from the browser.
  const rawItems = Array.isArray(b.items) ? b.items.slice(0, 60) : [];
  const lines: OrderLine[] = [];
  let out = false;
  for (const raw of rawItems) {
    const i = (raw ?? {}) as Record<string, unknown>;
    const product = typeof i.id === "string" ? getById(i.id) : undefined;
    const qty = Number(i.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) continue;
    if (soldOut(product)) {
      out = true;
      continue;
    }
    if (product.stock != null && qty > product.stock) continue;
    if (lines.some((l) => l.product.id === product.id)) continue;
    lines.push({ product, qty, unitPrice: product.price, lineTotal: product.price * qty });
  }
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  if (!lines.length) errors.items = out ? "Сагсанд байгаа бараа дууссан байна." : "Сагс хоосон байна.";
  // namuun.mn branch setting: online orders from 30,000₮ (goods only)
  else if (subtotal < business.minOrder) errors.items = `Онлайн захиалга ${business.minOrder.toLocaleString("en-US")}₮-өөс эхэлнэ.`;

  const area = DISTRICTS.find((d) => d === b.area) ?? "";
  if (!area) errors.area = "Дүүргээ сонгоно уу.";
  const khoroo = Number(b.khoroo);
  if (!Number.isInteger(khoroo) || khoroo < 1 || khoroo > 45) errors.khoroo = "Хорооны дугаар (1–45) оруулна уу.";
  const address = str(b.address, 300);
  if (address.length < 8) errors.address = "Байр, орц, давхар, тоотоо дэлгэрэнгүй бичнэ үү.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const fee = deliveryFee(subtotal);
  return {
    ok: true,
    order: {
      name,
      phone: phone!,
      email,
      area,
      khoroo,
      address,
      payment: payment!,
      receipt: receiptType === "company" ? { type: "company", regNo } : { type: "person" },
      note,
      lines,
      subtotal,
      deliveryFee: fee,
      total: subtotal + fee,
      website: str(b.website, 100),
    },
  };
}

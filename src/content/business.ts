import data from "@/data/catalog.json";

/**
 * Business facts from namuun.mn (public API: branches, delivery configs, FAQ; read 2026-11-20), the shop's banners
 * (7 branches, addresses, phones, membership card) and the Facebook page. Nothing here is invented; open points are in
 * docs/erxes/MANUAL-STEPS.md.
 */
const shop = data.shop;
const faqAnswer = (start: string) => shop.faq.find((f) => f.q.startsWith(start))?.a ?? "";

export const business = {
  name: "Намуун",
  title: "Намуун Baby Shop",
  domain: "namuun.mn",
  /** cover banner, word for word */
  tagline: "Бүгдийг нэг дороос",
  /** branch banner, word for word */
  motto: "Хүүхдийн хэрэгцээ цөм багтсан",
  promise: "Таны хүүхдэд хамгийн сайныг",
  facebook: "https://www.facebook.com/namuunbabyshop",
  /** The website has no single hotline: help is the nearest branch. Яармаг is branch 1 on the shop's banner. */
  phone: { display: "8818-9642", tel: "+97688189642", label: "Яармаг салбар" },
  /** branch banner: «Гишүүнчлэлийн карт 5% - 15% хямдралтай» (used in the branches) */
  membership: "Гишүүнчлэлийн карт: 5%–15% хямдрал",

  /** namuun.mn FAQ: «QPay ашиглан төлбөр төлөх боломжтой» */
  payments: [{ id: "qpay", name: "QPay", note: "Аль ч банкны аппаар QR уншуулж төлнө." }],

  /** namuun.mn delivery config «Бүх салбарт хамааралтай үндсэн тохиргоо»: 3,000₮, Улаанбаатар хот, no free limit. */
  delivery: { area: shop.delivery.area, fee: shop.delivery.fee, freeOver: shop.delivery.freeOver as number | null },
  /** namuun.mn branch setting `onlineOrderMinAmount` (the same for every branch) */
  minOrder: shop.minOrder,

  rules: {
    /** FAQ, word for word */
    order: faqAnswer("Хэрхэн захиалга"),
    payment: faqAnswer("Ямар төлбөр"),
    paymentFailed: faqAnswer("Төлбөр амжилтгүй"),
    vat: faqAnswer("НӨАТ"),
    deliveryTime: faqAnswer("Хүргэлтийн хугацаа"),
    deliveryUb: "Улаанбаатар хотод 24–48 цагт хүргэнэ.",
    countryside: "Орон нутагт хүргүүлэх бол Мөрөн, Арвайхээр, Эрдэнэт салбар эсвэл Яармаг салбартай утсаар тохирно уу (2–5 хоног).",
    ebarimt: "НӨАТ-ын баримт (и-баримт) төлбөр баталгаажсаны дараа үүснэ. Байгууллагаар авах бол 7 оронтой регистрийн дугаараа бичнэ үү.",
    stock: "Үлдэгдэл 2026.11.20-ны байдлаар. Захиалга баталгаажихад салбар үлдэгдлийг дахин шалгана.",
  },
  faq: shop.faq,
} as const;

export type PaymentId = (typeof business.payments)[number]["id"];
export const paymentOption = (id: PaymentId) => business.payments.find((p) => p.id === id)!;

/** namuun.mn calculateDeliveryFee: the fee, or 0 when a free limit is set and reached (none is set today). */
export function deliveryFee(subtotal: number): number {
  const free = business.delivery.freeOver;
  return free != null && subtotal >= free ? 0 : business.delivery.fee;
}

/** Order statuses staff move an order through (erxes Sales pipeline stages, see MANUAL-STEPS.md). */
export const ORDER_STATUSES = [
  { id: "pending", name: "Төлбөр хүлээгдэж байна", note: "QPay-ээр төлнө" },
  { id: "paid", name: "Төлбөр төлөгдсөн", note: "НӨАТ-ын баримт үүснэ" },
  { id: "packing", name: "Бэлтгэж байна", note: "Салбар барааг савлана" },
  { id: "shipped", name: "Хүргэлтэд гарсан", note: "24–48 цагийн дотор" },
  { id: "delivered", name: "Хүргэгдсэн", note: "Баярлалаа!" },
  { id: "cancelled", name: "Цуцлагдсан", note: "Төлбөр хийгдээгүй эсвэл бараа дууссан" },
] as const;

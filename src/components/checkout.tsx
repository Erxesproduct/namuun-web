"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { business, deliveryFee } from "@/content/business";
import { cart, cartSubtotal, maxQty, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLite } from "@/lib/lite";
import { localOrders } from "@/lib/local-orders";
import { DISTRICTS } from "@/lib/orders/places";
import type { OrderErrors } from "@/lib/orders/schema";
import { Mobile, Star } from "./brand";
import { MinusIcon, PhoneIcon, PlusIcon, QrIcon, TrashIcon, TruckIcon } from "./icons";

const KEY = "nm.checkout-key";
/** One idempotency key per checkout attempt, kept until the order goes through. */
function checkoutKey() {
  try {
    const k = sessionStorage.getItem(KEY);
    if (k) return k;
    const n = crypto.randomUUID();
    sessionStorage.setItem(KEY, n);
    return n;
  } catch {
    return crypto.randomUUID();
  }
}

export function Checkout() {
  const items = useCart();
  const router = useRouter();
  const [receiptType, setReceiptType] = useState<"person" | "company">("person");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const lines = items.flatMap((i) => {
    const v = getLite(i.id);
    return v ? [{ ...i, v }] : [];
  });
  const subtotal = cartSubtotal(items);
  const fee = deliveryFee(subtotal);
  const total = subtotal + fee;
  const short = business.minOrder - subtotal;

  if (!lines.length)
    return (
      <div className="night-sky mx-auto max-w-xl overflow-hidden rounded-[36px] px-6 pb-10 text-center">
        <Mobile className="mx-auto w-60" />
        <p className="text-[26px] font-black">Сагс хоосон байна</p>
        <p className="mt-2 text-white/80">Живх, угж, хуурай сүү: хэрэгтэй бүхнээ нэг дороос.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/shop?g=diapers" className="btn btn-sun">
            Живх
          </Link>
          <Link href="/shop" className="btn bg-white/10 text-white ring-2 ring-white/25">
            Бүх бараа
          </Link>
        </div>
      </div>
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setNotice(null);
    setErrors({});
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: checkoutKey(),
          name: f.get("name"),
          phone: f.get("phone"),
          email: f.get("email"),
          area: f.get("area"),
          khoroo: Number(f.get("khoroo")),
          address: f.get("address") ?? "",
          payment: "qpay",
          receiptType,
          regNo: f.get("regNo") ?? "",
          note: f.get("note"),
          website: f.get("website"),
          items: items.map(({ id, qty }) => ({ id, qty })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.save({
          reference: json.reference,
          createdAt: new Date().toISOString(),
          subtotal: json.subtotal,
          deliveryFee: json.deliveryFee,
          total: json.total,
          lines: lines.map((l) => ({ name: l.v.n, qty: l.qty, total: l.v.p * l.qty })),
          method: "qpay",
          invoiceId: json.payment?.invoiceId ?? null,
          payUrl: json.payment?.url ?? null,
          status: json.payment ? "pending" : null,
        });
        try {
          sessionStorage.removeItem(KEY);
        } catch {}
        cart.clear();
        router.push(`/order/${json.reference}`);
        return;
      }
      if (res.status === 422 && json?.errors) {
        setErrors(json.errors);
        setNotice("Улаанаар тэмдэглэсэн хэсгийг шалгаад дахин дарна уу.");
      } else if (json?.error === "not_configured") {
        setNotice(`Онлайн захиалга одоогоор холбогдоогүй байна. Захиалгаа ${business.phone.display} (${business.phone.label}) дугаарт өгнө үү: код ${json.reference}, нийт ${formatPrice(json.total ?? total)}. Таны сагс хадгалагдсан.`);
      } else {
        setNotice(`Захиалга илгээхэд алдаа гарлаа. Дахин оролдох эсвэл ${business.phone.display} дугаарт залгана уу.`);
      }
    } catch {
      setNotice("Интернэт холболтоо шалгаад дахин оролдоно уу.");
    } finally {
      setBusy(false);
    }
  }

  const err = (k: keyof OrderErrors) =>
    errors[k] && (
      <p className="pop-in mt-1.5 text-[14px] font-bold text-pink-d" id={`e-${k}`}>
        {errors[k]}
      </p>
    );
  const step = (n: number, t: string) => (
    <h2 className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-night text-[16px] font-black text-white">{n}</span>
      <span className="text-[22px]">{t}</span>
    </h2>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
      <div className="space-y-6">
        <section aria-label="Сагсны бараа" className="panel p-4 md:p-6">
          <ul className="divide-y divide-line">
            {lines.map(({ id, qty, v }) => (
              <li key={id} className="flex gap-4 py-4 first:pt-1 last:pb-1">
                <Link href={`/p/${v.s}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-line">
                  {v.t ? <Image src={v.t} alt="" fill sizes="96px" className="object-contain p-2" /> : <Star size={28} className="m-auto mt-8" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  {v.b && <span className="text-[12px] font-extrabold text-sky-d uppercase">{v.b}</span>}
                  <Link href={`/p/${v.s}`} className="line-clamp-2 leading-snug font-bold hover:text-sky-d">
                    {v.n}
                  </Link>
                  <span className="text-[14px] text-ink-3">{formatPrice(v.p)} / ш</span>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center rounded-full bg-morning">
                      <button type="button" onClick={() => cart.setQty(id, qty - 1)} className="grid h-10 w-10 place-items-center" aria-label="Цөөлөх">
                        <MinusIcon size={15} />
                      </button>
                      <span className="w-7 text-center font-black tabular-nums">{qty}</span>
                      <button type="button" onClick={() => cart.setQty(id, qty + 1)} disabled={qty >= maxQty(id)} className="grid h-10 w-10 place-items-center disabled:opacity-30" aria-label="Нэмэх">
                        <PlusIcon size={15} />
                      </button>
                    </div>
                    <span className="display text-[18px] tabular-nums">{formatPrice(v.p * qty)}</span>
                    <button type="button" onClick={() => cart.setQty(id, 0)} className="grid h-10 w-10 place-items-center rounded-full text-ink-3 hover:bg-pink-l hover:text-pink-d" aria-label={`${v.n}: хасах`}>
                      <TrashIcon size={17} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {short > 0 && (
            <p className="mt-4 rounded-[20px] bg-sun-l p-4 text-[14.5px]">
              Онлайн захиалга <b>{formatPrice(business.minOrder)}</b>-өөс эхэлнэ. Дахиад <b>{formatPrice(short)}</b>-ийн бараа нэмээрэй.{" "}
              <Link href="/shop" className="font-extrabold text-sky-d underline underline-offset-4">
                Бараа нэмэх
              </Link>
            </p>
          )}
        </section>

        <section className="panel p-5 md:p-7">
          {step(1, "Таны мэдээлэл")}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="label">
              Нэр
              <input name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} className="field" />
              {err("name")}
            </label>
            <label className="label">
              Утас
              <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="99112233" required aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} className="field" />
              {err("phone")}
            </label>
            <label className="label sm:col-span-2">
              Имэйл <span className="font-semibold text-ink-3">(заавал биш)</span>
              <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className="field" />
              {err("email")}
            </label>
          </div>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        </section>

        <section className="panel p-5 md:p-7">
          {step(2, "Хаана хүргэх вэ?")}
          <div className="mt-5 flex gap-3 rounded-[20px] bg-sky-l p-4">
            <TruckIcon size={20} className="mt-0.5 shrink-0 text-sky-d" />
            <span className="text-[14px] text-ink-2">
              <b className="block text-[15.5px] font-extrabold text-ink">
                {business.delivery.area}: {formatPrice(business.delivery.fee)}, 24–48 цагт
              </b>
              {business.rules.countryside}
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1.4fr_1fr]">
            <label className="label">
              Дүүрэг
              <select name="area" required defaultValue="" aria-invalid={!!errors.area} className="field">
                <option value="" disabled>
                  Сонгох
                </option>
                {DISTRICTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {err("area")}
            </label>
            <label className="label">
              Хороо
              <input name="khoroo" type="number" inputMode="numeric" min={1} max={45} required aria-invalid={!!errors.khoroo} className="field" />
              {err("khoroo")}
            </label>
            <label className="label sm:col-span-2">
              Хаяг
              <textarea name="address" rows={2} required aria-invalid={!!errors.address} placeholder="Байр, орц, давхар, тоот, орцны код" className="field" />
              {err("address")}
            </label>
          </div>
        </section>

        <section className="panel p-5 md:p-7">
          {step(3, "Төлбөр, НӨАТ-ын баримт")}
          <div className="night-sky mt-5 flex items-center gap-3 rounded-[20px] p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sun text-night">
              <QrIcon size={22} />
            </span>
            <span>
              <b className="block text-[16px]">QPay</b>
              <span className="text-[13.5px] text-white/80">{business.payments[0].note} Захиалсны дараа төлбөрийн хуудас нээгдэнэ.</span>
            </span>
          </div>
          <p className="mt-5 text-[15px] font-extrabold">НӨАТ-ын баримт хэнд авах вэ?</p>
          <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Баримтын төрөл">
            {(
              [
                ["person", "Хувь хүн"],
                ["company", "Байгууллага"],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="radio" aria-checked={receiptType === id} onClick={() => setReceiptType(id)} className="chip">
                {text}
              </button>
            ))}
          </div>
          {receiptType === "company" ? (
            <label className="label mt-4">
              Байгууллагын регистр
              <input name="regNo" inputMode="numeric" maxLength={7} placeholder="1234567" aria-invalid={!!errors.regNo} className="field" />
              {err("regNo")}
            </label>
          ) : (
            <p className="mt-3 text-[14px] text-ink-2">Баримтыг таны утасны дугаараар бүртгэнэ.</p>
          )}
          <label className="label mt-5">
            Нэмэлт тайлбар <span className="font-semibold text-ink-3">(хүргэлтийн цаг, орцны код гэх мэт)</span>
            <textarea name="note" rows={2} className="field" />
          </label>
        </section>
      </div>

      <aside className="lg:sticky lg:top-[140px] lg:self-start">
        <div className="overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_18px_40px_-28px_rgb(14_43_82/0.45)] ring-2 ring-sky-l md:p-8">
          <p className="kicker">Төлөх дүн</p>
          <dl className="mt-5 space-y-3 text-[16px]">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-2">Бараа ({lines.reduce((n, l) => n + l.qty, 0)} ш)</dt>
              <dd className="font-bold tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-2">Хүргэлт</dt>
              <dd className="font-bold tabular-nums">{fee ? formatPrice(fee) : "Үнэгүй"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t-2 border-dashed border-line pt-4">
              <dt className="font-extrabold">Нийт</dt>
              <dd className="display text-[34px] tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <ul className="mt-4 space-y-1.5 text-[13.5px] leading-snug text-ink-2">
            <li>• {business.rules.order}</li>
            <li>• {business.rules.vat}</li>
          </ul>
          {notice && (
            <p role="alert" className="pop-in mt-5 rounded-2xl bg-sun-l px-4 py-3 text-[14.5px]">
              {notice}
            </p>
          )}
          {errors.items && <p className="mt-4 rounded-2xl bg-pink-d px-4 py-2.5 text-[14.5px] font-bold text-white">{errors.items}</p>}
          <button type="submit" disabled={busy || short > 0} className="btn btn-sun mt-6 h-14 w-full text-[16px]">
            {busy ? "Илгээж байна…" : short > 0 ? `${formatPrice(business.minOrder)}-өөс захиална` : "Захиалах, QPay-ээр төлөх"}
          </button>
          <a href={`tel:${business.phone.tel}`} className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-bold text-ink-2 hover:text-ink">
            <PhoneIcon size={16} /> Тусламж: {business.phone.display}
          </a>
        </div>
      </aside>
    </form>
  );
}

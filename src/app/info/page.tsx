import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "@/components/brand";
import { FacebookIcon, PhoneIcon, PinIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { business, ORDER_STATUSES } from "@/content/business";
import { branches } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Хүргэлт, төлбөр, салбарууд",
  description: `${business.title}: Улаанбаатарт ${formatPrice(business.delivery.fee)}-өөр 24–48 цагт хүргэнэ, QPay, НӨАТ-ын баримт, ${branches.length} салбарын хаяг, утас.`,
  alternates: { canonical: "/info" },
};

export default function InfoPage() {
  return (
    <div className="wrap pt-8 pb-10 md:pt-12">
      <p className="kicker">Тусламж</p>
      <h1 className="mt-1 text-[34px] md:text-[46px]">Хүргэлт, төлбөр, салбарууд</h1>
      <nav aria-label="Хэсэг" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {[
          ["#delivery", "Хүргэлт"],
          ["#payment", "Төлбөр, НӨАТ"],
          ["#status", "Захиалгын явц"],
          ["#branches", "Салбарууд"],
          ["#faq", "Асуулт"],
        ].map(([h, t]) => (
          <a key={h} href={h} className="chip shrink-0">
            {t}
          </a>
        ))}
      </nav>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section id="delivery" className="panel scroll-mt-40 p-6 md:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-l text-sky-d">
            <TruckIcon size={24} />
          </span>
          <h2 className="mt-4 text-[26px]">Хүргэлт</h2>
          <dl className="mt-4 space-y-3 text-[15.5px]">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-ink-2">{business.delivery.area}</dt>
              <dd className="font-extrabold">{formatPrice(business.delivery.fee)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-ink-2">Хугацаа</dt>
              <dd className="text-right font-extrabold">24–48 цаг</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <dt className="text-ink-2">Онлайн захиалгын доод дүн</dt>
              <dd className="font-extrabold">{formatPrice(business.minOrder)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[15px] text-ink-2">«{business.rules.deliveryTime}»</p>
          <p className="mt-3 rounded-[18px] bg-sun-l p-4 text-[14.5px]">{business.rules.countryside}</p>
        </section>

        <section id="payment" className="panel scroll-mt-40 p-6 md:p-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sun-l text-night">
            <QrIcon size={24} />
          </span>
          <h2 className="mt-4 text-[26px]">Төлбөр, НӨАТ-ын баримт</h2>
          <ul className="mt-4 space-y-3 text-[15.5px]">
            <li className="flex gap-3">
              <Star size={18} className="mt-1 shrink-0" />
              <span>{business.rules.payment}. {business.payments[0].note}</span>
            </li>
            <li className="flex gap-3">
              <Star size={18} className="mt-1 shrink-0" />
              <span>{business.rules.order}</span>
            </li>
            <li className="flex gap-3">
              <ShieldIcon size={18} className="mt-1 shrink-0 text-sky-d" />
              <span>{business.rules.ebarimt}</span>
            </li>
            <li className="flex gap-3">
              <Star size={18} className="mt-1 shrink-0" color="var(--color-pink)" />
              <span className="text-ink-2">{business.rules.paymentFailed}</span>
            </li>
          </ul>
        </section>
      </div>

      <section id="status" className="panel mt-5 scroll-mt-40 p-6 md:p-8">
        <h2 className="text-[26px]">Захиалгын явц</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ORDER_STATUSES.filter((s) => s.id !== "cancelled").map((s, i) => (
            <li key={s.id} className="rounded-[20px] bg-morning p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-night text-[14px] font-black text-white">{i + 1}</span>
              <p className="mt-3 font-extrabold">{s.name}</p>
              <p className="text-[13.5px] text-ink-3">{s.note}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[14px] text-ink-2">Захиалга бүртгэгдсэний дараа «/order/…» хуудаснаас төлбөрийн төлөвөө харна.</p>
      </section>

      <section id="branches" className="mt-12 scroll-mt-40">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="kicker">{business.membership}</p>
            <h2 className="mt-1 text-[28px] md:text-[36px]">{branches.length} салбар</h2>
          </div>
          <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-line">
            <FacebookIcon size={18} /> namuunbabyshop
          </a>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {branches.map((b) => (
            <li key={b.n} className="flex flex-col rounded-[24px] bg-rose-l p-5">
              <span className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[14px] font-black text-rose">{b.n}</span>
                <span className="text-[18px] font-black">{b.place}</span>
              </span>
              <p className="mt-3 flex gap-2 text-[14.5px] text-ink-2">
                <PinIcon size={17} className="mt-0.5 shrink-0" /> {b.address}
              </p>
              <a href={`tel:${b.tel}`} className="btn btn-night mt-auto min-h-11 self-start px-4 text-[14.5px] tabular-nums">
                <PhoneIcon size={16} /> {b.phone}
              </a>
            </li>
          ))}
        </ul>
        <div className="relative mt-5 aspect-[1920/731] overflow-hidden rounded-[28px]">
          <Image src="/brand/branches.webp" alt="Намуун салбаруудын хаяг, утас; гишүүнчлэлийн карт 5%–15% хямдралтай" fill sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section id="faq" className="mt-12 scroll-mt-40">
        <h2 className="text-[28px] md:text-[36px]">Түгээмэл асуулт</h2>
        <div className="mt-5 space-y-3">
          {business.faq.map((f) => (
            <details key={f.q} className="panel group p-5 open:ring-2 open:ring-sky-l">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-extrabold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-l text-sky-d transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15.5px] text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-ink-2">
          Өөр асуулт байвал{" "}
          <a href={`tel:${business.phone.tel}`} className="font-extrabold text-night">
            {business.phone.display}
          </a>{" "}
          эсвэл{" "}
          <Link href={business.facebook} className="font-extrabold text-sky-d">
            Facebook
          </Link>
          -ээр холбогдоорой.
        </p>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Cloud, ShelfArt } from "@/components/brand";
import { Shelf } from "@/components/shelf";
import { DIAPER_SIZES, inGroup, SIZE_NAMES, soldOut } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Живхний размер",
  description: "Хүүхдийнхээ жингээр живхний размераа сонго: NB, S, M, L, XL, XXL, XXXL. Наадаг, өмсдөг; Huggies, Momotaro, Pigeon, Rascals, Baby Lab.",
  alternates: { canonical: "/diapers" },
};

export default function DiapersPage() {
  const diapers = inGroup("diapers");
  return (
    <div className="pb-10">
      <section className="wrap pt-6 md:pt-10">
        <div className="night-sky cloud-edge relative overflow-hidden rounded-[32px] px-6 pt-8 pb-14 md:px-12 md:pt-12 md:pb-20">
          <Cloud className="drift absolute top-6 right-6 w-28 opacity-90" />
          <ShelfArt icon="diaper" className="h-16 w-16" />
          <h1 className="mt-4 text-[34px] md:text-[48px]">Живхний размер</h1>
          <p className="mt-2 max-w-xl text-white/85">
            Хүүхдийнхээ жинг олоод размераа дарна уу. Кг нь савлагаан дээр бичсэнээр (олон брэндийн дунджаар); брэнд бүр бага зэрэг ялгаатай тул барааны нэрэн дэх кг-г шалгаарай.
          </p>
        </div>
      </section>
      <section className="wrap mt-8">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DIAPER_SIZES.map((s) => {
            const items = diapers.filter((p) => p.sub === s.size);
            const ready = items.filter((p) => !soldOut(p));
            const cheapest = ready.filter((p) => p.pcs).sort((a, b) => a.price / a.pcs! - b.price / b.pcs!)[0];
            const tape = items.filter((p) => p.fit === "tape").length;
            const pants = items.filter((p) => p.fit === "pants").length;
            return (
              <li key={s.size}>
                <Link href={`/shop?g=diapers&s=${s.size}`} className="panel card-lift flex h-full flex-col p-5">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="bubble text-[44px] leading-none">{s.size}</span>
                    <span className="rounded-full bg-sky-l px-3 py-1 text-[14px] font-black">{s.from != null ? (s.to != null ? `${s.from}–${s.to} кг` : `${s.from}+ кг`) : "—"}</span>
                  </span>
                  <span className="mt-2 text-[15px] font-extrabold">{SIZE_NAMES[s.size]}</span>
                  <span className="mt-1 text-[14px] text-ink-2">
                    {items.length} бараа, бэлэн {ready.length}
                    {tape || pants ? ` · наадаг ${tape}, өмсдөг ${pants}` : ""}
                  </span>
                  {cheapest && <span className="mt-1 text-[13.5px] text-ink-3">1 ширхэг {formatPrice(Math.round(cheapest.price / cheapest.pcs!))}-өөс</span>}
                  <span className="mt-auto pt-4 text-[14.5px] font-extrabold text-sky-d">Харах →</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[13.5px] text-ink-3">«—»: тухайн размерын барааны нэрэнд кг бичигдээгүй.</p>
      </section>
      <Shelf kicker="Наадаг" title="Наадаг живх" href="/shop?g=diapers&fit=tape" items={diapers.filter((p) => p.fit === "tape" && !soldOut(p)).slice(0, 12)} />
      <Shelf kicker="Өмсдөг" title="Өмсдөг живх" href="/shop?g=diapers&fit=pants" items={diapers.filter((p) => p.fit === "pants" && !soldOut(p)).slice(0, 12)} />
    </div>
  );
}

import Link from "next/link";
import { business } from "@/content/business";
import { branches, groups } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Cloud, LogoRound, Star } from "./brand";
import { FacebookIcon, PhoneIcon, QrIcon, TruckIcon } from "./icons";

export function Footer() {
  return (
    <footer className="night-sky relative mt-16 overflow-hidden pb-28 md:pb-10">
      <div className="absolute inset-x-0 top-0 h-10 bg-morning" aria-hidden>
        <Cloud className="drift absolute -bottom-6 left-[4%] w-40" color="var(--color-morning)" />
        <Cloud className="absolute -bottom-7 left-[32%] w-52" color="var(--color-morning)" />
        <Cloud className="drift absolute -bottom-6 left-[62%] w-44" color="var(--color-morning)" />
        <Cloud className="absolute -bottom-5 right-[-2%] w-36" color="var(--color-morning)" />
      </div>
      <div className="wrap relative grid gap-10 pt-24 md:grid-cols-[1.1fr_1fr_1.4fr] md:pt-28">
        <div>
          <LogoRound className="h-28 w-auto rounded-[28px] bg-white p-3" />
          <p className="mt-5 text-[22px] font-black">{business.tagline}</p>
          <p className="mt-1 text-white/75">{business.motto}. {business.promise}.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="btn min-h-11 bg-white/10 px-4 text-[14px] hover:bg-white/20">
              <FacebookIcon size={18} /> namuunbabyshop
            </a>
            <a href={`tel:${business.phone.tel}`} className="btn min-h-11 bg-white/10 px-4 text-[14px] hover:bg-white/20">
              <PhoneIcon size={17} /> {business.phone.display}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 text-[15px]">
          <div>
            <p className="text-[13px] font-black tracking-wider text-sky uppercase">Дэлгүүр</p>
            <ul className="mt-3 space-y-2">
              {groups.map((g) => (
                <li key={g.id}>
                  <Link href={`/shop?g=${g.id}`} className="text-white/80 hover:text-sun">
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[13px] font-black tracking-wider text-sky uppercase">Тусламж</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/diapers" className="text-white/80 hover:text-sun">
                  Живхний размер
                </Link>
              </li>
              <li>
                <Link href="/info#delivery" className="text-white/80 hover:text-sun">
                  Хүргэлт
                </Link>
              </li>
              <li>
                <Link href="/info#payment" className="text-white/80 hover:text-sun">
                  Төлбөр, НӨАТ
                </Link>
              </li>
              <li>
                <Link href="/info#faq" className="text-white/80 hover:text-sun">
                  Түгээмэл асуулт
                </Link>
              </li>
              <li>
                <Link href="/hearts" className="text-white/80 hover:text-sun">
                  Хадгалсан бараа
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div id="footer-branches">
          <p className="flex items-center gap-2 text-[13px] font-black tracking-wider text-sky uppercase">
            <Star size={15} /> {branches.length} салбар
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {branches.map((b) => (
              <li key={b.n}>
                <a href={`tel:${b.tel}`} className="flex items-center justify-between gap-3 rounded-2xl bg-white/[0.07] px-3.5 py-2.5 hover:bg-white/15">
                  <span className="min-w-0">
                    <span className="block truncate text-[14.5px] font-extrabold">{b.place}</span>
                    <span className="block text-[13px] text-white/70 tabular-nums">{b.phone}</span>
                  </span>
                  <PhoneIcon size={16} className="shrink-0 text-sun" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap relative mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13.5px] text-white/65 md:flex-row md:items-center md:justify-between">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <TruckIcon size={15} /> {business.delivery.area}: {formatPrice(business.delivery.fee)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <QrIcon size={15} /> QPay · НӨАТ-ын баримт
          </span>
        </p>
        <p>© 2026 {business.title}</p>
      </div>
    </footer>
  );
}

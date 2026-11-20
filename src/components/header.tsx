import Link from "next/link";
import { business } from "@/content/business";
import { groups } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Logo, Mark, Star } from "./brand";
import { CartButton, HeartsButton, MobileMenu } from "./header-tools";
import { PhoneIcon, TruckIcon } from "./icons";
import { Scroller } from "./scroller";
import { Search } from "./search";

export function Header() {
  const nav = groups.map((g) => ({ href: `/shop?g=${g.id}`, label: g.name, short: g.short }));
  return (
    <>
      <div className="night-sky text-[13px] font-semibold">
        <div className="wrap flex h-9 items-center justify-between gap-4">
          <p className="flex min-w-0 items-center gap-2 truncate">
            <TruckIcon size={16} className="shrink-0 text-sun" />
            <span className="truncate">
              Улаанбаатарт 24–48 цагт, {formatPrice(business.delivery.fee)} · Онлайн захиалга {formatPrice(business.minOrder)}-өөс
            </span>
          </p>
          <a href={`tel:${business.phone.tel}`} className="hidden shrink-0 items-center gap-1.5 hover:text-sun sm:flex">
            <PhoneIcon size={15} /> {business.phone.display}
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur">
        <div className="wrap flex h-[68px] items-center gap-3 md:h-[78px] md:gap-6">
          <MobileMenu items={nav} />
          <Link href="/" className="shrink-0" aria-label="Намуун Baby Shop: нүүр">
            <Mark className="h-11 w-auto md:hidden" priority />
            <Logo className="hidden h-12 w-auto md:block lg:h-[52px]" priority />
          </Link>
          <Search className="hidden flex-1 md:block lg:mx-4" />
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link href="/info#branches" className="hidden h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-ink-2 hover:bg-morning xl:flex">
              <Star size={16} /> 7 салбар
            </Link>
            <HeartsButton />
            <CartButton />
          </div>
        </div>
        <div className="wrap pb-3 md:hidden">
          <Search />
        </div>
        <div className="hidden border-t border-line md:block">
          <Scroller as="nav" label="Ангилал" small className="wrap no-scrollbar flex h-12 items-center gap-1 overflow-x-auto">
            <Link href="/shop" className="shrink-0 rounded-full px-3.5 py-1.5 text-[14.5px] font-extrabold hover:bg-sky-l">
              Бүх бараа
            </Link>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="shrink-0 rounded-full px-3.5 py-1.5 text-[14.5px] font-bold text-ink-2 hover:bg-sky-l hover:text-ink">
                {n.label}
              </Link>
            ))}
            <Link href="/diapers" className="ml-auto shrink-0 rounded-full bg-sun-l px-3.5 py-1.5 text-[14px] font-extrabold hover:bg-sun">
              Живхний размер
            </Link>
          </Scroller>
        </div>
      </header>
    </>
  );
}

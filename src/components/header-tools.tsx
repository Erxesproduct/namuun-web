"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { cartCount, useCart } from "@/lib/cart";
import { getLite } from "@/lib/lite";
import { useHearts } from "@/lib/wishlist";
import { Mark, Star } from "./brand";
import { BagIcon, CloseIcon, GridIcon, HeartIcon, HomeIcon, MenuIcon, PhoneIcon } from "./icons";

const Badge = ({ n }: { n: number }) =>
  n > 0 ? <span className="pop-in absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-sun px-1 text-[11.5px] font-black text-night tabular-nums">{n}</span> : null;

export function CartButton() {
  const n = cartCount(useCart());
  return (
    <Link href="/cart" className="relative grid h-11 w-11 place-items-center rounded-full bg-sky-l text-night hover:bg-sky" aria-label={`Сагс: ${n} бараа`}>
      <BagIcon size={22} />
      <Badge n={n} />
    </Link>
  );
}

export function HeartsButton() {
  const n = useHearts().length;
  return (
    <Link href="/hearts" className="relative hidden h-11 w-11 place-items-center rounded-full hover:bg-pink-l sm:grid" aria-label={`Хадгалсан: ${n}`}>
      <HeartIcon size={21} />
      <Badge n={n} />
    </Link>
  );
}

export function MobileMenu({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const [seen, setSeen] = useState(path);
  if (seen !== path) {
    setSeen(path);
    setOpen(false);
  }
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="-ml-2 grid h-11 w-11 place-items-center rounded-full hover:bg-morning md:hidden" aria-label="Цэс нээх" aria-expanded={open}>
        <MenuIcon size={23} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal aria-label="Цэс">
          <button type="button" className="absolute inset-0 bg-night/45" onClick={() => setOpen(false)} aria-label="Хаах" />
          <div className="rise absolute inset-y-0 left-0 flex w-[min(86vw,360px)] flex-col overflow-y-auto rounded-r-[32px] bg-white">
            <div className="night-sky flex items-center justify-between p-5">
              <Mark className="h-12 w-auto rounded-xl bg-white p-1" />
              <button type="button" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-white/15" aria-label="Цэс хаах">
                <CloseIcon size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 p-4" aria-label="Цэс">
              <Link href="/shop" className="rounded-2xl px-4 py-3 text-[18px] font-black hover:bg-morning">
                Бүх бараа
              </Link>
              {items.map((n) => (
                <Link key={n.href} href={n.href} className="rounded-2xl px-4 py-3 text-[17px] font-bold hover:bg-morning">
                  {n.label}
                </Link>
              ))}
              <Link href="/diapers" className="mt-2 flex items-center gap-2 rounded-2xl bg-sun-l px-4 py-3 text-[16px] font-extrabold">
                <Star size={18} /> Живхний размер сонгох
              </Link>
              <Link href="/info" className="rounded-2xl px-4 py-3 text-[15px] font-semibold text-ink-2 hover:bg-morning">
                Хүргэлт, төлбөр, салбарууд
              </Link>
            </nav>
            <a href={`tel:${business.phone.tel}`} className="btn btn-line mx-4 mt-auto mb-6">
              <PhoneIcon size={17} /> {business.phone.label}: {business.phone.display}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/** Thumb-reach bar for phones: parents often shop one-handed with the baby on the other arm. */
export function BottomBar() {
  const path = usePathname();
  const n = cartCount(useCart());
  const h = useHearts().length;
  const items = [
    { href: "/", label: "Нүүр", Icon: HomeIcon, on: path === "/" },
    { href: "/shop", label: "Бараа", Icon: GridIcon, on: path.startsWith("/shop") },
    { href: "/hearts", label: "Хадгалсан", Icon: HeartIcon, on: path === "/hearts", n: h },
    { href: "/cart", label: "Сагс", Icon: BagIcon, on: path === "/cart", n },
  ];
  if (path.startsWith("/p/")) return null; // the product page has its own sticky add-to-cart bar
  return (
    <nav aria-label="Доод цэс" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-[26px] bg-white/95 p-1.5 shadow-[0_14px_40px_-12px_rgb(14_43_82/0.4)] ring-1 ring-line backdrop-blur md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
      {items.map(({ href, label, Icon, on, n: c }) => (
        <Link key={href} href={href} aria-current={on ? "page" : undefined} className={`relative flex flex-col items-center gap-0.5 rounded-[20px] py-2 text-[11.5px] font-extrabold transition ${on ? "bg-night text-white" : "text-ink-2"}`}>
          <span className="relative">
            <Icon size={21} />
            {!!c && <span className="absolute -top-1.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-sun px-1 text-[10.5px] font-black text-night">{c}</span>}
          </span>
          {label}
        </Link>
      ))}
    </nav>
  );
}

/** «Added to cart» note, from the `nm:added` event the cart sends. */
export function AddedToast() {
  const [item, setItem] = useState<{ id: string; key: number } | null>(null);
  useEffect(() => {
    let t = 0;
    const on = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      setItem({ id, key: Date.now() });
      window.clearTimeout(t);
      t = window.setTimeout(() => setItem(null), 3000);
    };
    window.addEventListener("nm:added", on);
    return () => {
      window.removeEventListener("nm:added", on);
      window.clearTimeout(t);
    };
  }, []);
  const v = item ? getLite(item.id) : null;
  if (!item || !v) return null;
  return (
    <div key={item.key} role="status" className="pop-in fixed inset-x-3 bottom-24 z-50 mx-auto flex max-w-md items-center gap-3 rounded-[22px] bg-night p-3 pr-4 text-white shadow-2xl md:bottom-8">
      <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">{v.t ? <Image src={v.t} alt="" fill sizes="56px" className="object-contain p-1" /> : <Star size={26} />}</span>
      <span className="min-w-0 flex-1 text-[14px] leading-snug">
        <b className="block">Сагсанд нэмлээ</b>
        <span className="block truncate text-white/75">{v.n}</span>
      </span>
      <Link href="/cart" className="btn btn-sun min-h-10 shrink-0 px-4 text-[14px]">
        Сагс
      </Link>
    </div>
  );
}

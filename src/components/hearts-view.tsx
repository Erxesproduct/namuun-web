"use client";

import Image from "next/image";
import Link from "next/link";
import { cart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { isSoldOut, liteProducts } from "@/lib/lite";
import { hearts, useHearts } from "@/lib/wishlist";
import { Star } from "./brand";
import { BagIcon, HeartIcon } from "./icons";

export function HeartsView() {
  const slugs = useHearts();
  const list = slugs.flatMap((s) => liteProducts.filter((p) => p.s === s));
  if (!list.length)
    return (
      <div className="panel mx-auto mt-10 max-w-lg p-10 text-center">
        <Star size={52} className="bob mx-auto" />
        <p className="mt-5 text-[24px] font-black">Одоохондоо хоосон байна</p>
        <p className="mt-2 text-ink-2">Таалагдсан бараан дээрх зүрхийг дараад энд хадгалаарай.</p>
        <Link href="/shop" className="btn btn-night mt-6">
          Бараа үзэх
        </Link>
      </div>
    );
  const ready = list.filter((p) => !isSoldOut(p));
  return (
    <>
      {ready.length > 1 && (
        <button type="button" onClick={() => ready.forEach((p) => cart.add(p.i))} className="btn btn-sun mt-6">
          <BagIcon size={18} /> Бүгдийг сагслах ({ready.length})
        </button>
      )}
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
        {list.map((p) => (
          <li key={p.s} className="panel relative flex flex-col overflow-hidden">
            <Link href={`/p/${p.s}`} className="relative block aspect-square bg-white">
              {p.t && <Image src={p.t} alt={p.n} fill sizes="(min-width: 1024px) 240px, 50vw" className={`object-contain p-4 ${isSoldOut(p) ? "opacity-45 grayscale" : ""}`} />}
            </Link>
            <button type="button" onClick={() => hearts.toggle(p.s)} aria-label={`${p.n}: хадгалснаас хасах`} className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white text-pink-d shadow-sm ring-1 ring-line">
              <HeartIcon size={19} filled />
            </button>
            <div className="flex flex-1 flex-col gap-1 border-t border-line/70 p-3.5">
              <Link href={`/p/${p.s}`} className="line-clamp-2 text-[14.5px] leading-snug font-bold">
                {p.n}
              </Link>
              <div className="mt-auto flex items-center justify-between pt-2">
                <b className="display text-[18px] tabular-nums">{formatPrice(p.p)}</b>
                {isSoldOut(p) ? (
                  <span className="text-[13px] font-bold text-ink-3">Дууссан</span>
                ) : (
                  <button type="button" onClick={() => cart.add(p.i)} className="btn btn-sun min-h-10 w-10 px-0" aria-label={`${p.n}: сагсанд нэмэх`}>
                    <BagIcon size={17} />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { SIZE_NAMES, soldOut, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { NoPhoto } from "./brand";
import { AddButton, HeartToggle } from "./card-actions";

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const out = soldOut(p);
  const img = p.images[0]?.thumb;
  const few = p.stock != null && p.stock > 0 && p.stock <= 3;
  return (
    <article className="panel card-lift group relative flex h-full flex-col overflow-hidden">
      <Link href={`/p/${p.slug}`} className="relative block aspect-square overflow-hidden bg-white" tabIndex={-1} aria-hidden>
        {img ? (
          <Image src={img.src} alt="" fill priority={priority} sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 50vw" className={`object-contain p-4 transition duration-500 group-hover:scale-[1.04] ${out ? "opacity-45 grayscale" : ""}`} />
        ) : (
          <NoPhoto title={p.title} brand={p.brand} />
        )}
        <span className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {p.group === "diapers" && p.sub && <span className="rounded-full bg-sky px-2.5 py-0.5 text-[12px] font-black text-night">{SIZE_NAMES[p.sub] ?? p.sub}</span>}
          {p.group === "namuun" && <span className="rounded-full bg-night px-2.5 py-0.5 text-[12px] font-black text-white">Намуун</span>}
          {p.featured && p.group !== "namuun" && <span className="rounded-full bg-sun px-2.5 py-0.5 text-[12px] font-black text-night">★ Онцлох</span>}
          {out && <span className="rounded-full bg-white px-2.5 py-0.5 text-[12px] font-black text-ink-2 ring-1 ring-line">Дууссан</span>}
        </span>
      </Link>
      <HeartToggle slug={p.slug} title={p.title} className="absolute top-3 right-3 z-20" />
      <div className="flex flex-1 flex-col gap-1 border-t border-line/70 p-3.5 md:p-4">
        {p.brand && <span className="text-[12px] font-extrabold tracking-wide text-sky-d uppercase">{p.brand}</span>}
        <Link href={`/p/${p.slug}`} className="line-clamp-2 text-[14.5px] leading-snug font-bold after:absolute after:inset-0 after:content-[''] hover:text-sky-d md:text-[15px]">
          {p.title}
        </Link>
        {p.group === "diapers" && (p.kg || p.fit) && (
          <span className="text-[12.5px] font-semibold text-ink-3">
            {[p.fit === "pants" ? "Өмсдөг" : p.fit === "tape" ? "Наадаг" : null, p.kg ? (p.kg[1] >= 40 ? `${p.kg[0]}+ кг` : `${p.kg[0]}–${p.kg[1]} кг`) : null].filter(Boolean).join(" · ")}
          </span>
        )}
        <div className="relative z-10 mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="flex flex-col">
            <span className="display text-[19px] leading-none tabular-nums md:text-[20px]">{formatPrice(p.price)}</span>
            {few && <span className="mt-1 text-[12px] font-extrabold text-pink-d">Сүүлийн {p.stock} ш</span>}
          </span>
          <AddButton id={p.id} title={p.title} soldOut={out} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ items, priority = 0 }: { items: Product[]; priority?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((p, i) => (
        <li key={p.id}>
          <ProductCard p={p} priority={i < priority} />
        </li>
      ))}
    </ul>
  );
}

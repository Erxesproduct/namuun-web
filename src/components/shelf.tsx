import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { Scroller } from "./scroller";

/** A titled, swipeable row of product cards. */
export function Shelf({ title, kicker, href, items, tone = "" }: { title: string; kicker?: string; href?: string; items: Product[]; tone?: string }) {
  if (!items.length) return null;
  return (
    <section className={`wrap mt-14 md:mt-20 ${tone}`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          {kicker && <p className="kicker">{kicker}</p>}
          <h2 className="mt-1 text-[26px] md:text-[34px]">{title}</h2>
        </div>
        {href && (
          <Link href={href} className="shrink-0 rounded-full bg-white px-4 py-2 text-[14px] font-extrabold text-sky-d ring-1 ring-line hover:bg-sky-l">
            Бүгд →
          </Link>
        )}
      </div>
      <Scroller label={title} className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-1 pb-6 md:mx-0 md:gap-4 md:px-0">
        {items.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23%] xl:w-[19%]">
            <ProductCard p={p} />
          </div>
        ))}
      </Scroller>
    </section>
  );
}

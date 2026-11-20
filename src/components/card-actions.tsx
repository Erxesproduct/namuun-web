"use client";

import { cart, maxQty, qtyInCart, useCart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { BagIcon, HeartIcon, MinusIcon, PlusIcon } from "./icons";

export function HeartToggle({ slug, title, className = "" }: { slug: string; title: string; className?: string }) {
  const on = useHearts().includes(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        hearts.toggle(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `${title}: хадгалснаас хасах` : `${title}: хадгалах`}
      className={`grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-sm ring-1 ring-line transition hover:scale-105 ${on ? "text-pink-d" : "text-ink-3 hover:text-pink-d"} ${className}`}
    >
      <HeartIcon size={19} filled={on} />
    </button>
  );
}

/** «+» on a card; once in the cart it turns into a − n + stepper, so a parent can stock up without leaving the shelf. */
export function AddButton({ id, title, soldOut }: { id: string; title: string; soldOut: boolean }) {
  const items = useCart();
  const qty = qtyInCart(items, id);
  if (soldOut) return <span className="rounded-full bg-morning px-3 py-2 text-[13px] font-extrabold text-ink-3">Дууссан</span>;
  if (!qty)
    return (
      <button type="button" onClick={() => cart.add(id)} className="btn btn-sun min-h-11 w-11 shrink-0 px-0 sm:w-auto sm:px-4" aria-label={`${title}: сагсанд нэмэх`}>
        <BagIcon size={18} />
        <span className="hidden text-[14px] sm:inline">Сагсанд</span>
      </button>
    );
  return (
    <div className="pop-in flex h-11 items-center rounded-full bg-night text-white" role="group" aria-label={`${title}: тоо ширхэг`}>
      <button type="button" onClick={() => cart.setQty(id, qty - 1)} className="grid h-11 w-10 place-items-center" aria-label="Цөөлөх">
        <MinusIcon size={15} />
      </button>
      <span className="min-w-5 text-center font-black tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={() => cart.add(id)} disabled={qty >= maxQty(id)} className="grid h-11 w-10 place-items-center disabled:opacity-40" aria-label="Нэмэх">
        <PlusIcon size={15} />
      </button>
    </div>
  );
}

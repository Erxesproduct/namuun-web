"use client";

import Link from "next/link";
import { useState } from "react";
import { cart, maxQty, qtyInCart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { BagIcon, MinusIcon, PlusIcon } from "./icons";

/** Quantity + add to cart, and a sticky bar on phones so the button is always under the thumb. */
export function ProductBuy({ id, title, price, soldOut }: { id: string; title: string; price: number; soldOut: boolean }) {
  const items = useCart();
  const inCart = qtyInCart(items, id);
  const cap = Math.max(0, maxQty(id) - inCart);
  const [qty, setQty] = useState(1);
  const n = Math.min(qty, Math.max(1, cap));

  if (soldOut)
    return (
      <div className="rounded-[22px] bg-morning p-5">
        <p className="text-[17px] font-black">Одоогоор дууссан</p>
        <p className="mt-1 text-[14.5px] text-ink-2">Салбартаа залгаж ирэх хугацааг асуугаарай, эсвэл ижил төрлийн барааг доороос харна уу.</p>
      </div>
    );

  const add = () => {
    cart.add(id, n);
    setQty(1);
  };
  const stepper = (
    <div className="flex h-14 items-center rounded-full bg-morning">
      <button type="button" onClick={() => setQty(Math.max(1, n - 1))} disabled={n <= 1} className="grid h-14 w-12 place-items-center disabled:opacity-30" aria-label="Цөөлөх">
        <MinusIcon size={16} />
      </button>
      <span className="w-8 text-center text-[18px] font-black tabular-nums" aria-live="polite">
        {n}
      </span>
      <button type="button" onClick={() => setQty(Math.min(cap, n + 1))} disabled={n >= cap} className="grid h-14 w-12 place-items-center disabled:opacity-30" aria-label="Нэмэх">
        <PlusIcon size={16} />
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {stepper}
        <button type="button" onClick={add} disabled={cap <= 0} className="btn btn-sun h-14 flex-1 px-6 text-[16.5px]">
          <BagIcon size={20} /> Сагсанд нэмэх
        </button>
      </div>
      {inCart > 0 && (
        <p className="pop-in mt-3 text-[14.5px] font-bold text-ok">
          Сагсанд {inCart} ширхэг байна ·{" "}
          <Link href="/cart" className="underline underline-offset-4">
            Сагс руу
          </Link>
        </p>
      )}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-ink-3">{title}</span>
            <span className="display block text-[20px] tabular-nums">{formatPrice(price * n)}</span>
          </span>
          {inCart > 0 ? (
            <Link href="/cart" className="btn btn-night h-12 shrink-0 px-5 text-[15px]">
              Сагс ({inCart})
            </Link>
          ) : null}
          <button type="button" onClick={add} disabled={cap <= 0} className="btn btn-sun h-12 shrink-0 px-5 text-[15px]">
            <BagIcon size={18} /> Нэмэх
          </button>
        </div>
      </div>
    </>
  );
}

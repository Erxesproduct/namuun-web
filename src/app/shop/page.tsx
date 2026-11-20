import type { Metadata } from "next";
import Link from "next/link";
import { ShelfArt } from "@/components/brand";
import { CloseIcon } from "@/components/icons";
import { ProductGrid } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { brands, getBrand, getGroup, groups, popular, SIZE_NAMES, soldOut, type Product } from "@/lib/catalog";

type SP = { g?: string; s?: string; b?: string; q?: string; stock?: string; sort?: string; fit?: string; page?: string };
const PER = 40;
const SORTS = [
  { id: "", label: "Эрэлттэй" },
  { id: "price", label: "Хямдаас" },
  { id: "-price", label: "Үнэтэйгээс" },
  { id: "new", label: "Шинэ" },
] as const;

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();

export async function generateMetadata({ searchParams }: { searchParams: Promise<SP> }): Promise<Metadata> {
  const sp = await searchParams;
  const g = sp.g ? getGroup(sp.g) : undefined;
  const b = sp.b ? getBrand(sp.b) : undefined;
  const title = [b?.name, g?.name, sp.s && g?.id === "diapers" ? `${sp.s} размер` : sp.s].filter(Boolean).join(" · ") || (sp.q ? `«${sp.q}»` : "Бүх бараа");
  return { title, alternates: { canonical: g ? `/shop?g=${g.id}` : "/shop" }, robots: sp.q || sp.page || sp.sort || sp.stock ? { index: false } : undefined };
}

export default async function Shop({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const group = sp.g ? getGroup(sp.g) : undefined;
  const brand = sp.b ? getBrand(sp.b) : undefined;
  const sub = group && sp.s && group.subs.some((s) => s.name === sp.s) ? sp.s : undefined;
  const fit = group?.id === "diapers" && (sp.fit === "tape" || sp.fit === "pants") ? sp.fit : undefined;
  const onlyStock = sp.stock === "1";
  const q = (sp.q ?? "").slice(0, 80);
  const words = norm(q).split(" ").filter(Boolean);

  let list: Product[] = popular;
  if (group) list = list.filter((p) => p.group === group.id);
  if (sub) list = list.filter((p) => p.sub === sub);
  if (fit) list = list.filter((p) => p.fit === fit);
  // brands available in this group / size (before the brand filter itself)
  const brandHere = new Map<string, number>();
  for (const p of list) if (p.brand) brandHere.set(p.brand, (brandHere.get(p.brand) ?? 0) + 1);
  if (brand) list = list.filter((p) => p.brand === brand.name);
  if (words.length) list = list.filter((p) => words.every((w) => norm(`${p.title} ${p.brand ?? ""} ${p.code}`).includes(w)));
  if (onlyStock) list = list.filter((p) => !soldOut(p));
  const sort = SORTS.find((s) => s.id === sp.sort)?.id ?? (sp.sort === "featured" ? "" : "");
  if (sort === "price") list = [...list].sort((a, b) => Number(soldOut(a)) - Number(soldOut(b)) || a.price - b.price);
  if (sort === "-price") list = [...list].sort((a, b) => Number(soldOut(a)) - Number(soldOut(b)) || b.price - a.price);
  if (sort === "new") list = [...list].sort((a, b) => Number(soldOut(a)) - Number(soldOut(b)) || b.createdAt.localeCompare(a.createdAt));

  const pages = Math.max(1, Math.ceil(list.length / PER));
  const page = Math.min(pages, Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1));
  const shown = list.slice((page - 1) * PER, page * PER);

  const href = (patch: Partial<SP>) => {
    const next: SP = { g: group?.id, s: sub, b: brand?.slug, q: q || undefined, stock: onlyStock ? "1" : undefined, sort: sort || undefined, fit, ...patch };
    if (!("page" in patch)) delete next.page;
    const u = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
    const s = u.toString();
    return s ? `/shop?${s}` : "/shop";
  };
  const brandList = [...brandHere].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n, slug: brands.find((x) => x.name === name)?.slug ?? "" }));

  const title = brand && !group ? brand.name : group ? group.name : q ? `«${q}» хайлт` : "Бүх бараа";
  const filtersOn = !!(sub || brand || q || onlyStock || fit);

  return (
    <div className="wrap pt-6 pb-10 md:pt-10">
      <nav aria-label="Зам" className="text-[13.5px] font-semibold text-ink-3">
        <Link href="/" className="hover:text-ink">
          Нүүр
        </Link>{" "}
        /{" "}
        <Link href="/shop" className="hover:text-ink">
          Бараа
        </Link>
        {group && <> / {group.name}</>}
      </nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-4">
          {group && (
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white shadow-sm">
              <ShelfArt icon={group.icon} className="w-10" />
            </span>
          )}
          <div>
            <h1 className="text-[30px] md:text-[42px]">
              {title}
              {sub && <span className="text-sky-d"> · {group?.id === "diapers" ? `${SIZE_NAMES[sub] === sub ? sub : `${SIZE_NAMES[sub]} (${sub})`}` : sub}</span>}
            </h1>
            <p className="text-[15px] text-ink-2">{group ? group.line : `${popular.length} бараа, ${brands.length} брэнд`}</p>
          </div>
        </div>
        {group?.id === "diapers" && (
          <Link href="/diapers" className="rounded-full bg-sun-l px-4 py-2 text-[14px] font-extrabold hover:bg-sun">
            Аль размер вэ? →
          </Link>
        )}
      </div>

      {/* groups */}
      <Scroller label="Ангилал" small className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        <Link href={href({ g: undefined, s: undefined, fit: undefined })} aria-current={!group} className="chip shrink-0">
          Бүгд
        </Link>
        {groups.map((g) => (
          <Link key={g.id} href={href({ g: g.id, s: undefined, fit: undefined, b: undefined })} aria-current={group?.id === g.id} className="chip shrink-0">
            {g.name}
          </Link>
        ))}
      </Scroller>

      {/* sub-shelves / sizes */}
      {group && group.subs.length > 0 && (
        <Scroller label="Дэд ангилал" small className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
          <Link href={href({ s: undefined })} aria-current={!sub} className="chip min-h-9 shrink-0 text-[13.5px]">
            Бүгд
          </Link>
          {group.subs.map((s) => (
            <Link key={s.name} href={href({ s: s.name })} aria-current={sub === s.name} className="chip min-h-9 shrink-0 text-[13.5px]">
              {group.id === "diapers" ? (SIZE_NAMES[s.name] === s.name ? s.name : `${SIZE_NAMES[s.name]} ${s.name}`) : s.name}
              <span className="opacity-60">{s.count}</span>
            </Link>
          ))}
        </Scroller>
      )}

      <div className="sticky top-[124px] z-30 -mx-4 mt-4 bg-morning/95 px-4 py-2.5 backdrop-blur md:top-[127px] md:mx-0 md:rounded-2xl md:px-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={href({ stock: onlyStock ? undefined : "1" })} aria-pressed={onlyStock} className="chip min-h-9 text-[13.5px]">
            {onlyStock ? "✓ " : ""}Бэлэн байгаа
          </Link>
          {group?.id === "diapers" && (
            <>
              <Link href={href({ fit: fit === "tape" ? undefined : "tape" })} aria-pressed={fit === "tape"} className="chip min-h-9 text-[13.5px]">
                Наадаг
              </Link>
              <Link href={href({ fit: fit === "pants" ? undefined : "pants" })} aria-pressed={fit === "pants"} className="chip min-h-9 text-[13.5px]">
                Өмсдөг
              </Link>
            </>
          )}
          {brandList.length > 1 && (
            <details className="group relative">
              <summary className="chip min-h-9 cursor-pointer list-none text-[13.5px] [&::-webkit-details-marker]:hidden" aria-label="Брэнд сонгох">
                {brand ? brand.name : "Брэнд"} ▾
              </summary>
              <div className="absolute left-0 z-40 mt-2 max-h-[55vh] w-[min(80vw,300px)] overflow-y-auto rounded-[20px] bg-white p-2 shadow-[0_24px_60px_-20px_rgb(14_43_82/0.45)] ring-1 ring-line">
                <Link href={href({ b: undefined })} className="block rounded-xl px-3 py-2 text-[14.5px] font-bold hover:bg-morning">
                  Бүх брэнд
                </Link>
                {brandList.map((x) => (
                  <Link key={x.name} href={href({ b: x.slug })} aria-current={brand?.name === x.name} className="flex justify-between rounded-xl px-3 py-2 text-[14.5px] font-semibold hover:bg-morning aria-[current=true]:bg-sky-l">
                    {x.name} <span className="text-ink-3">{x.n}</span>
                  </Link>
                ))}
              </div>
            </details>
          )}
          <span className="ml-auto flex flex-wrap items-center gap-1">
            {SORTS.map((s) => (
              <Link key={s.id} href={href({ sort: s.id || undefined })} aria-current={sort === s.id} className="rounded-full px-2.5 py-1.5 text-[13px] font-bold text-ink-2 hover:text-ink aria-[current=true]:bg-white aria-[current=true]:text-ink aria-[current=true]:shadow-sm">
                {s.label}
              </Link>
            ))}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px]">
        <span className="font-bold text-ink-2">{list.length} бараа</span>
        {brand && (
          <Link href={href({ b: undefined })} className="inline-flex items-center gap-1 rounded-full bg-sky-l px-3 py-1 font-bold">
            {brand.name} <CloseIcon size={13} />
          </Link>
        )}
        {q && (
          <Link href={href({ q: undefined })} className="inline-flex items-center gap-1 rounded-full bg-sky-l px-3 py-1 font-bold">
            «{q}» <CloseIcon size={13} />
          </Link>
        )}
        {filtersOn && (
          <Link href={group ? `/shop?g=${group.id}` : "/shop"} className="font-bold text-sky-d hover:underline">
            Шүүлтүүр арилгах
          </Link>
        )}
      </div>

      <div className="mt-4">
        {shown.length ? (
          <ProductGrid items={shown} priority={4} />
        ) : (
          <div className="panel mx-auto max-w-lg p-10 text-center">
            <p className="text-[22px] font-black">Илэрц олдсонгүй</p>
            <p className="mt-2 text-ink-2">Шүүлтүүрээ багасгах эсвэл өөр үгээр хайгаарай.</p>
            <Link href="/shop" className="btn btn-night mt-6">
              Бүх бараа
            </Link>
          </div>
        )}
      </div>

      {pages > 1 && (
        <nav aria-label="Хуудас" className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {page > 1 && (
            <Link href={href({ page: String(page - 1) })} className="btn btn-line min-h-11 px-4">
              ← Өмнөх
            </Link>
          )}
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1)
            .map((n, i, arr) => (
              <span key={n} className="flex items-center gap-2">
                {i > 0 && n - arr[i - 1] > 1 && <span className="text-ink-3">…</span>}
                <Link href={href({ page: n === 1 ? undefined : String(n) })} aria-current={n === page ? "page" : undefined} className={`grid h-11 min-w-11 place-items-center rounded-full px-3 font-extrabold tabular-nums ${n === page ? "bg-night text-white" : "bg-white ring-1 ring-line hover:ring-sky"}`}>
                  {n}
                </Link>
              </span>
            ))}
          {page < pages && (
            <Link href={href({ page: String(page + 1) })} className="btn btn-sun min-h-11 px-5">
              Дараах →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

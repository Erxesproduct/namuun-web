import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoPhoto, Star } from "@/components/brand";
import { HeartToggle } from "@/components/card-actions";
import { Gallery } from "@/components/gallery";
import { CheckIcon, PhoneIcon, PinIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductBuy } from "@/components/product-buy";
import { Shelf } from "@/components/shelf";
import { business } from "@/content/business";
import { branches, brandSlug, getGroup, getProduct, popular, products, SIZE_NAMES, sku, soldOut } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const description = `${p.title}${p.brand ? ` (${p.brand})` : ""}: ${formatPrice(p.price)}. ${business.title}, Улаанбаатарт 24–48 цагт хүргэнэ.`;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: { title: p.title, description, images: p.images[0] ? [{ url: p.images[0].src, width: p.images[0].w, height: p.images[0].h }] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const group = getGroup(p.group);
  const out = soldOut(p);
  const bSlug = p.brand ? brandSlug(p.brand) : null;
  const where = branches.filter((b) => b.apiId != null && p.branches.includes(b.apiId));
  const similar = popular.filter((x) => x.id !== p.id && x.group === p.group && (p.sub ? x.sub === p.sub : true) && !soldOut(x)).slice(0, 12);
  const sameBrand = p.brand ? popular.filter((x) => x.id !== p.id && x.brand === p.brand && !soldOut(x) && !similar.includes(x)).slice(0, 12) : [];

  const facts = [
    p.group === "diapers" && p.sub ? { k: "Размер", v: SIZE_NAMES[p.sub] === p.sub ? p.sub : `${SIZE_NAMES[p.sub]} (${p.sub})` } : null,
    p.kg ? { k: "Жин", v: p.kg[1] >= 40 ? `${p.kg[0]} кг-аас дээш` : `${p.kg[0]}–${p.kg[1]} кг` } : null,
    p.fit ? { k: "Төрөл", v: p.fit === "pants" ? "Өмсдөг" : "Наадаг" } : null,
    p.pcs ? { k: "Ширхэг", v: `${p.pcs} ш` } : null,
    p.pcs && p.group === "diapers" ? { k: "Нэгж үнэ", v: `${formatPrice(Math.round(p.price / p.pcs))} / ш` } : null,
    p.stage ? { k: "Шат", v: `${p.stage}-р шат` } : null,
    p.brand ? { k: "Брэнд", v: p.brand } : null,
    p.code ? { k: "Барааны код", v: p.code } : null,
  ].filter((x): x is { k: string; v: string } => !!x);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: sku(p.id),
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    image: p.images.map((i) => absoluteUrl(i.src)),
    offers: { "@type": "Offer", price: p.price, priceCurrency: "MNT", availability: out ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <div className="pb-28 md:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-5 md:pt-8">
        <nav aria-label="Зам" className="flex flex-wrap gap-x-1.5 text-[13.5px] font-semibold text-ink-3">
          <Link href="/" className="hover:text-ink">
            Нүүр
          </Link>
          /
          {group && (
            <Link href={`/shop?g=${group.id}`} className="hover:text-ink">
              {group.name}
            </Link>
          )}
          {group && p.sub && (
            <>
              /
              <Link href={`/shop?g=${group.id}&s=${encodeURIComponent(p.sub)}`} className="hover:text-ink">
                {p.sub}
              </Link>
            </>
          )}
        </nav>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div className="relative">
            {p.images.length ? (
              <Gallery photos={p.images} title={p.title} />
            ) : (
              <div className="aspect-square overflow-hidden rounded-[30px]">
                <NoPhoto title={p.title} brand={p.brand} />
              </div>
            )}
            <HeartToggle slug={p.slug} title={p.title} className="absolute top-4 right-4 h-12 w-12" />
          </div>
          <div>
            {p.brand &&
              (bSlug ? (
                <Link href={`/shop?b=${bSlug}`} className="kicker hover:underline">
                  {p.brand}
                </Link>
              ) : (
                <p className="kicker">{p.brand}</p>
              ))}
            <h1 className="mt-2 text-[28px] leading-tight md:text-[38px]">{p.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="display text-[36px] leading-none tabular-nums md:text-[42px]">{formatPrice(p.price)}</span>
              {out ? (
                <span className="rounded-full bg-morning px-3 py-1 text-[13.5px] font-extrabold text-ink-3">Дууссан</span>
              ) : p.stock != null ? (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13.5px] font-extrabold ${p.stock <= 3 ? "bg-pink-l text-pink-d" : "bg-ok-l text-ok"}`}>
                  <CheckIcon size={14} /> {p.stock <= 3 ? `Сүүлийн ${p.stock} ширхэг` : "Бэлэн байгаа"}
                </span>
              ) : null}
              {p.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sun-l px-3 py-1 text-[13.5px] font-extrabold">
                  <Star size={14} /> Онцлох
                </span>
              )}
            </div>

            <div className="panel mt-6 p-4 md:p-5">
              <ProductBuy id={p.id} title={p.title} price={p.price} soldOut={out} />
            </div>

            {facts.length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.k} className="rounded-[18px] bg-white px-4 py-3 ring-1 ring-line">
                    <dt className="text-[12.5px] font-bold text-ink-3">{f.k}</dt>
                    <dd className="mt-0.5 text-[15px] font-extrabold break-words">{f.v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <ul className="mt-6 space-y-2.5 rounded-[24px] bg-sky-l p-5 text-[14.5px]">
              <li className="flex gap-3">
                <TruckIcon size={20} className="mt-0.5 shrink-0 text-sky-d" />
                <span>
                  <b>
                    {business.delivery.area}: {formatPrice(business.delivery.fee)}
                  </b>
                  , 24–48 цагт. Онлайн захиалга {formatPrice(business.minOrder)}-өөс.
                </span>
              </li>
              <li className="flex gap-3">
                <QrIcon size={20} className="mt-0.5 shrink-0 text-sky-d" />
                <span>QPay-ээр төлнө. {business.rules.vat}</span>
              </li>
              {where.length > 0 && (
                <li className="flex gap-3">
                  <PinIcon size={20} className="mt-0.5 shrink-0 text-sky-d" />
                  <span>
                    Салбарт байгаа: <b>{where.map((b) => b.place).join(", ")}</b>
                  </span>
                </li>
              )}
              <li className="flex gap-3">
                <ShieldIcon size={20} className="mt-0.5 shrink-0 text-sky-d" />
                <span className="text-ink-2">{business.rules.stock}</span>
              </li>
            </ul>
            <a href={`tel:${business.phone.tel}`} className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-bold text-ink-2 hover:text-ink">
              <PhoneIcon size={16} /> Асуух зүйл байвал: {business.phone.display} ({business.phone.label})
            </a>
          </div>
        </div>
      </div>
      <Shelf kicker={group?.name} title={p.group === "diapers" && p.sub ? `${p.sub} размерын бусад живх` : "Ижил төрлийн бараа"} href={group ? `/shop?g=${group.id}${p.sub ? `&s=${encodeURIComponent(p.sub)}` : ""}` : undefined} items={similar} />
      {sameBrand.length > 0 && <Shelf kicker="Брэнд" title={`${p.brand}-ийн бусад бараа`} href={bSlug ? `/shop?b=${bSlug}` : undefined} items={sameBrand} />}
    </div>
  );
}

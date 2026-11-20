import Image from "next/image";
import Link from "next/link";
import { Cloud, LogoRound, ShelfArt, Star } from "@/components/brand";
import { ChatIcon, PhoneIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Shelf } from "@/components/shelf";
import { business } from "@/content/business";
import { branches, brands, DIAPER_SIZES, groups, inGroup, newest, popular, products, SIZE_NAMES, soldOut } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const TONES = ["bg-sky-l", "bg-pink-l", "bg-sun-l", "bg-lav-l"];

export default function Home() {
  const featured = popular.filter((p) => p.featured && !soldOut(p) && p.group !== "namuun");
  const best = popular.filter((p) => !soldOut(p) && !p.featured).slice(0, 14);
  const namuun = inGroup("namuun");
  const inStock = products.filter((p) => !soldOut(p)).length;
  return (
    <>
      {/* hero: the logo's night sky, the cover's sleeping plush baby under the mobile */}
      <section className="wrap pt-4 md:pt-6">
        <div className="night-sky cloud-edge relative overflow-hidden rounded-[32px] [--edge:var(--color-morning)] md:rounded-[44px]">
          <Star size={22} className="twinkle absolute top-[12%] left-[46%]" />
          <Star size={14} className="twinkle absolute top-[70%] left-[8%] [animation-delay:1.2s]" color="#ffd977" />
          <Star size={16} className="twinkle absolute top-[20%] right-[6%] [animation-delay:.6s]" color="#fff2cf" />
          <div className="relative grid items-center gap-6 px-6 pt-9 pb-16 md:grid-cols-[1.15fr_1fr] md:px-14 md:pt-14 md:pb-24">
            <div className="rise">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-extrabold tracking-wide">
                <Star size={14} /> Намуун Baby Shop · {branches.length} салбар
              </p>
              <h1 className="bubble mt-5 text-[46px] leading-[1.02] sm:text-[60px] lg:text-[76px]">{business.tagline}</h1>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/85 md:text-[19px]">
                {business.motto}: живх, угж, хуурай сүү, хүүхдийн хоол, арьс арчилгаа. {products.length} бараа, {brands.length} брэнд, бэлэн {inStock}.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/shop" className="btn btn-sun h-14 px-7 text-[16.5px]">
                  Бараа үзэх
                </Link>
                <Link href="/diapers" className="btn h-14 bg-white/10 px-6 text-[16px] text-white ring-2 ring-white/25 hover:bg-white/20">
                  Живхний размер сонгох
                </Link>
              </div>
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-bold text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <TruckIcon size={17} className="text-sun" /> Улаанбаатарт 24–48 цаг
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <QrIcon size={17} className="text-sun" /> QPay
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldIcon size={17} className="text-sun" /> НӨАТ-ын баримт
                </span>
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[420px]">
              <div className="absolute inset-[6%] rounded-full bg-sky/30 blur-2xl" aria-hidden />
              <div className="bob relative aspect-square overflow-hidden rounded-full ring-[10px] ring-white/10">
                <Image src="/brand/mobile-baby.webp" alt="Намуун: хүүхдийн орны тоглоомын доор унтаж буй бяцхан үр" fill priority sizes="(min-width: 768px) 420px, 80vw" className="object-cover object-[60%_40%]" />
              </div>
              <Cloud className="drift absolute -bottom-3 -left-6 w-32" />
              <Cloud className="absolute -right-4 bottom-10 w-20 opacity-90" />
            </div>
          </div>
        </div>
      </section>

      {/* shelves */}
      <section className="wrap mt-8 md:mt-12" aria-label="Ангилал">
        <ul className="grid grid-cols-4 gap-2.5 sm:gap-4 lg:grid-cols-8">
          {groups.map((g, i) => (
            <li key={g.id}>
              <Link href={`/shop?g=${g.id}`} className="group flex h-full flex-col items-center gap-2 rounded-[24px] bg-white p-2.5 text-center shadow-[0_14px_30px_-24px_rgb(14_43_82/0.5)] transition hover:-translate-y-1 sm:p-4">
                <span className={`grid aspect-square w-full max-w-[84px] place-items-center rounded-full ${TONES[i % 4]} transition group-hover:scale-105`}>
                  <ShelfArt icon={g.icon} className="w-[62%]" />
                </span>
                <span className="text-[12.5px] leading-tight font-extrabold sm:text-[15px]">{g.short}</span>
                <span className="hidden text-[12.5px] font-semibold text-ink-3 sm:block">{g.count} бараа</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* diaper sizes */}
      <Reveal as="section" className="wrap mt-12 md:mt-16">
        <div className="relative overflow-hidden rounded-[32px] bg-sun-l p-6 md:p-10">
          <Cloud className="drift absolute -top-4 right-10 w-40 opacity-80" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <p className="kicker text-ink-2">Живх, өмсдөг</p>
              <h2 className="mt-1 text-[28px] md:text-[36px]">Хүүхэд тань хэдэн кг вэ?</h2>
              <p className="mt-2 text-ink-2">Размерыг сонгоход тухайн размерын бүх брэнд гарч ирнэ. Кг нь савлагаан дээр бичсэнээр.</p>
            </div>
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-8 lg:max-w-[640px]">
              {DIAPER_SIZES.map((s) => (
                <li key={s.size}>
                  <Link href={`/shop?g=diapers&s=${s.size}`} className="flex h-full flex-col items-center rounded-[20px] bg-white px-1 py-3 text-center ring-2 ring-transparent transition hover:ring-sky">
                    <span className="bubble text-[22px] leading-none md:text-[26px]">{s.size === "JB" ? "JB" : s.size}</span>
                    <span className="mt-1.5 text-[11.5px] leading-tight font-extrabold text-ink-2">{s.from != null ? (s.to != null ? `${s.from}–${s.to} кг` : `${s.from}+ кг`) : SIZE_NAMES[s.size]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      <Shelf kicker="Намуунаас санал болгож байна" title="Онцлох бараа" href="/shop?sort=featured" items={featured.length >= 4 ? featured : best.slice(0, 10)} />
      <Shelf kicker="Хамгийн их бэлэн байгаа" title="Ээжүүдийн сонголт" href="/shop" items={best} />

      {/* Namuun's own brand */}
      {namuun.length > 0 && (
        <Reveal as="section" className="wrap mt-14 md:mt-20">
          <div className="grid gap-6 overflow-hidden rounded-[32px] bg-pink-l p-6 md:grid-cols-[300px_1fr] md:p-10">
            <div className="flex flex-col items-start">
              <LogoRound className="h-28 w-auto rounded-[26px] bg-white p-3 md:h-36" />
              <h2 className="mt-5 text-[28px] md:text-[34px]">Намуун брэнд</h2>
              <p className="mt-2 text-ink-2">Нярайд зориулсан ариутгасан даавуу, өлгий, дэр: Намуунаас өөрсдөө.</p>
              <Link href="/shop?g=namuun" className="btn btn-night mt-5">
                Бүгдийг үзэх
              </Link>
            </div>
            <ul className="no-scrollbar -mx-6 flex snap-x gap-3 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
              {namuun.slice(0, 6).map((p) => (
                <li key={p.id} className="w-[46%] shrink-0 snap-start md:w-auto">
                  <ProductCard p={p} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* brands */}
      <Reveal as="section" className="wrap mt-14 md:mt-20">
        <p className="kicker">{brands.length} брэнд</p>
        <h2 className="mt-1 text-[26px] md:text-[34px]">Итгэлтэй брэндүүд</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {brands.slice(0, 24).map((b) => (
            <li key={b.slug}>
              <Link href={`/shop?b=${b.slug}`} className="chip min-h-11 px-4 text-[15px]">
                {b.name} <span className="text-[12.5px] text-ink-3">{b.count}</span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/shop" className="chip min-h-11 px-4 text-[15px] text-sky-d">
              Бүгд →
            </Link>
          </li>
        </ul>
      </Reveal>

      <Shelf kicker="Хуурай сүү, нухаш, зууш" title="Хүүхдийн хоол" href="/shop?g=food" items={inGroup("food").filter((p) => !soldOut(p)).slice(0, 12)} />
      <Shelf kicker="Угж, соосог, аяга халбага" title="Нярайн хэрэглэл" href="/shop?g=baby" items={inGroup("baby").filter((p) => !soldOut(p)).slice(0, 12)} />
      <Shelf kicker="Эмзэг арьсанд" title="Арьс арчилгаа" href="/shop?g=care" items={inGroup("care").filter((p) => !soldOut(p)).slice(0, 12)} />
      <Shelf kicker="Сүүлд нэмэгдсэн" title="Шинэ бараа" href="/shop?sort=new" items={newest.slice(0, 12)} />

      {/* branches */}
      <Reveal as="section" className="wrap mt-14 md:mt-20">
        <div className="grid items-center gap-6 overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_18px_40px_-28px_rgb(14_43_82/0.35)] md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-6">
          <div className="relative aspect-[1100/794] overflow-hidden rounded-[24px]">
            <Image src="/brand/branches-square.webp" alt="Намуун 7 салбар, гишүүнчлэлийн карт 5%–15% хямдралтай" fill sizes="(min-width: 768px) 600px, 100vw" className="object-cover" />
          </div>
          <div className="px-2 pb-4 md:px-0 md:pb-0">
            <p className="kicker">Ойр байгаа салбартаа</p>
            <h2 className="mt-1 text-[28px] md:text-[36px]">{branches.length} салбар, нэг гэр бүл</h2>
            <p className="mt-2 text-ink-2">
              Улаанбаатарт 4, орон нутагт 3 салбар. {business.membership} (салбар дээр).
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {branches.map((b) => (
                <li key={b.n}>
                  <a href={`tel:${b.tel}`} className="flex items-center gap-3 rounded-2xl bg-rose-l px-3.5 py-2.5 transition hover:bg-rose hover:text-white">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[13px] font-black text-rose">{b.n}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px] font-extrabold">{b.place}</span>
                      <span className="block text-[13px] tabular-nums opacity-80">{b.phone}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/info#branches" className="mt-5 inline-flex font-extrabold text-sky-d hover:underline">
              Хаяг, дэлгэрэнгүй →
            </Link>
          </div>
        </div>
      </Reveal>

      {/* how it works */}
      <section className="wrap mt-14 md:mt-20">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: TruckIcon, t: `Хүргэлт ${formatPrice(business.delivery.fee)}`, d: business.rules.deliveryTime, c: "bg-sky-l" },
            { Icon: QrIcon, t: "QPay-ээр төлнө", d: business.rules.payment, c: "bg-sun-l" },
            { Icon: ShieldIcon, t: "НӨАТ-ын баримт", d: business.rules.vat, c: "bg-pink-l" },
            { Icon: ChatIcon, t: `${formatPrice(business.minOrder)}-өөс`, d: "Онлайн захиалгын доод дүн. Түүнээс бага бол салбараасаа аваарай.", c: "bg-lav-l" },
          ].map(({ Icon, t, d, c }, i) => (
            <Reveal as="li" key={t} delay={i * 80} className={`rounded-[26px] p-5 ${c}`}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-night">
                <Icon size={22} />
              </span>
              <p className="mt-4 text-[18px] font-black">{t}</p>
              <p className="mt-1 text-[14.5px] text-ink-2">{d}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 text-center text-[14.5px] text-ink-2">
          Асуух зүйл байна уу?{" "}
          <a href={`tel:${business.phone.tel}`} className="inline-flex items-center gap-1 font-extrabold text-night hover:text-sky-d">
            <PhoneIcon size={15} /> {business.phone.display}
          </a>{" "}
          ·{" "}
          <Link href="/info#faq" className="font-extrabold text-sky-d hover:underline">
            Түгээмэл асуулт
          </Link>
        </p>
      </section>
    </>
  );
}

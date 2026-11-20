import Link from "next/link";
import { Mobile } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="wrap py-14 text-center md:py-20">
      <div className="night-sky mx-auto max-w-2xl overflow-hidden rounded-[36px] px-6 pb-10">
        <Mobile className="mx-auto w-64" />
        <h1 className="text-[30px] md:text-[42px]">Энэ хуудас унтчихсан бололтой</h1>
        <p className="mt-2 text-white/80">Хаяг буруу эсвэл бараа шилжсэн байж магадгүй.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-sun">
            Бүх бараа
          </Link>
          <Link href="/" className="btn bg-white/10 text-white ring-2 ring-white/25">
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}

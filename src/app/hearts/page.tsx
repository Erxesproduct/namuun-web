import type { Metadata } from "next";
import { HeartsView } from "@/components/hearts-view";

export const metadata: Metadata = { title: "Хадгалсан", robots: { index: false } };

export default function HeartsPage() {
  return (
    <div className="wrap pt-8 pb-28 md:pt-12 md:pb-16">
      <h1 className="text-[34px] md:text-[46px]">Хадгалсан бараа</h1>
      <p className="mt-2 text-ink-2">Зүрх дарсан бараа энэ төхөөрөмж дээр хадгалагдана. Дараа нь нэг дор сагсална.</p>
      <HeartsView />
    </div>
  );
}

import { Nunito } from "next/font/google";

// Nunito has Ө ө Ү ү (checked in the Google Fonts cmap). Its round terminals echo the bubbly «Намуун» lettering of the
// logo; 900 for headings and prices, 600–800 for text and buttons.
export const nunito = Nunito({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "600", "700", "800", "900"], variable: "--font-nunito", display: "swap" });

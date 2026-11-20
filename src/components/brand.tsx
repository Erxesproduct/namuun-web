import Image from "next/image";

/** The shop's own wordmark: the round night-sky logo with the sleeping baby and «BABY SHOP» in bubble letters. */
export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/wordmark.png" alt="Намуун Baby Shop" width={876} height={120} priority={priority} className={className} />;
}
/** Just the round logo with «Намуун» (for phones). */
export function Mark({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/mark.png" alt="Намуун Baby Shop" width={136} height={120} priority={priority} className={className} />;
}
/** The full logo (moon, mobile, sleeping baby, «Намуун»). */
export function LogoRound({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/logo.png" alt="Намуун" width={520} height={462} priority={priority} className={className} />;
}

export function Star({ size = 18, className = "", color = "var(--color-sun)" }: { size?: number; className?: string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 2.5c.5 0 .9.3 1.1.8l2 4.6 5 .5c1 .1 1.4 1.3.6 2l-3.8 3.3 1.1 4.9c.2 1-.8 1.7-1.7 1.2L12 17.3l-4.3 2.5c-.9.5-1.9-.3-1.7-1.2l1.1-4.9L3.3 10.4c-.8-.7-.4-1.9.6-2l5-.5 2-4.6c.2-.5.6-.8 1.1-.8Z" fill={color} />
    </svg>
  );
}

export function Cloud({ className = "", color = "#fff" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 56" className={className} aria-hidden>
      <path d="M24 54C11 54 2 46 2 36c0-9 7-16 16-17C21 8 31 2 42 2c9 0 17 4 22 11 3-2 7-3 11-3 11 0 20 8 21 18 12 1 22 9 22 19 0 4-3 7-8 7H24Z" fill={color} />
    </svg>
  );
}

/**
 * The crib mobile from the logo: a bar with a crescent moon, stars and the little fox, swinging slowly.
 * Decorative only.
 */
export function Mobile({ className = "" }: { className?: string }) {
  const strings = [
    { x: 40, len: 70, item: "star" },
    { x: 95, len: 110, item: "fox" },
    { x: 150, len: 58, item: "moon" },
    { x: 205, len: 96, item: "star2" },
    { x: 255, len: 66, item: "cloud" },
  ];
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden>
      <g className="swing" style={{ transformOrigin: "150px 0px" }}>
        <path d="M150 0v18" stroke="#9fd8f3" strokeWidth="2.5" />
        <path d="M18 26c40-12 224-12 264 0" stroke="#9fd8f3" strokeWidth="4" fill="none" strokeLinecap="round" />
        {strings.map((s, i) => (
          <g key={s.x}>
            <path d={`M${s.x} ${22 - (s.x === 150 ? 3 : 0)}V${22 + s.len}`} stroke="#9fd8f3" strokeWidth="1.6" strokeDasharray={i % 2 ? "0" : "3 3"} />
            <g transform={`translate(${s.x} ${22 + s.len})`} className={s.item.startsWith("star") ? "twinkle" : undefined} style={{ animationDelay: `${i * 0.6}s` }}>
              {s.item.startsWith("star") && <path d="M0-14 4-5l10 1-7.5 6.5L8.6 12 0 7 -8.6 12-6.5 2.5-14-4l10-1Z" fill={s.item === "star" ? "#f6b52a" : "#ffd977"} />}
              {s.item === "moon" && <path d="M6-16A16 16 0 1 0 14 10 13 13 0 1 1 6-16Z" fill="#fff2cf" />}
              {s.item === "cloud" && <path d="M-16 8c-6 0-9-4-9-8s4-8 9-8c1-6 6-9 11-9 6 0 10 4 11 9 6 0 10 4 10 8s-3 8-9 8Z" fill="#fff" />}
              {s.item === "fox" && (
                <g fill="#9fd8f3">
                  <path d="M-30 4c4-6 12-9 20-9 4 0 7-6 11-8l1 6c6-1 12 1 16 5 3-1 7-1 10 1-4 1-6 4-6 7-6 1-11 0-15-2-4 3-10 5-17 4-6 0-12-1-20-4Z" />
                  <circle cx="4" cy="-4" r="1.3" fill="#0e2b52" />
                </g>
              )}
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Little round illustrations for the shop's shelves, drawn in the logo's colours. */
export function ShelfArt({ icon, className = "" }: { icon: string; className?: string }) {
  const common = { viewBox: "0 0 64 64", className, "aria-hidden": true } as const;
  switch (icon) {
    case "diaper":
      return (
        <svg {...common}>
          <path d="M10 18h44v10c0 14-10 24-22 24S10 42 10 28V18Z" fill="#fff" stroke="#3b5189" strokeWidth="3" strokeLinejoin="round" />
          <path d="M10 18h44v8H10z" fill="#5bc4ee" stroke="#3b5189" strokeWidth="3" strokeLinejoin="round" />
          <path d="M24 36c2 3 14 3 16 0" stroke="#e9abc9" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="22" r="1.8" fill="#fff" />
          <circle cx="44" cy="22" r="1.8" fill="#fff" />
        </svg>
      );
    case "bottle":
      return (
        <svg {...common}>
          <path d="M28 6h8l2 8h-12l2-8Z" fill="#f6b52a" stroke="#3b5189" strokeWidth="3" strokeLinejoin="round" />
          <rect x="22" y="14" width="20" height="6" rx="2" fill="#e9abc9" stroke="#3b5189" strokeWidth="3" />
          <path d="M23 20h18v28a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6V20Z" fill="#fff" stroke="#3b5189" strokeWidth="3" />
          <path d="M23 36h18v12a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6V36Z" fill="#dcf1fb" />
          <path d="M23 20h18v28a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6V20Z" fill="none" stroke="#3b5189" strokeWidth="3" />
          <path d="M30 28h6M30 34h6M30 40h6" stroke="#5bc4ee" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case "food":
      return (
        <svg {...common}>
          <path d="M8 30h48c0 13-10 22-24 22S8 43 8 30Z" fill="#fff" stroke="#3b5189" strokeWidth="3" strokeLinejoin="round" />
          <path d="M14 30c2-6 8-9 18-9s16 3 18 9" fill="#fff2cf" stroke="#3b5189" strokeWidth="3" />
          <path d="M40 8c-4 6-6 10-6 16" stroke="#3b5189" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="44" cy="10" rx="5" ry="3" fill="#5bc4ee" stroke="#3b5189" strokeWidth="2.5" />
          <circle cx="24" cy="26" r="2" fill="#f6b52a" />
          <circle cx="32" cy="24" r="2" fill="#e9abc9" />
        </svg>
      );
    case "care":
      return (
        <svg {...common}>
          <rect x="18" y="20" width="28" height="36" rx="8" fill="#fcebf3" stroke="#3b5189" strokeWidth="3" />
          <path d="M26 20v-6h12v6M30 14V8h10" stroke="#3b5189" strokeWidth="3" strokeLinejoin="round" fill="none" />
          <path d="M32 32c-4 4-6 7-6 10a6 6 0 0 0 12 0c0-3-2-6-6-10Z" fill="#5bc4ee" />
          <circle cx="50" cy="16" r="4" fill="#dcf1fb" stroke="#3b5189" strokeWidth="2" />
          <circle cx="12" cy="30" r="3" fill="#dcf1fb" stroke="#3b5189" strokeWidth="2" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M10 22h44v26a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6V22Z" fill="#fff" stroke="#3b5189" strokeWidth="3" />
          <path d="M10 22c0-4 3-7 7-7h30c4 0 7 3 7 7" fill="#5bc4ee" stroke="#3b5189" strokeWidth="3" />
          <path d="M22 15c2-5 18-5 20 0" fill="#fff" stroke="#3b5189" strokeWidth="3" />
          <path d="M20 36c4-3 8 3 12 0s8 3 12 0" stroke="#e9abc9" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "mama":
      return (
        <svg {...common}>
          <path d="M32 54S10 41 10 25a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 16-22 29-22 29Z" fill="#e9abc9" stroke="#3b5189" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="32" cy="32" r="7" fill="#fff2cf" stroke="#3b5189" strokeWidth="2.5" />
          <path d="M29 33c1 1 5 1 6 0" stroke="#3b5189" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "toy":
      return (
        <svg {...common}>
          <circle cx="32" cy="36" r="17" fill="#fff2cf" stroke="#3b5189" strokeWidth="3" />
          <circle cx="18" cy="20" r="7" fill="#fff2cf" stroke="#3b5189" strokeWidth="3" />
          <circle cx="46" cy="20" r="7" fill="#fff2cf" stroke="#3b5189" strokeWidth="3" />
          <circle cx="26" cy="34" r="2.2" fill="#3b5189" />
          <circle cx="38" cy="34" r="2.2" fill="#3b5189" />
          <ellipse cx="32" cy="42" rx="5" ry="3.5" fill="#e9abc9" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="26" fill="#3b5189" />
          <path d="M40 16a18 18 0 1 0 8 26 15 15 0 1 1-8-26Z" fill="#fff2cf" />
          <path d="m20 20 1.6 3.4 3.7.4-2.8 2.4.8 3.6L20 28l-3.3 1.8.8-3.6-2.8-2.4 3.7-.4Z" fill="#f6b52a" />
        </svg>
      );
  }
}

/** Shown where a product has no photo: the shop's moon-and-star badge with the brand name. */
export function NoPhoto({ title, brand, className = "" }: { title: string; brand?: string | null; className?: string }) {
  return (
    <div className={`night-sky relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden p-4 text-center ${className}`} role="img" aria-label={title}>
      <svg viewBox="0 0 64 64" className="h-1/3 max-h-20 w-auto" aria-hidden>
        <path d="M40 10a22 22 0 1 0 12 32 18 18 0 1 1-12-32Z" fill="#fff2cf" />
        <path d="m20 16 1.6 3.4 3.7.4-2.8 2.4.8 3.6L20 24l-3.3 1.8.8-3.6-2.8-2.4 3.7-.4Z" fill="#f6b52a" />
      </svg>
      <span className="line-clamp-2 text-[13px] leading-tight font-extrabold text-white/90">{brand ?? "Намуун"}</span>
    </div>
  );
}

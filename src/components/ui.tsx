import type { ReactNode } from "react";

export function Container({
  narrow = false,
  className = "",
  children,
}: {
  narrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`mx-auto px-[clamp(18px,4vw,40px)] ${narrow ? "max-w-[860px]" : "max-w-[1160px]"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ tone = "primary", children }: { tone?: "primary" | "accent"; children: ReactNode }) {
  return (
    <p
      className={`text-[13px] font-bold tracking-[.1em] uppercase ${tone === "accent" ? "text-accent" : "text-primary"}`}
    >
      {children}
    </p>
  );
}

export function SectionTitle({ className = "text-ink", children }: { className?: string; children: ReactNode }) {
  return (
    <h2
      className={`text-[clamp(30px,3.8vw,46px)] leading-[1.08] font-black tracking-[-.03em] text-balance ${className}`}
    >
      {children}
    </h2>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 text-[15px] leading-normal text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span aria-hidden className="mt-[9px] size-1.5 flex-none rounded-[2px] bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Small pulsing dot that marks live data. */
export function LiveDot() {
  return (
    <span aria-hidden className="relative inline-block size-2 flex-none">
      <span className="absolute inset-0 animate-dot rounded-full bg-primary" />
      <span className="absolute inset-0 rounded-full bg-primary" />
    </span>
  );
}

/** Yellow rounded square with the unit number, the map's only moving thing. */
export function JeepBadge({ unit, className }: { unit: string; className: string }) {
  return (
    <span
      className={`flex flex-none items-center justify-center bg-accent font-mono font-bold text-ink ${className}`}
    >
      {unit}
    </span>
  );
}

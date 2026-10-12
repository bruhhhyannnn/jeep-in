import Image from "next/image";
import icon from "@/assets/jeepin-icon.png";
import { pilotCopy } from "@/lib/site";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#map", label: "Live map" },
  { href: "#who", label: "Drivers and operators" },
  { href: "#routes", label: "Routes" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/92 backdrop-blur-[10px]">
      <div className="mx-auto flex h-[68px] max-w-[1160px] items-center gap-7 px-[clamp(18px,4vw,40px)]">
        <a href="#top" className="flex items-center gap-2.5 text-ink transition-opacity hover:text-ink hover:opacity-80">
          <Image src={icon} alt="" width={22} height={34} loading="eager" className="h-[34px] w-auto" />
          <span className="text-[19px] font-black tracking-[-.02em]">JEEP-IN</span>
        </a>
        <nav aria-label="Sections" className="hidden gap-[26px] text-sm font-semibold min-[900px]:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-muted transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex-1" />
        <a
          href="#join"
          className="flex h-[42px] items-center rounded-full bg-primary px-[18px] text-sm font-bold whitespace-nowrap text-white transition hover:bg-primary-hover hover:text-white active:translate-y-px"
        >
          {pilotCopy.ctaLabel}
        </a>
      </div>
    </header>
  );
}

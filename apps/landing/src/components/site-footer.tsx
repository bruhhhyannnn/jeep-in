import Image from "next/image";
import banner from "@/assets/jeepin-banner.png";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

const productLinks = [
  { href: "#how", label: "How it works" },
  { href: "#routes", label: "Routes" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
];

const linkClass = "text-line transition-colors hover:text-white";
const headingClass = "text-xs font-bold tracking-[.1em] text-subtle uppercase";

export function SiteFooter() {
  return (
    <footer className="bg-ink">
      <Container className="flex flex-col gap-9 pt-12 pb-9">
        <div className="flex flex-wrap justify-between gap-8">
          <div className="flex max-w-[320px] flex-col gap-3">
            <Image
              src={banner}
              alt="JEEP-IN · A tracking system for modern jeepneys in Ilocos Norte"
              sizes="300px"
              className="h-auto w-full max-w-[300px]"
            />
            <p className="text-sm leading-[1.6] text-mist">
              Live jeepney tracking for Laoag, Batac and Paoay, Ilocos Norte.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 text-sm font-medium">
            <nav aria-labelledby="footer-product" className="flex flex-col gap-2.5">
              <p id="footer-product" className={headingClass}>
                Product
              </p>
              {productLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </nav>
            <address className="flex flex-col gap-2.5 text-line not-italic">
              <p className={headingClass}>Contact</p>
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Facebook · JEEP-IN
              </a>
              <p>CCIS, Mariano Marcos State University</p>
              <p>City of Batac, Ilocos Norte</p>
            </address>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/12 pt-[22px] text-[13px] font-medium text-subtle">
          <p>© 2026 JEEP-IN · MMSU MIT project</p>
          <a href="#top" className="text-mist transition-colors hover:text-white">
            Back to top
          </a>
        </div>
      </Container>
    </footer>
  );
}

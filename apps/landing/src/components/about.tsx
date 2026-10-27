import { PartnerLink } from "@/components/join-context";
import { Container, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="bg-white">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(32px,5vw,64px)] py-[clamp(64px,8vw,112px)]">
        <div className="flex flex-col gap-3.5">
          <Eyebrow>About the project</Eyebrow>
          <h2 className="text-[clamp(28px,3.4vw,40px)] leading-[1.1] font-black tracking-[-.03em] text-balance text-ink">
            A Master in Information Technology project at Mariano Marcos State University
          </h2>
          <p className="text-[17px] leading-[1.6] text-pretty text-muted">
            JEEP-IN is being built at the College of Computing and Information Sciences in the City
            of Batac. It started from the question every commuter asks at the roadside:{" "}
            <strong className="text-ink">“Ayanno tay jeep’en?”</strong> Where’s the jeep already?
          </p>
          <p className="text-[15px] font-semibold text-ink">Built by Bryan Jesus Mangapit</p>
        </div>
        <div className="flex flex-col gap-3.5 rounded-[28px] bg-ink p-7 transition-shadow duration-200 ease-out hover:shadow-[0_18px_40px_rgba(11,27,51,.3)]">
          <p className="text-xs font-bold tracking-[.1em] text-accent uppercase">
            For panels, LGUs and partners
          </p>
          <p className="text-[22px] leading-[1.3] font-extrabold text-pretty text-white">
            Want JEEP-IN on your route? We’ll walk you through the commuter, driver and manager
            apps.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2.5">
            <a
              href={`mailto:${site.email}?subject=JEEP-IN%20demo%20request`}
              className="flex h-12 items-center rounded-full bg-accent px-5 text-[15px] font-extrabold text-ink transition hover:bg-accent-hover hover:text-ink active:translate-y-px"
            >
              Request a demo
            </a>
            <PartnerLink className="flex h-12 items-center rounded-full border-[1.5px] border-white/30 px-5 text-[15px] font-bold text-white transition hover:border-white/60 hover:bg-white/10 hover:text-white active:translate-y-px">
              Partner with us
            </PartnerLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { HeroPhone } from "@/components/hero-phone";
import { Container } from "@/components/ui";
import { pilot, pilotCopy } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-sky">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,6vw,72px)] py-[clamp(48px,7vw,96px)]">
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2 self-start rounded-full border border-line bg-white py-[7px] pr-[13px] pl-[9px] text-[13px] font-semibold text-ink">
            <span aria-hidden className="size-2.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(22,112,224,.16)]" />
            {pilotCopy.eyebrow}
          </p>
          <h1 className="text-[clamp(40px,6.2vw,72px)] leading-[1.02] font-black tracking-[-.035em] text-balance text-ink">
            Know when your jeep is coming.
          </h1>
          <p className="max-w-[480px] text-[clamp(17px,1.6vw,19px)] leading-[1.55] text-pretty text-muted">
            Live jeepneys on the Laoag – Batac – Paoay route, with the minutes to your stop.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#join"
              className="flex h-[54px] items-center rounded-full bg-primary px-[26px] text-base font-bold text-white shadow-[0_10px_24px_rgba(22,112,224,.28)] transition hover:bg-primary-hover hover:text-white active:translate-y-px"
            >
              {pilotCopy.ctaLabel}
            </a>
            <a
              href="#how"
              className="flex h-[54px] items-center rounded-full border-[1.5px] border-line-strong bg-white px-6 text-base font-bold text-ink transition hover:border-ink hover:bg-sunken hover:text-ink active:translate-y-px"
            >
              See how it works
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3.5">
            <div className="flex h-12 items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-line-strong bg-white pr-4 pl-3 text-subtle">
              <svg
                aria-hidden
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                className="flex-none"
              >
                <path d="M6 3.5v17l14-8.5z" />
              </svg>
              <p className="flex flex-col leading-[1.1]">
                <span className="text-[10px] font-semibold tracking-[.04em] uppercase">Coming soon to</span>
                <span className="text-[15px] font-extrabold text-muted">Google Play</span>
              </p>
            </div>
            <p className="text-[13px] leading-normal font-medium text-muted">
              {pilot.partner && (
                <>
                  Piloting with <strong className="text-ink">{pilot.partner}</strong>
                  <br />
                </>
              )}
              Free for commuters · City of Batac, Ilocos Norte
            </p>
          </div>
        </div>

        <HeroPhone />
      </Container>
    </section>
  );
}

import type { ReactNode } from "react";
import { RouteMap } from "@/components/route-map";
import { Container, Eyebrow, JeepBadge, SectionTitle } from "@/components/ui";

const legend: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: (
      <svg aria-hidden width="36" height="36" viewBox="0 0 36 36" className="flex-none">
        <circle cx="18" cy="18" r="16" className="fill-primary" fillOpacity={0.3} />
        <circle cx="18" cy="18" r="7" className="fill-primary stroke-white" strokeWidth="3" />
      </svg>
    ),
    title: "You",
    body: "The blue dot. Only your phone knows where it is.",
  },
  {
    icon: (
      <JeepBadge
        unit="J14"
        className="size-9 rounded-[10px] border-[3px] border-white text-[9px]"
      />
    ),
    title: "Jeepneys",
    body: "Yellow squares with the unit number. The only thing that moves.",
  },
  {
    icon: (
      <svg aria-hidden width="36" height="36" viewBox="0 0 36 36" className="flex-none">
        <circle cx="18" cy="18" r="10" className="fill-white stroke-mist" strokeWidth="4" />
        <circle cx="18" cy="18" r="4" className="fill-ink" />
      </svg>
    ),
    title: "Stops",
    body: "Named landmarks where jeeps pick up and drop off.",
  },
  {
    icon: (
      <svg
        aria-hidden
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        strokeLinecap="round"
        className="flex-none"
      >
        <path d="M4 7 H32" className="stroke-white" strokeWidth="4.5" />
        <path d="M5 18 H31" className="stroke-white" strokeWidth="9" />
        <path d="M5 18 H31" className="stroke-accent" strokeWidth="5" />
        <path d="M5 29 H31" className="stroke-primary" strokeWidth="4.5" strokeDasharray="0 8" />
      </svg>
    ),
    title: "Routes",
    body: "Solid for jeeps. Yellow is your jeep’s way to your stop. Dotted blue is your walk.",
  },
];

export function LiveMap() {
  return (
    <section id="map" className="bg-ink">
      <Container className="flex flex-col gap-9 py-[clamp(64px,8vw,112px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[600px] flex-col gap-3">
            <Eyebrow tone="accent">Live map</Eyebrow>
            <SectionTitle className="text-white">
              Four things on the map. Nothing else.
            </SectionTitle>
          </div>
          <p className="max-w-[380px] text-base leading-[1.6] text-pretty text-mist">
            A map you can read at a glance from the roadside, in bright sun or at night.
          </p>
        </div>

        <RouteMap />

        <p className="-mt-[18px] flex items-center gap-2.5 text-sm font-semibold text-line">
          <span
            aria-hidden
            className="size-2.5 flex-none rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,198,46,.25)]"
          />
          Tap a jeep to see how long until it reaches your stop.
        </p>

        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-3.5">
          {legend.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3.5 rounded-[20px] border border-white/12 bg-white/6 p-[18px] transition duration-200 ease-out hover:border-white/28 hover:bg-white/11"
            >
              {item.icon}
              <div>
                <h3 className="text-base font-extrabold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-normal text-mist">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

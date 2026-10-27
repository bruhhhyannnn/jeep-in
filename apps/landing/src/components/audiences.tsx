import type { ReactNode } from "react";
import { EtaCard } from "@/components/eta-card";
import { BulletList, Container, Eyebrow, JeepBadge, LiveDot, SectionTitle } from "@/components/ui";

function SharingDial() {
  return (
    <>
      <div className="relative flex size-[124px] flex-col items-center justify-center gap-0.5 rounded-full bg-primary shadow-[0_0_0_10px_rgba(22,112,224,.16),0_12px_28px_rgba(22,112,224,.3)]">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-ring rounded-full border-[3px] border-primary"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-ring rounded-full border-[3px] border-primary [animation-delay:1.2s]"
        />
        <span className="relative text-xl font-black text-white">Sharing</span>
        <span className="relative text-[11px] font-semibold text-on-primary">Tap to stop</span>
      </div>
      <span className="rounded-full border-[1.5px] border-line bg-white px-3 py-2 text-xs font-bold text-ink">
        Toward Paoay
      </span>
    </>
  );
}

/** A unit whose position is old or missing: hollow instead of yellow. */
function StaleUnit({ unit, className }: { unit: string; className: string }) {
  return (
    <span
      className={`flex size-7 flex-none items-center justify-center rounded-lg border-2 border-subtle bg-white font-mono text-[8px] font-bold text-subtle ${className}`}
    >
      {unit}
    </span>
  );
}

function FleetList() {
  return (
    <ul className="flex w-full max-w-[280px] flex-col rounded-[20px] bg-white px-3.5 py-2 shadow-md">
      <li className="flex items-center gap-3 border-b border-sunken py-2">
        <JeepBadge
          unit="J14"
          className="size-7 rounded-lg border-[2.5px] border-white text-[8px] shadow-[0_1px_4px_rgba(0,0,0,.2)]"
        />
        <span className="flex-1 text-[13px] font-bold text-ink">Sharing live</span>
        <LiveDot />
      </li>
      <li className="flex items-center gap-3 border-b border-sunken py-2">
        <StaleUnit unit="J07" className="border-dashed" />
        <span className="flex-1 text-[13px] font-bold text-ink">Last known · no signal</span>
      </li>
      <li className="flex items-center gap-3 py-2">
        <StaleUnit unit="J22" className="opacity-50" />
        <span className="flex-1 text-[13px] font-bold text-muted">GPS off</span>
      </li>
    </ul>
  );
}

const audiences: { visual: ReactNode; label: string; title: string; points: string[] }[] = [
  {
    visual: <EtaCard />,
    label: "For commuters",
    title: "Stop guessing at the roadside",
    points: [
      "Minutes until the next jeep reaches your stop",
      "Nearest stop and the walk to get there",
      "Fare guide for every stop on the route",
    ],
  },
  {
    visual: <SharingDial />,
    label: "For drivers",
    title: "One button, then drive",
    points: [
      "Start and stop sharing with one big button",
      "Asks to switch direction at the end of the route",
      "Report a problem in one tap once the jeep has stopped",
    ],
  },
  {
    visual: <FleetList />,
    label: "For operators and LGUs",
    title: "The whole fleet on one screen",
    points: [
      "Every unit live, on web, tablet or phone",
      "See at once when a unit loses signal or GPS",
      "Driver reports and unit assignments in one place",
    ],
  },
];

export function Audiences() {
  return (
    <section id="who" className="bg-white">
      <Container className="flex flex-col gap-11 py-[clamp(64px,8vw,112px)]">
        <div className="flex max-w-[680px] flex-col gap-3">
          <Eyebrow>Three apps, one route</Eyebrow>
          <SectionTitle>Built for the people who ride, drive and run the jeeps</SectionTitle>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
          {audiences.map((a) => (
            <article
              key={a.label}
              className="flex flex-col overflow-hidden rounded-[28px] border-[1.5px] border-line transition duration-200 ease-out hover:-translate-y-[3px] hover:border-line-strong hover:shadow-[0_18px_40px_rgba(17,48,90,.12)]"
            >
              <div className="flex h-[200px] items-center justify-center gap-[18px] bg-sky p-6">
                {a.visual}
              </div>
              <div className="flex flex-col gap-3.5 px-[26px] pt-[26px] pb-7">
                <p className="text-xs font-bold tracking-[.1em] text-subtle uppercase">{a.label}</p>
                <h3 className="text-[23px] leading-[1.2] font-extrabold text-ink">{a.title}</h3>
                <BulletList items={a.points} />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

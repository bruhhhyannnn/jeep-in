"use client";

import { useState, type CSSProperties } from "react";
import { Container, Eyebrow, JeepBadge, SectionTitle } from "@/components/ui";
import { pilot } from "@/lib/site";

type Stop = {
  name: string;
  km: string;
  meta: string;
  address: string;
  count: string;
  countLabel: string;
  next: string;
  fare: string;
  unit: string;
  unitLine: string;
};

const stops: Stop[] = [
  {
    name: "Laoag terminal",
    km: "0 km",
    meta: "Stop 1 of 7 · start of route",
    address: "Origin. Jeeps wait here before each trip.",
    count: "6",
    countLabel: "jeeps waiting",
    next: "Now",
    fare: "—",
    unit: "J22",
    unitLine: "J22 · leaves for Paoay",
  },
  {
    name: "San Nicolas",
    km: "3.4 km",
    meta: "Stop 2 of 7 · 3.4 km from Laoag",
    address: "Brgy. 1 San Francisco, fronting the public market",
    count: "2",
    countLabel: "jeeps approaching",
    next: "9 min",
    fare: "₱13.00",
    unit: "J07",
    unitLine: "J07 · toward Paoay",
  },
  {
    name: "Batac City Plaza",
    km: "10.7 km",
    meta: "Stop 4 of 7 · 10.7 km from Laoag",
    address: "Rizal St. corner Washington, beside the city hall",
    count: "3",
    countLabel: "jeeps approaching",
    next: "4 min",
    fare: "₱25.00",
    unit: "J14",
    unitLine: "J14 · toward Paoay",
  },
  {
    name: "MMSU main gate",
    km: "12.1 km",
    meta: "Stop 5 of 7 · 12.1 km from Laoag",
    address: "Brgy. Quiling Sur, university main entrance",
    count: "3",
    countLabel: "jeeps approaching",
    next: "12 min",
    fare: "₱28.00",
    unit: "J14",
    unitLine: "J14 · toward Paoay",
  },
  {
    name: "Batac – Paoay junction",
    km: "15.2 km",
    meta: "Stop 6 of 7 · 15.2 km from Laoag",
    address: "Transfer point where the Batac and Paoay roads meet",
    count: "2",
    countLabel: "jeeps approaching",
    next: "18 min",
    fare: "₱33.00",
    unit: "J14",
    unitLine: "J14 · toward Paoay",
  },
  {
    name: "Paoay Church",
    km: "21.6 km",
    meta: "Stop 7 of 7 · end of route",
    address: "End of route, beside the church grounds",
    count: "1",
    countLabel: "jeep approaching",
    next: "26 min",
    fare: "₱45.00",
    unit: "J14",
    unitLine: "J14 · toward Paoay",
  },
];

function StopDot({ open, className = "" }: { open: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex size-8 flex-none items-center justify-center rounded-full border-[5px] border-ink ${
        open ? "bg-ink shadow-[0_0_0_6px_rgba(11,27,51,.16)]" : "bg-white"
      } ${className}`}
    >
      <span className={`size-2 rounded-full ${open ? "bg-white" : "bg-ink"}`} />
    </span>
  );
}

function StopCard({ stop }: { stop: Stop }) {
  return (
    <div className="flex flex-col gap-3 text-left">
      <div>
        <p className="font-mono text-[10px] font-semibold text-subtle">{stop.meta}</p>
        <p className="mt-1 text-[17px] leading-[1.2] font-extrabold text-ink">{stop.name}</p>
        <p className="mt-[3px] text-xs leading-[1.45] text-muted">{stop.address}</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="rounded-xl bg-sunken p-2">
          <p className="text-base font-extrabold text-ink">{stop.count}</p>
          <p className="text-[10px] leading-[1.3] font-medium text-muted">{stop.countLabel}</p>
        </div>
        <div className="rounded-xl bg-accent p-2">
          <p className="text-base font-black text-ink italic">{stop.next}</p>
          <p className="text-[10px] leading-[1.3] font-semibold text-ink">next jeep</p>
        </div>
        <div className="rounded-xl bg-sunken p-2">
          <p className="font-mono text-[13px] leading-normal font-semibold text-ink">{stop.fare}</p>
          <p className="text-[10px] leading-[1.3] font-medium text-muted">from Laoag</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 border-t border-sunken pt-2.5">
        <JeepBadge
          unit={stop.unit}
          className="size-[26px] rounded-lg border-[2.5px] border-white text-[7.5px] shadow-[0_1px_4px_rgba(0,0,0,.2)]"
        />
        <p className="min-w-0 flex-1 text-xs font-bold text-ink">{stop.unitLine}</p>
        <p className="font-mono text-[11px] font-semibold text-muted">{stop.next}</p>
      </div>
    </div>
  );
}

/** Keep the first and last cards inside the route card; centre the rest over their stop. */
function popoverPosition(i: number): { card: CSSProperties; arrow: CSSProperties } {
  if (i === 0) return { card: { left: "calc(50% - 40px)" }, arrow: { left: 40 } };
  if (i === stops.length - 1) return { card: { right: "calc(50% - 40px)" }, arrow: { right: 40 } };
  return { card: { left: "50%", transform: "translateX(-50%)" }, arrow: { left: "50%" } };
}

export function RoutesCovered() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="routes" className="bg-sky">
      <Container className="flex flex-col gap-10 py-[clamp(64px,8vw,112px)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[620px] flex-col gap-3">
            <Eyebrow>Routes covered</Eyebrow>
            <SectionTitle>Laoag – Batac – Paoay, both directions</SectionTitle>
          </div>
          <dl className="flex gap-7">
            <div className="flex flex-col-reverse">
              <dt className="mt-1.5 text-[13px] font-medium text-muted">end to end</dt>
              <dd className="text-[34px] leading-none font-black text-ink">
                21.6<span className="text-lg"> km</span>
              </dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="mt-1.5 text-[13px] font-medium text-muted">stops shown</dt>
              <dd className="text-[34px] leading-none font-black text-ink">6</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[28px] bg-white px-7 py-8 shadow-sm">
          {/* Wide: stops along a line, hover or focus a stop to preview its card */}
          <ol className="relative hidden grid-cols-6 min-[860px]:grid">
            <li aria-hidden className="absolute top-[13px] right-[8.33%] left-[8.33%] h-1.5 rounded-full bg-ink" />
            <li
              aria-hidden
              className={`pointer-events-none absolute top-4 left-[30%] z-[4] -mt-[15px] -ml-[15px] flex size-[30px] items-center justify-center rounded-[9px] border-[3px] border-white bg-accent font-mono text-[8px] font-bold text-ink shadow-[0_2px_6px_rgba(0,0,0,.25)] ${
                pilot.animateJeeps ? "animate-ride" : ""
              }`}
            >
              J14
            </li>
            {stops.map((stop, i) => {
              const isOpen = open === i;
              const pos = popoverPosition(i);
              return (
                <li
                  key={stop.name}
                  className={`relative px-1.5 pb-1 ${isOpen ? "z-10" : "z-[1]"}`}
                  onMouseEnter={() => setOpen(i)}
                  onMouseLeave={() => setOpen(-1)}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(i)}
                    onFocus={() => setOpen(i)}
                    onBlur={() => setOpen(-1)}
                    className="flex w-full cursor-pointer flex-col items-center gap-3 text-center"
                  >
                    <StopDot
                      open={isOpen}
                      className={`relative z-[3] transition-[transform,box-shadow] duration-150 ease-out ${isOpen ? "scale-[1.18]" : ""}`}
                    />
                    <span className="text-[15px] leading-[1.25] font-extrabold text-balance text-ink">{stop.name}</span>
                    <span className="font-mono text-xs font-semibold text-muted">{stop.km}</span>
                  </button>
                  {isOpen && (
                    <div className="pointer-events-none absolute bottom-full z-10 w-[280px] pb-3.5" style={pos.card}>
                      <div className="relative animate-pop rounded-[22px] border border-line bg-white p-4 shadow-pop">
                        <StopCard stop={stop} />
                        <span
                          aria-hidden
                          className="absolute -bottom-2 -mx-[7px] size-3.5 rotate-45 border-r border-b border-line bg-white"
                          style={pos.arrow}
                        />
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Narrow: a vertical line, tap a stop to open its card in place */}
          <ol className="relative flex flex-col min-[860px]:hidden">
            <li aria-hidden className="absolute top-4 bottom-4 left-[13px] w-1.5 rounded-full bg-ink" />
            {stops.map((stop, i) => {
              const isOpen = open === i;
              return (
                <li key={stop.name} className="relative flex gap-4 py-1.5">
                  <StopDot open={isOpen} className="relative" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-[5px]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex cursor-pointer items-baseline justify-between gap-3 text-left after:absolute after:inset-0"
                    >
                      <span className="text-base font-extrabold text-ink">{stop.name}</span>
                      <span className="font-mono text-xs font-semibold text-muted">{stop.km}</span>
                    </button>
                    {isOpen && (
                      <div className="relative mb-1.5 animate-pop rounded-[18px] border border-line bg-white p-3.5 shadow-md">
                        <StopCard stop={stop} />
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="text-sm font-semibold text-ink">
          <span className="min-[860px]:hidden">Tap a stop to preview its stop card.</span>
          <span className="hidden min-[860px]:inline">Hover a stop to preview its stop card.</span>
        </p>
        <p className="text-sm leading-[1.6] text-muted">
          More routes in Ilocos Norte are planned after the pilot. Tell us which one you ride when you join.
        </p>
      </Container>
    </section>
  );
}

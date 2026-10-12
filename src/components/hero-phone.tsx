"use client";

import { useRef, useState } from "react";
import { JeepLayer, type JeepMapConfig } from "@/components/jeep-layer";

const heroMap: JeepMapConfig = {
  width: 276,
  scale: 0.66,
  yourStop: { name: "Batac City Plaza", x: 96, y: 214 },
  range: [0.02, 0.44],
  speed: 16,
  tripMin: 12,
  tripKm: 4.2,
  popFlip: 150,
  stops: [{ name: "Batac City Plaza", x: 96, y: 214 }],
  start: { J14: [0.14, 1], J07: [0.4, 1] },
  hint: "J14",
};

const tabs = ["Map", "Stops", "Fares", "Alerts"];

/** Commuter app home screen in a phone frame, with live jeeps on the map. */
export function HeroPhone() {
  const route = useRef<SVGPathElement>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative flex justify-center">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 aspect-square w-[min(520px,110%)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,198,46,.35),rgba(255,198,46,0)_62%)]"
      />
      <div className="relative h-[620px] w-[300px] rounded-[46px] bg-ink p-3 shadow-[0_40px_80px_rgba(17,48,90,.28),0_8px_20px_rgba(17,48,90,.16)]">
        <div onClick={() => setSelected(null)} className="relative size-full overflow-hidden rounded-[36px] bg-map">
          <svg viewBox="0 0 276 596" className="absolute inset-0 size-full">
            <path
              d="M-10 180 H290M-10 330 H290M-10 470 H290M70 -10 V610M200 -10 V610"
              className="fill-none stroke-map-street"
              strokeWidth={12}
            />
            <path
              d="M-10 420 C80 400 170 360 290 300"
              className="fill-none stroke-mist"
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <path
              ref={route}
              d="M-10 150 C40 150 70 170 96 214 C122 258 150 330 176 420 C190 470 200 530 210 610"
              className="fill-none stroke-ink"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <path
              d="M148 330 H96 V224"
              className="fill-none stroke-primary"
              strokeWidth={4.5}
              strokeDasharray="0 8"
              strokeLinecap="round"
            />
            <circle cx={96} cy={214} r={9} className="fill-white stroke-ink" strokeWidth={4} />
            <circle cx={96} cy={214} r={3.5} className="fill-ink" />
            <circle cx={156} cy={330} r={26} className="fill-primary" fillOpacity={0.16} />
            <circle cx={156} cy={330} r={9} className="fill-primary stroke-white" strokeWidth={3.5} />
            <JeepLayer config={heroMap} route={route} selected={selected} onSelect={setSelected} />
          </svg>

          <div className="absolute top-3.5 right-4 left-4 flex justify-between font-mono text-[10px] font-semibold text-ink">
            <span>9:41</span>
            <span>JEEP-IN</span>
          </div>
          <div className="absolute top-[38px] right-3.5 left-3.5 flex h-[46px] items-center gap-2.5 rounded-full bg-white px-4 shadow-[0_6px_16px_rgba(17,48,90,.12)]">
            <svg
              aria-hidden
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              className="flex-none stroke-subtle"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4.3-4.3" />
            </svg>
            <span className="text-[13px] font-medium text-subtle">Where are you going?</span>
          </div>
          <div className="absolute top-[172px] left-[116px] w-[136px] rounded-xl bg-ink px-[11px] py-[7px] whitespace-nowrap shadow-[0_8px_18px_rgba(0,0,0,.2)]">
            <p className="text-[8.5px] font-bold tracking-[.08em] text-accent uppercase">Nearest stop · 240 m</p>
            <p className="text-xs font-bold text-white">Batac City Plaza</p>
            <span aria-hidden className="absolute bottom-3 -left-1 size-2.5 rotate-45 bg-ink" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 rounded-t-[26px] bg-white px-4 pt-2.5 pb-3 shadow-[0_-8px_24px_rgba(17,48,90,.10)]">
            <span aria-hidden className="h-1 w-10 self-center rounded-full bg-line" />
            <p className="text-[11px] font-bold tracking-[.06em] text-subtle uppercase">Next jeeps to Batac City Plaza</p>
            <div className="flex items-center gap-3">
              <div className="flex size-14 flex-none flex-col items-center justify-center rounded-2xl bg-accent text-ink">
                <span className="text-2xl leading-none font-black italic">4</span>
                <span className="text-[9px] font-bold">min</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold text-ink">J14 · toward Paoay</p>
                <p className="font-mono text-[11px] font-medium text-muted">1.2 km away</p>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-70">
              <div className="flex h-10 w-14 flex-none items-center justify-center rounded-xl bg-sunken text-[17px] font-black text-ink italic">
                11
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-ink">J07 · toward Paoay</p>
                <p className="font-mono text-[11px] font-medium text-muted">4.8 km away</p>
              </div>
            </div>
            <div className="flex gap-1 rounded-full bg-sunken p-1">
              {tabs.map((tab, i) => (
                <span
                  key={tab}
                  className={`flex h-[34px] flex-1 items-center justify-center rounded-full text-[11px] ${
                    i === 0 ? "bg-ink font-bold text-white" : "font-semibold text-muted"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

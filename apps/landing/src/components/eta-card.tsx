"use client";

import { useEffect, useState } from "react";
import { LiveDot } from "@/components/ui";

const countdown = [
  { min: "4", km: "1.2 km" },
  { min: "3", km: "0.9 km" },
  { min: "2", km: "0.6 km" },
  { min: "1", km: "0.3 km" },
];

/** Commuter ETA card that counts the jeep down to the stop every few seconds. */
export function EtaCard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % countdown.length), 3000);
    return () => clearInterval(id);
  }, []);

  const { min, km } = countdown[tick];

  return (
    <div className="flex w-full max-w-[280px] items-center gap-3 rounded-[20px] bg-white p-3.5 shadow-md">
      <div className="flex size-[54px] flex-none flex-col items-center justify-center rounded-2xl bg-accent text-ink">
        <span className="text-[22px] leading-none font-black italic">{min}</span>
        <span className="text-[9px] font-bold">min</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-ink">J14 to Batac City Plaza</p>
        <p className="font-mono text-[11px] font-medium text-muted">{km} away</p>
        <p className="mt-1.5 flex items-center gap-[7px] text-[10px] font-extrabold tracking-[.08em] text-primary uppercase">
          <LiveDot />
          Live
        </p>
      </div>
    </div>
  );
}

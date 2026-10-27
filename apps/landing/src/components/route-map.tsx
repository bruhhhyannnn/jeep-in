"use client";

import { useRef, useState } from "react";
import { JeepLayer, type JeepMapConfig } from "@/components/jeep-layer";

const routeMap: JeepMapConfig = {
  width: 1000,
  scale: 1,
  yourStop: { name: "Batac City Plaza", x: 520, y: 210 },
  range: [0, 1],
  speed: 45,
  tripMin: 52,
  tripKm: 21.6,
  popFlip: 130,
  stops: [
    { name: "Laoag terminal", x: 80, y: 70, terminal: "start" },
    { name: "San Nicolas", x: 230, y: 120 },
    { name: "Batac City Plaza", x: 520, y: 210 },
    { name: "MMSU main gate", x: 610, y: 252 },
    { name: "Batac – Paoay junction", x: 720, y: 300 },
    { name: "Paoay Church", x: 910, y: 372, terminal: "end" },
  ],
  start: { J07: [0.1, 1], J14: [0.3, 1], J22: [0.72, -1] },
  hint: "J14",
};

const labels = [
  { x: 96, y: 46, text: "Laoag terminal" },
  { x: 236, y: 92, text: "San Nicolas" },
  { x: 640, y: 230, text: "MMSU main gate" },
  { x: 706, y: 340, text: "Batac – Paoay junction", end: true },
  { x: 892, y: 410, text: "Paoay Church", end: true },
];

/** The whole Laoag – Batac – Paoay route with jeeps you can tap for an ETA. */
export function RouteMap() {
  const route = useRef<SVGPathElement>(null);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div onClick={() => setSelected(null)} className="overflow-x-auto overflow-y-hidden rounded-[28px] bg-map">
      <svg
        viewBox="0 0 1000 440"
        className="block h-auto w-full min-w-[720px]"
        aria-label="Map of the Laoag – Batac – Paoay route with live jeeps"
      >
        <path
          d="M-10 110 H1010M-10 250 H1010M-10 380 H1010M180 -10 V450M420 -10 V450M650 -10 V450M860 -10 V450"
          className="fill-none stroke-map-street"
          strokeWidth={14}
        />
        <path
          d="M-10 330 C200 320 420 300 640 170 C760 100 880 70 1010 60"
          className="fill-none stroke-mist"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          ref={route}
          d="M80 70 C150 80 190 105 230 120 S440 190 520 210 S580 238 610 252 S690 285 720 300 S850 360 910 372"
          className="fill-none stroke-ink"
          strokeWidth={6}
          strokeLinecap="round"
        />
        <path
          d="M470 272 H520 V222"
          className="fill-none stroke-primary"
          strokeWidth={5}
          strokeDasharray="0 9"
          strokeLinecap="round"
        />
        <g className="fill-white stroke-ink" strokeWidth={4}>
          {routeMap.stops
            .filter((stop) => stop.name !== routeMap.yourStop.name)
            .map((stop) => (
              <circle key={stop.name} cx={stop.x} cy={stop.y} r={9} />
            ))}
        </g>
        <circle cx={520} cy={210} r={21} className="fill-ink" fillOpacity={0.16} />
        <circle cx={520} cy={210} r={12} className="fill-ink stroke-white" strokeWidth={3.5} />
        <circle cx={520} cy={210} r={4} className="fill-white" />
        <g
          fontSize={15}
          fontWeight={700}
          className="fill-slate-700 stroke-map"
          strokeWidth={5}
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          {labels.map((label) => (
            <text key={label.text} x={label.x} y={label.y} textAnchor={label.end ? "end" : undefined}>
              {label.text}
            </text>
          ))}
        </g>
        <g transform="translate(446 132)">
          <rect width={148} height={48} rx={13} className="fill-white stroke-ink" strokeWidth={2.5} />
          <path d="M66 47 L74 57 L82 47" className="fill-white stroke-ink" strokeWidth={2.5} strokeLinejoin="round" />
          <rect x={64} y={44} width={20} height={4} className="fill-white" />
          <text x={14} y={19} fontSize={10} fontWeight={800} letterSpacing={1} className="fill-ink">
            YOUR STOP
          </text>
          <text x={14} y={37} fontSize={14} fontWeight={800} className="fill-ink">
            Batac City Plaza
          </text>
        </g>
        <circle cx={462} cy={272} r={30} className="fill-primary" fillOpacity={0.16} />
        <circle cx={462} cy={272} r={11} className="fill-primary stroke-white" strokeWidth={4} />
        <JeepLayer config={routeMap} route={route} selected={selected} onSelect={setSelected} />
      </svg>
    </div>
  );
}

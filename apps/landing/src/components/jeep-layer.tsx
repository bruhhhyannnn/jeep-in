"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { pilot } from "@/lib/site";

export type MapStop = { name: string; x: number; y: number; terminal?: "start" | "end" };

export type JeepMapConfig = {
  /** viewBox width, so the ETA card stays inside the map */
  width: number;
  /** marker size relative to the full route map */
  scale: number;
  /** the commuter's stop that ETAs are measured to */
  yourStop: MapStop;
  /** part of the route path (0–1) the jeeps drive back and forth on */
  range: [number, number];
  /** seconds to drive the whole path */
  speed: number;
  /** minutes and km for the whole path, for the ETA card */
  tripMin: number;
  tripKm: number;
  /** jeeps below this y open their ETA card above them */
  popFlip: number;
  stops: MapStop[];
  /** unit → [starting position along the path, direction] */
  start: Record<string, [number, 1 | -1]>;
  /** unit that shows "Tap me" until a jeep is tapped */
  hint: string;
};

type Unit = { p: number; d: 1 | -1; wait: number; at: string | null; atEnd: boolean; x: number; y: number };

type Sim = {
  length: number;
  /** position of the commuter's stop along the path */
  yours: number;
  stops: { name: string; f: number; end: boolean }[];
  units: Record<string, Unit>;
};

type Nodes = {
  units: Record<string, SVGGElement | null>;
  dwell: Record<string, { g?: SVGGElement | null; rect?: SVGRectElement | null; text?: SVGTextElement | null }>;
  approach: { g?: SVGGElement | null; under?: SVGPathElement | null; over?: SVGPathElement | null };
  pop: {
    g?: SVGGElement | null;
    box?: SVGRectElement | null;
    min?: SVGTextElement | null;
    eyebrow?: SVGTextElement | null;
    main?: SVGTextElement | null;
    sub?: SVGTextElement | null;
  };
};

function createSim(cfg: JeepMapConfig, path: SVGPathElement): Sim | null {
  const length = path.getTotalLength();
  if (!length) return null;
  const nearest = (x: number, y: number) => {
    let best = Infinity;
    let f = 0;
    for (let i = 0; i <= 600; i++) {
      const q = path.getPointAtLength((length * i) / 600);
      const dist = (q.x - x) ** 2 + (q.y - y) ** 2;
      if (dist < best) {
        best = dist;
        f = i / 600;
      }
    }
    return f;
  };
  return {
    length,
    yours: nearest(cfg.yourStop.x, cfg.yourStop.y),
    stops: cfg.stops.map((s) => ({
      name: s.name,
      f: s.terminal === "start" ? 0 : s.terminal === "end" ? 1 : nearest(s.x, s.y),
      end: Boolean(s.terminal),
    })),
    units: Object.fromEntries(
      Object.entries(cfg.start).map(([u, [p, d]]) => [u, { p, d, wait: 0, at: null, atEnd: false, x: 0, y: 0 }]),
    ),
  };
}

const setText = (el: SVGTextElement | null | undefined, value: string) => {
  if (el && el.textContent !== value) el.textContent = value;
};

const textWidth = (el: SVGTextElement | null | undefined) => {
  try {
    return el ? el.getComputedTextLength() : 0;
  } catch {
    return 0;
  }
};

/** Advance the jeeps by dt seconds and write their positions and ETA card straight to the DOM. */
function step(
  cfg: JeepMapConfig,
  path: SVGPathElement,
  sim: Sim,
  nodes: Nodes,
  selected: string | null,
  dt: number,
  moving: boolean,
) {
  const [r0, r1] = cfg.range;
  for (const [u, j] of Object.entries(sim.units)) {
    if (moving) {
      if (j.wait > 0) {
        j.wait -= dt;
        if (j.wait <= 0) j.at = null;
      } else {
        const prev = j.p;
        let next = prev + (j.d * dt) / cfg.speed;
        let turned = false;
        if (next >= r1) {
          next = r1;
          j.d = -1;
          turned = true;
        } else if (next <= r0) {
          next = r0;
          j.d = 1;
          turned = true;
        }
        const hit = sim.stops.find((s) => s.f !== prev && (prev - s.f) * (next - s.f) <= 0);
        if (hit) {
          j.p = hit.f;
          j.at = hit.name;
          j.atEnd = hit.end;
          j.wait = hit.end ? 3 : 2.4;
        } else {
          j.p = next;
          if (turned) j.wait = 1;
        }
      }
    }
    const pt = path.getPointAtLength(j.p * sim.length);
    j.x = pt.x;
    j.y = pt.y;
    nodes.units[u]?.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);

    const dwell = nodes.dwell[u];
    if (dwell?.g) {
      const show = j.at !== null && selected !== u;
      dwell.g.style.display = show ? "" : "none";
      if (show && dwell.text && dwell.rect) {
        const label = `${j.atEnd ? "Turning back" : "Picking up"} · ${j.at}`;
        setText(dwell.text, label);
        const w = (textWidth(dwell.text) || 96) + 24;
        dwell.rect.setAttribute("width", String(w));
        dwell.rect.setAttribute("x", String(-w / 2));
      }
    }
  }

  const j = selected ? sim.units[selected] : undefined;
  const { pop, approach } = nodes;
  if (!selected || !j || !pop.g) return;

  const { yours } = sim;
  const toward = j.d > 0 ? "TOWARD PAOAY" : "TOWARD LAOAG";
  const coming = (j.d > 0 && j.p < yours) || (j.d < 0 && j.p > yours);
  const frac = Math.abs(yours - j.p);
  let min: number;
  let main: string;
  let sub: string;
  let showApproach = false;

  if (j.at === cfg.yourStop.name) {
    min = 0;
    main = "At your stop now";
    sub = "Board before it leaves";
  } else if (coming) {
    const lo = Math.min(j.p, yours);
    const hi = Math.max(j.p, yours);
    const between = sim.stops.filter((s) => s.f > lo + 1e-4 && s.f < hi - 1e-4).length;
    min = Math.max(1, Math.round(frac * cfg.tripMin + between + (j.at ? 1 : 0)));
    main = `to ${cfg.yourStop.name}`;
    sub = `${(frac * cfg.tripKm).toFixed(1)} km · ${
      between === 0 ? "your stop is next" : `${between} ${between > 1 ? "stops" : "stop"} first`
    }`;
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const q = path.getPointAtLength((j.p + ((yours - j.p) * i) / 40) * sim.length);
      pts.push(`${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
    }
    const d = `M${pts.join(" L")}`;
    approach.under?.setAttribute("d", d);
    approach.over?.setAttribute("d", d);
    showApproach = true;
  } else {
    const back = j.d > 0 ? 1 - j.p + (1 - yours) : j.p + yours;
    min = Math.max(1, Math.round(back * cfg.tripMin + 4));
    main = "Passed your stop";
    sub = "Returns after the terminal";
  }

  if (approach.g) approach.g.style.display = showApproach ? "" : "none";
  setText(pop.min, String(min));
  setText(pop.eyebrow, j.at ? `${selected} · STOPPED AT ${j.at.toUpperCase()}` : `${selected} · ${toward}`);
  setText(pop.main, main);
  setText(pop.sub, sub);

  const w = Math.max(180, Math.ceil(74 + Math.max(textWidth(pop.eyebrow), textWidth(pop.main), textWidth(pop.sub)) + 16));
  pop.box?.setAttribute("width", String(w));
  const s = cfg.scale;
  const sw = w * s;
  const sh = 74 * s;
  const px = Math.max(6, Math.min(cfg.width - sw - 6, j.x - sw / 2));
  const py = j.y > cfg.popFlip ? j.y - sh - 42 * s : j.y + 40 * s;
  pop.g.setAttribute("transform", `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${s})`);
}

/**
 * Jeeps that drive along `route`, stop to pick up, and show an ETA card when tapped.
 * Render inside the map's <svg>, after the route path and stops.
 */
export function JeepLayer({
  config: cfg,
  route,
  selected,
  onSelect,
}: {
  config: JeepMapConfig;
  route: RefObject<SVGPathElement | null>;
  selected: string | null;
  onSelect: (unit: string | null) => void;
}) {
  const [tapped, setTapped] = useState(false);
  const nodes = useRef<Nodes>({ units: {}, dwell: {}, approach: {}, pop: {} });
  const sim = useRef<Sim | null>(null);
  const selectedRef = useRef(selected);

  const run = (dt: number, moving: boolean) => {
    const path = route.current;
    if (!path) return;
    sim.current ??= createSim(cfg, path);
    if (sim.current) step(cfg, path, sim.current, nodes.current, selectedRef.current, dt, moving);
  };
  const runRef = useRef(run);

  // Keep the loop pointed at the latest render, and place newly shown nodes before paint.
  useLayoutEffect(() => {
    selectedRef.current = selected;
    runRef.current = run;
    run(0, false);
  });

  useEffect(() => {
    const moving = pilot.animateJeeps && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    const svg = route.current?.ownerSVGElement;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (svg) io.observe(svg);

    let frame = 0;
    let last = 0;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.1, (ts - last) / 1000) : 0;
      last = ts;
      if (visible) runRef.current(dt, moving);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [route]);

  const s = cfg.scale;
  const { x: sx, y: sy } = cfg.yourStop;
  const pick = (unit: string) => {
    onSelect(selected === unit ? null : unit);
    setTapped(true);
  };

  return (
    <g>
      {selected && (
        <g ref={(el) => { nodes.current.approach.g = el; }}>
          <path
            ref={(el) => { nodes.current.approach.under = el; }}
            className="fill-none stroke-ink"
            strokeWidth={14 * s}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={(el) => { nodes.current.approach.over = el; }}
            className="fill-none stroke-accent"
            strokeWidth={7 * s}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={sx} cy={sy} r={21 * s} className="fill-ink" fillOpacity={0.16} />
          <circle cx={sx} cy={sy} r={12 * s} className="fill-ink stroke-white" strokeWidth={3.5 * s} />
          <circle cx={sx} cy={sy} r={4 * s} className="fill-white" />
        </g>
      )}

      {Object.keys(cfg.start).map((unit) => {
        const on = selected === unit;
        const size = on ? 50 : 42;
        const o = size / 2;
        const hint = !tapped && unit === cfg.hint;
        return (
          <g
            key={unit}
            ref={(el) => { nodes.current.units[unit] = el; }}
            role="button"
            tabIndex={0}
            aria-label={`Jeep ${unit}: show minutes to ${cfg.yourStop.name}`}
            aria-pressed={on}
            className="cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            onClick={(e) => {
              e.stopPropagation();
              pick(unit);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pick(unit);
              }
            }}
          >
            <g transform={`scale(${s})`}>
              {hint && (
                <>
                  <circle r={24} className="fill-none stroke-accent" strokeWidth={4}>
                    <animate attributeName="r" values="24;46" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".9;0" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                  <g transform="translate(0 -44)">
                    <rect x={-40} y={-14} width={80} height={26} rx={13} className="fill-accent" />
                    <text x={0} y={4} textAnchor="middle" fontSize={12} fontWeight={800} className="fill-ink">
                      Tap me
                    </text>
                  </g>
                </>
              )}
              {on && (
                <rect
                  x={-o - 6}
                  y={-o - 6}
                  width={size + 12}
                  height={size + 12}
                  rx={18}
                  className="fill-none stroke-white"
                  strokeWidth={4}
                />
              )}
              <rect
                x={-o}
                y={-o}
                width={size}
                height={size}
                rx={size * 0.29}
                className={`fill-accent ${on ? "stroke-ink" : "stroke-white"}`}
                strokeWidth={on ? 4 : 3.5}
              />
              <text
                y={size * 0.13}
                textAnchor="middle"
                fontSize={size * 0.28}
                fontWeight={700}
                className="pointer-events-none fill-ink font-mono"
              >
                {unit}
              </text>
              <g
                ref={(el) => { (nodes.current.dwell[unit] ??= {}).g = el; }}
                transform={`translate(0 ${o + 22})`}
                className="pointer-events-none"
                style={{ display: "none" }}
              >
                <rect
                  ref={(el) => { (nodes.current.dwell[unit] ??= {}).rect = el; }}
                  x={-60}
                  y={-13}
                  width={120}
                  height={26}
                  rx={13}
                  className="fill-ink stroke-white"
                  strokeWidth={2}
                />
                <text
                  ref={(el) => { (nodes.current.dwell[unit] ??= {}).text = el; }}
                  y={4.5}
                  textAnchor="middle"
                  fontSize={11.5}
                  fontWeight={800}
                  className="fill-white"
                />
              </g>
            </g>
          </g>
        );
      })}

      {selected && (
        <g ref={(el) => { nodes.current.pop.g = el; }} className="pointer-events-none">
          <rect
            ref={(el) => { nodes.current.pop.box = el; }}
            width={214}
            height={74}
            rx={16}
            className="fill-white stroke-ink"
            strokeWidth={2.5}
          />
          <rect x={12} y={12} width={50} height={50} rx={12} className="fill-accent" />
          <text
            ref={(el) => { nodes.current.pop.min = el; }}
            x={37}
            y={42}
            textAnchor="middle"
            fontSize={22}
            fontWeight={900}
            fontStyle="italic"
            className="fill-ink"
          />
          <text x={37} y={55} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-ink">
            min
          </text>
          <text
            ref={(el) => { nodes.current.pop.eyebrow = el; }}
            x={74}
            y={28}
            fontSize={9.5}
            fontWeight={800}
            letterSpacing={1}
            className="fill-subtle"
          />
          <text
            ref={(el) => { nodes.current.pop.main = el; }}
            x={74}
            y={46}
            fontSize={14}
            fontWeight={800}
            className="fill-ink"
          />
          <text
            ref={(el) => { nodes.current.pop.sub = el; }}
            x={74}
            y={62}
            fontSize={11}
            fontWeight={600}
            className="fill-muted font-mono"
          />
        </g>
      )}
    </g>
  );
}

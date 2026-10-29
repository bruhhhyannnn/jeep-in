import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Ref,
} from "react";
import { cn } from "../lib/utils";
import { layout, useTheme } from "../theme";
import type { SheetRef } from "../types";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

type SheetProps = {
  snapPoints: (string | number)[];
  index?: number;
  /** Space kept free below the sheet, e.g. for the tab bar. */
  bottomInset?: number;
  /** page: list sheets with white cards inside · card: detail sheets */
  surface?: "page" | "card";
  scrollable?: boolean;
  /** Pinned to the bottom of the sheet, above the content. */
  footer?: React.ReactNode;
  /** Hairline between the content and the footer. */
  footerDivider?: boolean;
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  onChange?: (index: number) => void;
  children: React.ReactNode;
  ref?: Ref<SheetRef>;
};

const SETTLE_MS = 280;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Release speed (px/ms) that counts as a flick to the next snap point. */
const FLICK = 0.4;

const toPx = (point: string | number, height: number) =>
  Math.max(0, Math.round(typeof point === "number" ? point : (parseFloat(point) / 100) * height));

/**
 * Bottom sheet that leaves the top of the map visible, like @gorhom/bottom-sheet
 * in the native app. Not modal: the map stays pannable around it. Dragging the
 * content up expands the sheet first; the list scrolls once it's fully open.
 * On tablets and wider it's a centred column.
 */
export default function Sheet({
  snapPoints,
  index = 0,
  bottomInset = 0,
  surface = "card",
  scrollable = true,
  footer,
  footerDivider = true,
  enablePanDownToClose = false,
  onClose,
  onChange,
  children,
  ref,
}: SheetProps) {
  const { colors, shadows } = useTheme();
  const { width, height } = useWindowDimensions();
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const snaps = snapPoints.map((p) => toPx(p, height));
  const max = Math.max(0, ...snaps);
  const closedOffset = max + bottomInset + 48;
  const snapsKey = snaps.join(",");

  // Latest values for the native event listeners and timers below.
  const live = useRef({
    snaps,
    max,
    closedOffset,
    initialIndex: index,
    bottomInset,
    footerHeight,
    enablePanDownToClose,
    onChange,
    onClose,
  });
  useLayoutEffect(() => {
    live.current = {
      snaps,
      max,
      closedOffset,
      initialIndex: index,
      bottomInset,
      footerHeight,
      enablePanDownToClose,
      onChange,
      onClose,
    };
  });

  const indexRef = useRef(index);
  const offsetRef = useRef(closedOffset);
  const settleTimer = useRef<number | undefined>(undefined);

  /** Moves the sheet down by `offset` px from fully open; `ms` 0 follows the finger. */
  const apply = useCallback((offset: number, ms: number) => {
    offsetRef.current = offset;
    const el = sheetRef.current;
    if (!el) return;
    el.style.setProperty("--sheet-ms", `${ms}ms`);
    el.style.setProperty("--offset", `${offset}px`);
  }, []);

  const snapTo = useCallback(
    (i: number) => {
      const { snaps, max } = live.current;
      const target = Math.min(Math.max(i, 0), snaps.length - 1);
      indexRef.current = target;
      apply(max - snaps[target], SETTLE_MS);
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => live.current.onChange?.(target), SETTLE_MS);
    },
    [apply],
  );

  const close = useCallback(() => {
    indexRef.current = -1;
    apply(live.current.closedOffset, SETTLE_MS);
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => live.current.onClose?.(), SETTLE_MS);
  }, [apply]);

  useImperativeHandle(
    ref,
    () => ({
      expand: () => snapTo(live.current.snaps.length - 1),
      collapse: () => snapTo(live.current.initialIndex),
      snapToIndex: snapTo,
    }),
    [snapTo],
  );

  // Slide up on mount, then follow snap point changes (e.g. the Following card).
  const mounted = useRef(false);
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      apply(live.current.closedOffset, 0);
      let raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => snapTo(indexRef.current));
      });
      return () => cancelAnimationFrame(raf);
    }
    if (indexRef.current >= 0) snapTo(indexRef.current);
  }, [snapsKey, apply, snapTo]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) {
      setFooterHeight(0);
      return;
    }
    const observer = new ResizeObserver(() => setFooterHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [footer]);

  // Dragging, shared by the handle (pointer) and the content (touch).
  const drag = useRef<{
    startY: number;
    startOffset: number;
    lastY: number;
    lastT: number;
    velocity: number;
    moved: boolean;
  } | null>(null);

  const dragStart = useCallback((y: number) => {
    drag.current = {
      startY: y,
      startOffset: offsetRef.current,
      lastY: y,
      lastT: performance.now(),
      velocity: 0,
      moved: false,
    };
  }, []);

  const dragMove = useCallback(
    (y: number) => {
      const d = drag.current;
      if (!d) return;
      const { snaps, max, closedOffset, enablePanDownToClose } = live.current;
      const lowest = enablePanDownToClose ? closedOffset : max - snaps[0];
      let next = d.startOffset + (y - d.startY);
      // Resist past the top and bottom snap points.
      if (next < 0) next *= 0.3;
      if (next > lowest) next = lowest + (next - lowest) * 0.3;

      const now = performance.now();
      const dt = now - d.lastT;
      if (dt > 0) d.velocity = 0.8 * ((y - d.lastY) / dt) + 0.2 * d.velocity;
      d.lastY = y;
      d.lastT = now;
      if (Math.abs(y - d.startY) > 4) d.moved = true;
      apply(next, 0);
    },
    [apply],
  );

  const dragEnd = useCallback(() => {
    const d = drag.current;
    drag.current = null;
    if (!d) return false;
    const { snaps, max, enablePanDownToClose } = live.current;
    const offsets = snaps.map((s) => max - s);
    const current = offsetRef.current;

    if (d.velocity > FLICK) {
      // Flicked down: the next snap point below, or close.
      let target = -1;
      offsets.forEach((o, i) => {
        if (o > current + 1) target = i;
      });
      if (target >= 0) snapTo(target);
      else if (enablePanDownToClose) close();
      else snapTo(0);
    } else if (d.velocity < -FLICK) {
      // Flicked up: the next snap point above.
      const target = offsets.findIndex((o) => o < current - 1);
      snapTo(target >= 0 ? target : snaps.length - 1);
    } else {
      let best = 0;
      offsets.forEach((o, i) => {
        if (Math.abs(o - current) < Math.abs(offsets[best] - current)) best = i;
      });
      const closeDistance = Math.abs(live.current.closedOffset - current);
      if (enablePanDownToClose && closeDistance < Math.abs(offsets[best] - current)) close();
      else snapTo(best);
    }
    return d.moved;
  }, [snapTo, close]);

  // Touch on the content: decide on the first move whether it drags the sheet or scrolls.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let startY = 0;
    let mode: "none" | "sheet" | "scroll" = "none";

    const onStart = (e: TouchEvent) => {
      mode = e.touches.length === 1 ? "none" : "scroll";
      startY = e.touches[0]?.clientY ?? 0;
    };
    const onMove = (e: TouchEvent) => {
      if (mode === "scroll") return;
      const y = e.touches[0].clientY;
      const dy = y - startY;
      if (mode === "none") {
        if (dy === 0) return;
        const last = live.current.snaps.length - 1;
        const expanded = indexRef.current >= last;
        const atTop = !scrollable || el.scrollTop <= 0;
        const canLower = indexRef.current > 0 || live.current.enablePanDownToClose;
        if (!scrollable || (dy < 0 && !expanded) || (dy > 0 && atTop && canLower)) {
          mode = "sheet";
          dragStart(startY);
        } else {
          mode = "scroll";
          return;
        }
      }
      if (e.cancelable) e.preventDefault();
      dragMove(y);
    };
    const onEnd = () => {
      if (mode === "sheet") dragEnd();
      mode = "none";
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("touchcancel", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onEnd);
    };
  }, [scrollable, dragStart, dragMove, dragEnd]);

  // Mouse wheel: scrolling down on a sheet that isn't fully open opens it a step first.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    let lockedUntil = 0;
    const onWheel = (e: WheelEvent) => {
      const last = live.current.snaps.length - 1;
      if (indexRef.current >= last || e.deltaY <= 0) return;
      e.preventDefault();
      if (performance.now() < lockedUntil) return;
      lockedUntil = performance.now() + SETTLE_MS + 120;
      snapTo(indexRef.current + 1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [snapTo]);

  // Keyboard focus that lands below the visible part of the sheet opens it fully.
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (footerRef.current?.contains(target)) return;
      const { snaps, bottomInset, footerHeight } = live.current;
      if (indexRef.current >= snaps.length - 1) return;
      const visibleBottom = window.innerHeight - bottomInset - footerHeight;
      if (target.getBoundingClientRect().bottom > visibleBottom) snapTo(snaps.length - 1);
    };
    el.addEventListener("focusin", onFocusIn);
    return () => el.removeEventListener("focusin", onFocusIn);
  }, [snapTo]);

  const background = surface === "page" ? colors.page : colors.card;
  const side = Math.max(0, (width - layout.contentMaxWidth) / 2);
  const contentStyle: CSSProperties = {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 24 + footerHeight,
  };

  return (
    <div
      ref={sheetRef}
      className="view rounded-t-sheet absolute overflow-hidden"
      style={{
        ...shadows.lg,
        left: side,
        right: side,
        bottom: bottomInset,
        height: max,
        backgroundColor: background,
        transform: "translate3d(0, var(--offset, 100vh), 0)",
        transition: `transform var(--sheet-ms, 0ms) ${EASING}`,
      }}
    >
      <button
        type="button"
        aria-label="Bottom Sheet handle"
        aria-description="Drag up or down to extend or minimize the Bottom Sheet"
        className="view h-6 w-full shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragStart(e.clientY);
        }}
        onPointerMove={(e) => dragMove(e.clientY)}
        onPointerUp={() => {
          // A tap (or Enter / Space) steps between the snap points.
          if (dragEnd()) return;
          const last = live.current.snaps.length - 1;
          snapTo(indexRef.current >= last ? live.current.initialIndex : indexRef.current + 1);
        }}
        onPointerCancel={() => dragEnd()}
        onKeyDown={(e) => {
          const last = live.current.snaps.length - 1;
          if (e.key === "ArrowUp") snapTo(indexRef.current + 1);
          else if (e.key === "ArrowDown") snapTo(Math.max(0, indexRef.current - 1));
          else if (e.key === "Enter" || e.key === " ")
            snapTo(indexRef.current >= last ? live.current.initialIndex : indexRef.current + 1);
          else return;
          e.preventDefault();
        }}
      >
        <span
          className="block h-1 w-10 rounded-full"
          style={{ backgroundColor: colors.lineStrong }}
        />
      </button>

      <div
        ref={contentRef}
        className={cn(
          "view flex-1",
          scrollable && "no-scrollbar overflow-y-auto overscroll-contain",
        )}
        style={contentStyle}
      >
        {children}
      </div>

      {footer && (
        <div
          ref={footerRef}
          className={cn(
            "view absolute left-0 right-0 z-10",
            footerDivider ? "border-line border-t px-5 pb-4 pt-3" : "px-4 pb-3 pt-1",
          )}
          style={{
            bottom: "var(--offset, 0px)",
            transition: `bottom var(--sheet-ms, 0ms) ${EASING}`,
            backgroundColor: background,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

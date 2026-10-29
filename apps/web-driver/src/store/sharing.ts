import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@jeep-in/web-ui/storage";
import type { Jeepney, LngLat } from "@/types";

export type SharingPhase = "off" | "starting" | "on" | "blocked";
export type HandshakeStep = "permission" | "fix" | "write" | "readback";
export type StepState = "waiting" | "active" | "done";
export type BlockedReason = "permission" | "services";

export const HANDSHAKE_STEPS: HandshakeStep[] = ["permission", "fix", "write", "readback"];

const freshSteps = (): Record<HandshakeStep, StepState> => ({
  permission: "active",
  fix: "waiting",
  write: "waiting",
  readback: "waiting",
});

/**
 * Location sharing as the driver sees it. Turning sharing on does not claim
 * success: each handshake step is confirmed by something observable, and only
 * the read-back of the driver's own record flips the dial to ON.
 */
interface SharingState {
  phase: SharingPhase;
  steps: Record<HandshakeStep, StepState>;
  blockedReason: BlockedReason | null;
  /** True when location only flows while the app is on screen: always, in a browser. */
  foregroundOnly: boolean;

  position: LngLat | null;
  /** Metres per second. */
  speed: number | null;
  /** Speed has stayed near zero since this time. */
  stillSince: number | null;
  moving: boolean;

  /** Last position the server acknowledged. */
  lastAckAt: number | null;
  lastAckPosition: LngLat | null;
  /** Last time the driver's own record came back from the server while sharing. */
  confirmedAt: number | null;

  /** Set when sharing stopped by itself at the end of the shift. */
  stoppedByShiftEndAt: number | null;
  overtimeUntil: number | null;
}

export const useSharingStore = create<SharingState>(() => ({
  phase: "off",
  steps: freshSteps(),
  blockedReason: null,
  foregroundOnly: false,
  position: null,
  speed: null,
  stillSince: null,
  moving: false,
  lastAckAt: null,
  lastAckPosition: null,
  confirmedAt: null,
  stoppedByShiftEndAt: null,
  overtimeUntil: null,
}));

export const resetHandshake = () =>
  useSharingStore.setState({ phase: "starting", steps: freshSteps(), blockedReason: null });

export const markStep = (step: HandshakeStep) =>
  useSharingStore.setState((s) => {
    if (s.steps[step] === "done") return s;
    const steps = { ...s.steps, [step]: "done" as StepState };
    const next = HANDSHAKE_STEPS[HANDSHAKE_STEPS.indexOf(step) + 1];
    if (next && steps[next] === "waiting") steps[next] = "active";
    return { steps };
  });

/** Above this the jeep counts as moving (m/s, about 7 km/h). */
const MOVING_SPEED = 2;
/** Below this, for STILL_FOR_MS, the jeep counts as stopped. */
const STILL_SPEED = 0.8;
const STILL_FOR_MS = 5000;

/** Updates motion from a GPS fix. Report and Direction unlock once speed stays near zero. */
export function recordMotion(position: LngLat, speed: number | null) {
  const now = Date.now();
  useSharingStore.setState((s) => {
    const v = speed != null && speed >= 0 ? speed : null;
    if (v != null && v > MOVING_SPEED) {
      return { position, speed: v, moving: true, stillSince: null };
    }
    const stillSince = v == null || v < STILL_SPEED ? (s.stillSince ?? now) : null;
    const moving = s.moving && (stillSince == null || now - stillSince < STILL_FOR_MS);
    return { position, speed: v, stillSince, moving };
  });
}

/** The assigned unit and the driver's chosen direction. */
interface DriverSessionState {
  jeepney: Jeepney | null;
  /** False until the first assignment snapshot arrives. */
  jeepneyLoaded: boolean;
  directionId: string | null;
  /** "Not yet, I'm resting here": hidden from commuter lists until the jeep leaves the terminal. */
  resting: boolean;

  setDirection: (directionId: string | null) => void;
  setResting: (resting: boolean) => void;
}

export const useDriverSession = create<DriverSessionState>()(
  persist(
    (set) => ({
      jeepney: null,
      jeepneyLoaded: false,
      directionId: null,
      resting: false,
      setDirection: (directionId) => set({ directionId, resting: false }),
      setResting: (resting) => set({ resting }),
    }),
    {
      name: "jeepin-driver-session",
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ directionId, resting }) => ({ directionId, resting }),
    },
  ),
);

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeStorage } from "@/lib/storage";
import { colorScheme, setTextScale } from "@/theme/document";
import type { Appearance, TextSize, TripField } from "@/types";

interface PreferencesState {
  hydrated: boolean;
  onboarded: boolean;
  /** The direction the commuter picked. Never guessed from location. */
  directionId: string | null;
  /** Use the phone's location for the nearest stop and distances. */
  useMyLocation: boolean;
  /** Stop the commuter chose to board at. Null → the nearest stop is suggested. */
  boardingStopId: string | null;
  alightingStopId: string | null;
  /** Which trip field the next tapped stop fills. */
  fillingField: TripField;
  /** Student / senior / PWD fare. */
  discount: boolean;
  appearance: Appearance;
  textSize: TextSize;
  /** Send a phone notification when a followed jeep is close. */
  arrivalAlerts: boolean;

  completeOnboarding: () => void;
  setDirection: (directionId: string) => void;
  setUseMyLocation: (value: boolean) => void;
  setBoardingStop: (stopId: string | null) => void;
  setAlightingStop: (stopId: string | null) => void;
  setFillingField: (field: TripField) => void;
  setDiscount: (value: boolean) => void;
  setAppearance: (appearance: Appearance) => void;
  setTextSize: (size: TextSize) => void;
  setArrivalAlerts: (value: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      hydrated: false,
      onboarded: false,
      directionId: null,
      useMyLocation: true,
      boardingStopId: null,
      alightingStopId: null,
      fillingField: "alighting",
      discount: false,
      appearance: "system",
      textSize: "default",
      arrivalAlerts: true,

      completeOnboarding: () => set({ onboarded: true }),
      setDirection: (directionId) => set({ directionId }),
      setUseMyLocation: (useMyLocation) => set({ useMyLocation }),
      setBoardingStop: (boardingStopId) => set({ boardingStopId, fillingField: "alighting" }),
      setAlightingStop: (alightingStopId) => set({ alightingStopId }),
      setFillingField: (fillingField) => set({ fillingField }),
      setDiscount: (discount) => set({ discount }),
      setAppearance: (appearance) => {
        colorScheme.set(appearance);
        set({ appearance });
      },
      setTextSize: (textSize) => {
        setTextScale(textSize);
        set({ textSize });
      },
      setArrivalAlerts: (arrivalAlerts) => set({ arrivalAlerts }),
    }),
    {
      name: "jeepin-preferences",
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ hydrated: _hydrated, ...state }) => state,
      onRehydrateStorage: () => (state) => {
        colorScheme.set(state?.appearance ?? "system");
        setTextScale(state?.textSize ?? "default");
        // localStorage hydrates while the store is being created, before `usePreferences` exists.
        queueMicrotask(() => usePreferences.setState({ hydrated: true }));
      },
    },
  ),
);

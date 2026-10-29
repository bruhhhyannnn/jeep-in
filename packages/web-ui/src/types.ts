export type BottomSheetModalBaseRef = {
  open: () => void;
  close: () => void;
};

export type SheetRef = {
  expand: () => void;
  collapse: () => void;
  snapToIndex: (index: number) => void;
};

/** "system" is shown as "Match phone". */
export type Appearance = "light" | "dark" | "system";

export type TextSize = "default" | "large" | "largest";

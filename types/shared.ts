export type BottomSheetModalBaseRef = {
  open: () => void;
  close: () => void;
};

export type BottomSheetContainerRef = {
  expand: () => void;
  collapse: () => void;
};

export type ThemeMode = "light" | "dark" | "system";

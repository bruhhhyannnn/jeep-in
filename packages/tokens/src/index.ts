// The JEEP-IN hi-fi design tokens, shared by the commuter apps (Expo and web).
//
// The Tailwind preset (tailwind-preset.cjs) and the CSS variables in each app's
// app/global.css are generated from this file: run `npm run tokens` after editing it.
// Use the JS values directly only where a className can't reach: Mapbox layers,
// native props, inline styles, icon colours.

export type TextSize = "default" | "large" | "largest";

const light = {
  page: "#eef4fb",
  card: "#ffffff",
  sunken: "#edf1f7",
  inverse: "#11305a",
  inverseRaised: "#173d70",
  line: "#dde4ee",
  lineStrong: "#c6cfdb",
  ink: "#0b1b33",
  muted: "#4d5d74",
  faint: "#98a4b5",
  action: "#1670e0",
  actionInk: "#ffffff",
  actionTint: "#e6f1ff",
  accent: "#ffc62e",
  accentInk: "#0b1b33",
  live: "#12b886",
  liveTint: "#e3f8f0",
  liveInk: "#0b7a58",
  danger: "#ef4b5f",
  dangerTint: "#ffe9ec",
  dangerInk: "#b3263a",
  warnTint: "#fff8e1",
  warnInk: "#4a3a06",
  onInverse: "#ffffff",
  onInverseMuted: "#b9cbe6",
  backdrop: "rgba(11, 27, 51, 0.32)",
  mapRoute: "#0b1b33",
  mapStopFill: "#ffffff",
  mapStopRing: "#173d70",
  mapLabelHalo: "#ffffff",
};

const dark: typeof light = {
  page: "#0b1628",
  card: "#16263f",
  sunken: "#1c2d48",
  inverse: "#173d70",
  inverseRaised: "#1f4c86",
  line: "#26395a",
  lineStrong: "#30476b",
  ink: "#eef3fa",
  muted: "#93a3bb",
  faint: "#5f7290",
  action: "#5aa3ff",
  actionInk: "#0b1b33",
  actionTint: "#17345c",
  accent: "#ffc62e",
  accentInk: "#0b1b33",
  live: "#12b886",
  liveTint: "#123a33",
  liveInk: "#3fd0a0",
  danger: "#ef4b5f",
  dangerTint: "#3d1a24",
  dangerInk: "#ff8f9c",
  warnTint: "#3a300f",
  warnInk: "#ffd45c",
  onInverse: "#ffffff",
  onInverseMuted: "#b9cbe6",
  backdrop: "rgba(0, 0, 0, 0.45)",
  mapRoute: "#c9d6ea",
  mapStopFill: "#16263f",
  mapStopRing: "#b9cbe6",
  mapLabelHalo: "#0b1628",
};

export const palette = { light, dark };
export type Palette = typeof light;

/**
 * The colours that switch with the Appearance setting through CSS variables, so
 * they're Tailwind classes too (`bg-page`, `text-live-ink`). The rest of the
 * palette is JS only.
 */
export const themeColorKeys = [
  "page",
  "card",
  "sunken",
  "inverse",
  "inverseRaised",
  "line",
  "lineStrong",
  "ink",
  "muted",
  "faint",
  "action",
  "actionInk",
  "actionTint",
  "accent",
  "accentInk",
  "live",
  "liveTint",
  "liveInk",
  "danger",
  "dangerTint",
  "dangerInk",
  "warnTint",
  "warnInk",
] as const satisfies readonly (keyof Palette)[];

/** Fixed ramps, for colours that must not change between themes (jeep markers, inverse cards). */
export const ramps = {
  navy: {
    50: "#eaf0f8",
    200: "#b9cbe6",
    300: "#9fb8dc",
    400: "#5f7fae",
    500: "#2f5a93",
    600: "#1f4c86",
    800: "#173d70",
    900: "#11305a",
    950: "#0b1b33",
  },
  blue: {
    100: "#dbe9ff",
    200: "#cfe2ff",
    400: "#5a9ef2",
    600: "#1670e0",
  },
  yellow: {
    50: "#fff8e1",
    100: "#ffefb8",
    200: "#ffdd7a",
    300: "#ffd45c",
    400: "#ffc62e",
    600: "#e0a912",
    800: "#4a3a06",
  },
};

// Navy-tinted shadows (never grey). Spread into `style` (React Native's boxShadow
// prop, or CSS); also Tailwind's shadow-sm/md/lg.
export const shadows = {
  light: {
    sm: { boxShadow: "0px 1px 3px rgba(17, 48, 90, 0.08)" },
    md: { boxShadow: "0px 10px 26px rgba(17, 48, 90, 0.10)" },
    lg: { boxShadow: "0px 18px 40px rgba(17, 48, 90, 0.22)" },
  },
  dark: {
    sm: { boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.30)" },
    md: { boxShadow: "0px 10px 26px rgba(0, 0, 0, 0.35)" },
    lg: { boxShadow: "0px 18px 40px rgba(0, 0, 0, 0.50)" },
  },
};
export type Shadows = typeof shadows.light;

export const radii = {
  tile: 16,
  card: 22,
  sheet: 28,
};

export const fonts = {
  regular: "Puffin-Regular",
  medium: "Puffin-Medium",
  semibold: "Puffin-SemiBold",
  bold: "Puffin-Bold",
  moment: "Puffin-ExtraBold-Italic",
  mono: "SplineSansMono_500Medium",
  monoBold: "SplineSansMono_600SemiBold",
};

export type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: "uppercase";
};

// Type roles from the hi-fi system. Sizes are multiplied by the Text size setting.
export const typeRoles = {
  moment: { fontFamily: fonts.moment, fontSize: 40, lineHeight: 44 },
  momentMd: { fontFamily: fonts.moment, fontSize: 30, lineHeight: 32 },
  momentSm: { fontFamily: fonts.moment, fontSize: 22, lineHeight: 24 },
  title: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 31 },
  heading: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22 },
  strong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 },
  small: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19 },
  label: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16 },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.9,
    textTransform: "uppercase",
  },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 20 },
  data: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 18 },
  dataSm: { fontFamily: fonts.mono, fontSize: 12, lineHeight: 16 },
  dataStrong: { fontFamily: fonts.monoBold, fontSize: 15, lineHeight: 20 },
} satisfies Record<string, TypeStyle>;
export type TypeRole = keyof typeof typeRoles;

export const textScale: Record<TextSize, number> = {
  default: 1,
  large: 1.15,
  largest: 1.3,
};

export const layout = {
  gutter: 20,
  tabBarHeight: 64,
  /** Widest a list column or sheet gets on a tablet. */
  contentMaxWidth: 480,
  control: 52,
  minTap: 48,
};

export type AccessibilityRole =
  | "button"
  | "header"
  | "link"
  | "tab"
  | "tablist"
  | "radio"
  | "radiogroup"
  | "switch"
  | "image"
  | "none";

export type AccessibilityState = {
  disabled?: boolean;
  checked?: boolean;
  selected?: boolean;
  expanded?: boolean;
  busy?: boolean;
};

/** React Native's accessibility props, kept so screens read as they do in the native app. */
export type AccessibilityProps = {
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: AccessibilityState;
  accessibilityLiveRegion?: "polite" | "assertive" | "none";
};

const roles: Record<AccessibilityRole, string> = {
  button: "button",
  header: "heading",
  link: "link",
  tab: "tab",
  tablist: "tablist",
  radio: "radio",
  radiogroup: "radiogroup",
  switch: "switch",
  image: "img",
  none: "presentation",
};

/** Maps the accessibility props to ARIA attributes, the way react-native-web does. */
export function aria({
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  accessibilityLiveRegion,
}: AccessibilityProps) {
  const state = accessibilityState ?? {};
  const role = accessibilityRole ? roles[accessibilityRole] : undefined;
  const checkable = role === "radio" || role === "switch";

  return {
    role,
    "aria-level": accessibilityRole === "header" ? 1 : undefined,
    "aria-label": accessibilityLabel,
    "aria-description": accessibilityHint,
    "aria-disabled": state.disabled || undefined,
    "aria-checked": checkable ? (state.checked ?? false) : undefined,
    "aria-selected": role === "tab" ? (state.selected ?? false) : undefined,
    "aria-pressed": role === "button" && state.selected != null ? state.selected : undefined,
    "aria-expanded": state.expanded,
    "aria-busy": state.busy,
    "aria-live": accessibilityLiveRegion === "none" ? "off" : accessibilityLiveRegion,
  } as const;
}

/** Splits the accessibility props off the rest. */
export function splitA11y<T extends AccessibilityProps>(props: T) {
  const {
    accessibilityRole,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    accessibilityLiveRegion,
    ...rest
  } = props;
  return {
    a11y: aria({
      accessibilityRole,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState,
      accessibilityLiveRegion,
    }),
    rest,
  };
}

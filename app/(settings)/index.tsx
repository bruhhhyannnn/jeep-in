import { useRef } from "react";
import { STRINGS } from "@/constants";
import { useSafeAreaInsets } from "@/hooks";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/store";
import { fonts, layout, palette } from "@/theme";
import type { Appearance, BottomSheetModalBaseRef, TextSize } from "@/types";
import { Pressable, RadioCard, ThemedText, ThemedView, View } from "@/components/ui";
import { ScreenHeader } from "@/components/commuter";
import { AboutJeepInModal, GetSupportModal, SettingsRow } from "@/components/settings";
import logoMmsu from "@/assets/images/logo-mmsu.png";
import logoJeepIn from "@/assets/images/logo-jeep-in.png";

const APPEARANCE: { value: Appearance; label: string; hint: string }[] = [
  {
    value: "light",
    label: STRINGS.settings.appearance.light,
    hint: STRINGS.settings.appearance.lightHint,
  },
  {
    value: "dark",
    label: STRINGS.settings.appearance.dark,
    hint: STRINGS.settings.appearance.darkHint,
  },
  {
    value: "system",
    label: STRINGS.settings.appearance.system,
    hint: STRINGS.settings.appearance.systemHint,
  },
];

const TEXT_SIZES: { value: TextSize; label: string; sample: number }[] = [
  { value: "default", label: STRINGS.settings.textSize.default, sample: 15 },
  { value: "large", label: STRINGS.settings.textSize.large, sample: 19 },
  { value: "largest", label: STRINGS.settings.textSize.largest, sample: 24 },
];

/** A tiny screen in the theme's own colours: map strip, then a card with a dot and a line. */
function ThemeThumb({ mode }: { mode: Appearance }) {
  const half = (scheme: "light" | "dark", side: "left" | "right" | null) => {
    const c = palette[scheme];
    return (
      <View
        style={{
          backgroundColor: c.page,
          borderColor: c.lineStrong,
          ...(side && { position: "absolute", top: 0, bottom: 0, width: "50%", [side]: 0 }),
        }}
        className={side ? "gap-1 p-[5px]" : "flex-1 gap-1 p-[5px]"}
      >
        <View style={{ backgroundColor: c.sunken }} className="h-[18px] rounded-[5px]" />
        <View
          style={{ backgroundColor: c.card }}
          className="flex-1 flex-row items-center gap-[3px] rounded-[5px] px-1"
        >
          <View style={{ backgroundColor: c.action }} className="h-1.5 w-1.5 rounded-full" />
          <View style={{ backgroundColor: c.lineStrong }} className="h-[3px] flex-1 rounded-full" />
        </View>
      </View>
    );
  };
  return (
    <View
      aria-hidden
      style={{ borderColor: palette[mode === "dark" ? "dark" : "light"].lineStrong }}
      className="h-[54px] w-10 overflow-hidden rounded-[9px] border-[1.5px]"
    >
      {mode === "system" ? (
        <>
          {half("light", "left")}
          {half("dark", "right")}
        </>
      ) : (
        half(mode, null)
      )}
    </View>
  );
}

/** Three tiles showing "Aa" at each size, so the choice is its own preview. */
function TextSizePicker({ value, onChange }: { value: TextSize; onChange: (v: TextSize) => void }) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={STRINGS.settings.textSize.title}
      className="flex-row gap-1 rounded-[20px] border-[1.5px] border-line bg-card p-1"
    >
      {TEXT_SIZES.map((opt) => {
        const on = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            accessibilityRole="radio"
            accessibilityLabel={opt.label}
            accessibilityState={{ checked: on }}
            className={cn(
              "h-16 flex-1 items-center justify-center gap-1 rounded-tile",
              on && "bg-action",
            )}
          >
            <span
              style={{
                fontFamily: fonts.bold,
                fontSize: opt.sample,
                lineHeight: `${opt.sample + 2}px`,
              }}
              className={on ? "text-action-ink" : "text-ink"}
            >
              Aa
            </span>
            <span
              style={{ fontFamily: on ? fonts.semibold : fonts.medium, fontSize: 12 }}
              className={on ? "text-action-ink" : "text-muted"}
            >
              {opt.label}
            </span>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Opened from the gear on the map. Everything here is saved on this phone. */
export default function SettingsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const supportRef = useRef<BottomSheetModalBaseRef>(null);
  const aboutRef = useRef<BottomSheetModalBaseRef>(null);

  const appearance = usePreferences((s) => s.appearance);
  const setAppearance = usePreferences((s) => s.setAppearance);
  const textSize = usePreferences((s) => s.textSize);
  const setTextSize = usePreferences((s) => s.setTextSize);

  const t = STRINGS.settings;

  return (
    <ThemedView className="screen-slide absolute inset-0">
      <View className="no-scrollbar flex-1 overflow-y-auto">
        <View
          style={{
            paddingTop: top + 12,
            paddingBottom: bottom + 32,
            maxWidth: layout.contentMaxWidth,
          }}
          className="w-full gap-6 self-center px-5"
        >
          <ScreenHeader title={t.title} back />

          <View className="gap-2.5">
            <ThemedText variant="eyebrow" tone="muted">
              {t.appearance.title}
            </ThemedText>
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel={t.appearance.title}
              className="gap-2.5"
            >
              {APPEARANCE.map((opt) => (
                <RadioCard
                  key={opt.value}
                  title={opt.label}
                  hint={opt.hint}
                  leading={<ThemeThumb mode={opt.value} />}
                  radioEnd
                  selected={appearance === opt.value}
                  onPress={() => setAppearance(opt.value)}
                />
              ))}
            </View>
            <ThemedText variant="small" tone="muted">
              {t.appearance.note}
            </ThemedText>
          </View>

          <View className="gap-2.5">
            <ThemedText variant="eyebrow" tone="muted">
              {t.textSize.title}
            </ThemedText>
            <TextSizePicker value={textSize} onChange={setTextSize} />
          </View>

          <View className="gap-2.5">
            <ThemedText variant="eyebrow" tone="muted">
              {t.help}
            </ThemedText>
            <SettingsRow
              label={t.getSupport.title}
              iconName="chatbubble-ellipses-outline"
              onPress={() => supportRef.current?.open()}
            />
            <SettingsRow
              label={t.about.title}
              iconName="information-circle-outline"
              onPress={() => aboutRef.current?.open()}
            />
          </View>

          <View className="flex-row items-center justify-center gap-4 pt-2">
            <img
              src={logoMmsu}
              alt="Mariano Marcos State University"
              className="h-16 w-16 object-contain"
            />
            <img
              src={logoJeepIn}
              alt={STRINGS.general.appName}
              className="h-12 w-32 object-contain"
            />
          </View>
        </View>
      </View>

      <GetSupportModal ref={supportRef} />
      <AboutJeepInModal ref={aboutRef} />
    </ThemedView>
  );
}

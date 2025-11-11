import { STRINGS } from "@/constants";
import { useThemeStore } from "@/context/useThemeStore";
import { colorScheme } from "nativewind";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ButtonRadio, ButtonText, ThemedText } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/types";
import type { ThemeMode } from "@/types";

const ThemesAvatarModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "nickname" | "appearance">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={
        view === "default"
          ? STRINGS.settings.themesAvatar.title
          : view === "nickname"
            ? STRINGS.settings.themesAvatar.nickname.title
            : STRINGS.settings.themesAvatar.appearance.title
      }
      ref={baseRef}
    >
      {view === "default" ? (
        <DefaultThemesAvatarView
          onNickname={() => setView("nickname")}
          onAppearance={() => setView("appearance")}
        />
      ) : view === "nickname" ? (
        <NicknameView onBack={() => setView("default")} />
      ) : (
        <AppearanceView onBack={() => setView("default")} />
      )}
    </BottomSheetModalBase>
  );
});

export default ThemesAvatarModal;

// Default View
function DefaultThemesAvatarView({
  onNickname,
  onAppearance,
}: {
  onNickname: () => void;
  onAppearance: () => void;
}) {
  return (
    <View className="gap-4">
      <ButtonText
        label={STRINGS.settings.themesAvatar.nickname.title}
        variant="tertiary"
        iconName="person-outline"
        showChevron
        fullWidth
        onPress={onNickname}
      />
      <ButtonText
        label={STRINGS.settings.themesAvatar.appearance.title}
        variant="tertiary"
        iconName="bulb-outline"
        showChevron
        fullWidth
        onPress={onAppearance}
      />
    </View>
  );
}

// Nickname View
function NicknameView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      <ThemedText className="text-center">{STRINGS.general.comingSoon}</ThemedText>

      {/* Cancel & Apply button */}
      <View className="flex-row items-center gap-2">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
        <View className="flex-1">
          <ButtonText
            label={STRINGS.general.apply}
            fullWidth
            onPress={() => console.log("Apply filters")}
            disabled
          />
        </View>
      </View>
    </View>
  );
}

// Appearance View
function AppearanceView({ onBack }: { onBack: () => void }) {
  const { theme, setTheme } = useThemeStore();

  const options: { label: string; value: ThemeMode }[] = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  // TODO: revalidate functionality if its really working
  const handleSelect = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    colorScheme.set(newTheme);
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <ThemedText variant="h400" className="uppercase">
          {STRINGS.settings.themesAvatar.appearance.themeOptions}
        </ThemedText>

        {options.map((opt) => (
          <ButtonRadio
            key={opt.value}
            label={opt.label}
            selected={theme === opt.value}
            onPress={() => handleSelect(opt.value)}
          />
        ))}
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

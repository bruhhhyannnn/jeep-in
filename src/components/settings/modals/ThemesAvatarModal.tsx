import { STRINGS } from "@/constants";
import { useThemeStore } from "@/store";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBaseRef } from "@/types";
import type { ThemeMode } from "@/types";
import {
  BottomSheetModalBase,
  ButtonRadio,
  ButtonText,
  CustomTextInput,
  ThemedText,
} from "@/components/ui";
import SettingsModalCard from "@/components/settings/modals/SettingsModalCard";

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
      <SettingsModalCard
        label={STRINGS.settings.themesAvatar.nickname.title}
        iconName="person-outline"
        onPress={onNickname}
      />
      <SettingsModalCard
        label={STRINGS.settings.themesAvatar.appearance.title}
        iconName="bulb-outline"
        onPress={onAppearance}
      />
    </View>
  );
}

// Nickname View
function NicknameView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      {/* TODO: */}
      <ThemedText className="text-center">{STRINGS.general.comingSoon}</ThemedText>

      {/* TODO: fix the keyboard not doing properly here */}
      {/* <View className="gap-2">
        <ThemedText variant="h400" className="uppercase" color="text_muted">
          {STRINGS.settings.themesAvatar.nickname.appNickname}
        </ThemedText>
        <CustomTextInput placeholder={nickname} iconName="person-outline" />
      </View> */}

      {/* Cancel & Apply button */}
      <View className="flex-row items-center gap-2">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
        <View className="flex-1">
          <ButtonText
            label={STRINGS.general.apply}
            fullWidth
            // TODO: add filter functionality
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

  const handleSelect = (newTheme: ThemeMode) => {
    setTheme(newTheme);
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

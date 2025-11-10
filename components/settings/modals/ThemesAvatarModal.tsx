import { useThemeStore } from "@/context/useThemeStore"; // adjust import if different
import { colorScheme } from "nativewind";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  BottomSheetModalBase,
  ButtonText,
  Icon,
  ThemedText,
  ThemedView,
} from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type ThemesAvatarModalRef = {
  open: () => void;
  close: () => void;
};

const ThemesAvatarModal = forwardRef<ThemesAvatarModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "nickname" | "appearance">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={
        view === "default" ? "Themes & Avatar" : view === "nickname" ? "Nickname" : "Appearance"
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
        label="Nickname"
        variant="tertiary"
        iconName="person-outline"
        showChevron
        fullWidth
        onPress={onNickname}
      />
      <ButtonText
        label="Appearance"
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
      <ThemedText variant="h400">Customize avatar (coming soon)</ThemedText>

      {/* Cancel & Apply button */}
      <View className="flex-row items-center gap-2">
        <ButtonText label="Cancel" variant="secondary" onPress={onBack} />
        <View className="flex-1">
          <ButtonText
            label="Apply"
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
  const { theme, setTheme } = useThemeStore(); // ✅ get from global store

  const options = [
    { label: "System", value: "system" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ] as const;

  // TODO: revalidate functionality if its really working
  const handleSelect = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);
    colorScheme.set(newTheme);
  };

  return (
    <View className="gap-4">
      <ThemedText variant="h400" className="uppercase">
        Choose a theme
      </ThemedText>

      <View className="gap-2">
        {options.map((opt) => {
          const selected = theme === opt.value;

          return (
            <TouchableOpacity
              key={opt.value}
              activeOpacity={0.7}
              onPress={() => handleSelect(opt.value)} // ✅ updates theme instantly
            >
              <ThemedView
                variant="bg_light"
                className="flex-row items-center justify-between rounded-full px-6 py-4 shadow-lg"
              >
                <ThemedText>{opt.label}</ThemedText>

                <Icon
                  family="MaterialCommunityIcons"
                  name={selected ? "radiobox-marked" : "radiobox-blank"}
                  color="#1E90FF"
                  size={22}
                />
              </ThemedView>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label="Go Back" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type ThemesAvatarModalRef = {
  open: () => void;
  close: () => void;
};

const ThemesAvatarModal = forwardRef<ThemesAvatarModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title="Themes & Avatar" ref={baseRef}>
      <View className="gap-5">
        <ThemedText variant="h400">Choose a theme</ThemedText>
        <View className="flex-row justify-between">
          <ButtonText label="Light" onPress={() => {}} />
          <ButtonText label="Dark" onPress={() => {}} />
          <ButtonText label="System" onPress={() => {}} />
        </View>

        <ThemedText variant="h400">Customize avatar (coming soon)</ThemedText>

        <ButtonText label="Close" variant="secondary" onPress={() => baseRef.current?.close()} />
      </View>
    </BottomSheetModalBase>
  );
});

export default ThemesAvatarModal;

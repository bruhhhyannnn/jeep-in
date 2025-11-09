import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, Switch } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type SettingsAccessibilityModalRef = {
  open: () => void;
  close: () => void;
};

const SettingsAccessibilityModal = forwardRef<SettingsAccessibilityModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title="Accessibility Settings" ref={baseRef}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <ThemedText>High Contrast Mode</ThemedText>
          <Switch value={highContrast} onValueChange={setHighContrast} />
        </View>
        <View className="flex-row items-center justify-between">
          <ThemedText>Large Text</ThemedText>
          <Switch value={largeText} onValueChange={setLargeText} />
        </View>

        <ButtonText label="Done" onPress={() => baseRef.current?.close()} />
      </View>
    </BottomSheetModalBase>
  );
});

export default SettingsAccessibilityModal;

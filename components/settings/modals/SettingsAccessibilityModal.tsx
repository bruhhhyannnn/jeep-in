import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, Switch } from "react-native";
import { BottomSheetModalBase, ThemedText, ThemedView } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/types";

const SettingsAccessibilityModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
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
        <ThemedText className="text-center">Coming soon… Feature under development.</ThemedText>

        {/* TODO: make this as a button someday, ButtonSwitch.tsx */}
        {/* TODO: think about the functionalities of these someday of what to do */}
        <View className="gap-2">
          <ThemedView
            variant="bg_light"
            className="flex-row items-center justify-between rounded-full px-6 shadow-lg"
          >
            <ThemedText color="secondary">High Contrast Mode</ThemedText>
            <Switch value={highContrast} disabled onValueChange={setHighContrast} />
          </ThemedView>
          <ThemedView
            variant="bg_light"
            className="flex-row items-center justify-between rounded-full px-6 shadow-lg"
          >
            <ThemedText color="secondary">Large Text</ThemedText>
            <Switch value={largeText} disabled onValueChange={setLargeText} />
          </ThemedView>
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default SettingsAccessibilityModal;

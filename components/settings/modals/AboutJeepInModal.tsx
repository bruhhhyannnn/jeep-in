import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Linking } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type AboutJeepInModalRef = {
  open: () => void;
  close: () => void;
};

const AboutJeepInModal = forwardRef<AboutJeepInModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title="About JEEP-IN" ref={baseRef}>
      <View className="gap-4">
        <ThemedText variant="h400">
          JEEP-IN is a tracking system for modern jeepneys in Ilocos Norte.
        </ThemedText>

        <ButtonText
          label="Like on Facebook"
          onPress={() => Linking.openURL("https://facebook.com/jeepin")}
        />
        <ButtonText
          label="Visit Website"
          onPress={() => Linking.openURL("https://jeepin.example.com")}
        />

        <ButtonText label="Close" variant="secondary" onPress={() => baseRef.current?.close()} />
      </View>
    </BottomSheetModalBase>
  );
});

export default AboutJeepInModal;

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type FareGuideModalRef = {
  open: () => void;
  close: () => void;
};

const FareGuideModal = forwardRef<FareGuideModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title="Fare Guide" ref={baseRef}>
      <View className="gap-4">
        <ThemedText variant="h400">Updated Jeepney Fare Rates</ThemedText>

        <View className="gap-2">
          <ThemedText>Regular — ₱14.00</ThemedText>
          <ThemedText>Student/PWD — ₱12.00</ThemedText>
          <ThemedText>Minimum Distance: 4 km</ThemedText>
        </View>

        <ButtonText label="Close" variant="secondary" onPress={() => baseRef.current?.close()} />
      </View>
    </BottomSheetModalBase>
  );
});

export default FareGuideModal;

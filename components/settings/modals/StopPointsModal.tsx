import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type StopPointsModalRef = {
  open: () => void;
  close: () => void;
};

const StopPointsModal = forwardRef<StopPointsModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title="Stop Points" ref={baseRef}>
      <View className="gap-4">
        <ThemedText variant="h400">List of available jeepney stops</ThemedText>

        <View className="gap-2">
          <ThemedText>• MMSU Gate 3</ThemedText>
          <ThemedText>• PhilRice Institute</ThemedText>
          <ThemedText>• Paoay Terminal</ThemedText>
        </View>

        <ButtonText label="Go Back" variant="secondary" onPress={() => baseRef.current?.close()} />
      </View>
    </BottomSheetModalBase>
  );
});

export default StopPointsModal;

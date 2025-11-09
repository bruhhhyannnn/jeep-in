import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { View, Linking } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/shared";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

export type GetSupportModalRef = {
  open: () => void;
  close: () => void;
};

const GetSupportModal = forwardRef<GetSupportModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title="Get Support" ref={baseRef}>
      <View className="gap-4">
        <ThemedText>Need help or want to report an issue?</ThemedText>

        <ButtonText
          label="Contact Support"
          onPress={() => Linking.openURL("mailto:jeepin.official@gmail.com")}
        />
        <ButtonText
          label="Visit Facebook Page"
          onPress={() => Linking.openURL("https://facebook.com/jeepin")}
        />

        <ButtonText label="Close" variant="secondary" onPress={() => baseRef.current?.close()} />
      </View>
    </BottomSheetModalBase>
  );
});

export default GetSupportModal;

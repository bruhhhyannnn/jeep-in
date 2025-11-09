import React, { forwardRef, useRef, useImperativeHandle, ReactNode } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import ThemedText from "@/components/shared/ThemedText";

export type BottomSheetModalBaseRef = {
  open: () => void;
  close: () => void;
};

interface BottomSheetModalBaseProps {
  title: string;
  children: ReactNode;
}

const BottomSheetModalBase = forwardRef<BottomSheetModalBaseRef, BottomSheetModalBaseProps>(
  ({ title, children }, ref) => {
    const modalRef = useRef<BottomSheetModal>(null);
    const { colorScheme } = useColorScheme();

    const contentStyle = {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 20,
    };

    useImperativeHandle(ref, () => ({
      open: () => modalRef.current?.present(),
      close: () => modalRef.current?.dismiss(),
    }));

    return (
      <BottomSheetModal
        ref={modalRef}
        enableDynamicSizing
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
        )}
        backgroundStyle={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderWidth: 1,
          backgroundColor: colorScheme === "dark" ? "#171717" : "#F5F5F5",
          borderColor: colorScheme === "dark" ? "#404040" : "#D4D4D4",
        }}
        handleIndicatorStyle={{
          backgroundColor: colorScheme === "dark" ? "#404040" : "#D4D4D4",
          width: 40,
        }}
      >
        <BottomSheetScrollView contentContainerStyle={contentStyle}>
          <ThemedText variant="h600" className="mb-2">
            {title}
          </ThemedText>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

export default BottomSheetModalBase;

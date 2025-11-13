import React, { useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import { BottomSheetContainerRef } from "@/types";

type BottomSheetContainerProps = {
  children: React.ReactNode;
  snapPoints?: string[];
  initialIndex?: number;
};

const BottomSheetContainer = forwardRef<BottomSheetContainerRef, BottomSheetContainerProps>(
  ({ children, snapPoints = ["9%", "30%", "93%"], initialIndex = 1 }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const memoSnapPoints = useMemo(() => snapPoints, [snapPoints]);
    const { colorScheme } = useColorScheme();

    useImperativeHandle(ref, () => ({
      expand: () => bottomSheetRef.current?.expand(),
      collapse: () => bottomSheetRef.current?.snapToIndex(1),
    }));

    const contentStyle = {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 20,
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={memoSnapPoints}
        index={initialIndex}
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
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  },
);

export default BottomSheetContainer;

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useTheme } from "@/theme";
import type { SheetRef } from "@/types";

type SheetProps = {
  snapPoints: (string | number)[];
  index?: number;
  /** Space kept free below the sheet, e.g. for the tab bar. */
  bottomInset?: number;
  /** page: list sheets with white cards inside · card: detail sheets */
  surface?: "page" | "card";
  scrollable?: boolean;
  /** Pinned to the bottom of the sheet, above the content. */
  footer?: React.ReactNode;
  enablePanDownToClose?: boolean;
  onClose?: () => void;
  onChange?: (index: number) => void;
  children: React.ReactNode;
};

/** Bottom sheet that leaves the top of the map visible. */
const Sheet = forwardRef<SheetRef, SheetProps>(
  (
    {
      snapPoints,
      index = 0,
      bottomInset = 0,
      surface = "card",
      scrollable = true,
      footer,
      enablePanDownToClose = false,
      onClose,
      onChange,
      children,
    },
    ref,
  ) => {
    const sheetRef = useRef<BottomSheet>(null);
    const { colors, shadows } = useTheme();
    const [footerHeight, setFooterHeight] = useState(0);

    useImperativeHandle(ref, () => ({
      expand: () => sheetRef.current?.expand(),
      collapse: () => sheetRef.current?.snapToIndex(index),
      snapToIndex: (i) => sheetRef.current?.snapToIndex(i),
    }));

    const background = surface === "page" ? colors.page : colors.card;

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => (
        <BottomSheetFooter {...props}>
          <View
            onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
            style={{ backgroundColor: background }}
            className="border-t border-line px-5 pb-4 pt-3"
          >
            {footer}
          </View>
        </BottomSheetFooter>
      ),
      [footer, background],
    );

    const contentStyle = { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 + footerHeight };

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={index}
        enableDynamicSizing={false}
        bottomInset={bottomInset}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        onChange={onChange}
        footerComponent={footer ? renderFooter : undefined}
        style={shadows.lg}
        backgroundStyle={{
          backgroundColor: background,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.lineStrong, width: 40, height: 4 }}
      >
        {scrollable ? (
          <BottomSheetScrollView
            contentContainerStyle={contentStyle}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={contentStyle}>{children}</BottomSheetView>
        )}
      </BottomSheet>
    );
  },
);

Sheet.displayName = "Sheet";

export default Sheet;

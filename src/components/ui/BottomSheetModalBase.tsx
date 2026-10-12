import { forwardRef, useRef, useImperativeHandle, ReactNode } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useTheme } from "@/theme";
import { BottomSheetModalBaseRef } from "@/types";
import ThemedText from "@/components/ui/ThemedText";

interface BottomSheetModalBaseProps {
  title: string;
  children: ReactNode;
}

const BottomSheetModalBase = forwardRef<BottomSheetModalBaseRef, BottomSheetModalBaseProps>(
  ({ title, children }, ref) => {
    const modalRef = useRef<BottomSheetModal>(null);
    const { colors } = useTheme();

    const contentStyle = {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 32,
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
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: colors.card,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.lineStrong, width: 40, height: 4 }}
      >
        <BottomSheetScrollView contentContainerStyle={contentStyle}>
          <ThemedText variant="title" className="mb-4">
            {title}
          </ThemedText>
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);

BottomSheetModalBase.displayName = "BottomSheetModalBase";

export default BottomSheetModalBase;

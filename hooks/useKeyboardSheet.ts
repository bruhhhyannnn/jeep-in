import { useEffect, useCallback } from "react";
import { Keyboard } from "react-native";
import type { BottomSheetRef } from "@/types";

/**
 * Expands or collapses a bottom sheet when the keyboard shows/hides.
 */
export const useKeyboardSheet = (sheetRef: BottomSheetRef) => {
  const handleShow = useCallback(() => sheetRef.current?.expand(), [sheetRef]);
  const handleHide = useCallback(() => sheetRef.current?.collapse(), [sheetRef]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", handleShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", handleHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleShow, handleHide]);
};

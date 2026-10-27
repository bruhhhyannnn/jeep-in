import { useEffect, useCallback } from "react";
import { Keyboard } from "react-native";
import type { SheetRef } from "@/types";

/**
 * Expands a bottom sheet while the keyboard is up and collapses it back after.
 */
export const useKeyboardSheet = (sheetRef: React.RefObject<SheetRef | null>) => {
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

import { useEffect } from "react";
import type { SheetRef } from "@/types";

const isTextField = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");

/**
 * Expands a bottom sheet while the keyboard is up and collapses it back after.
 * Browsers don't report the on-screen keyboard, so on touch devices a focused
 * text field stands in for it.
 */
export const useKeyboardSheet = (sheetRef: React.RefObject<SheetRef | null>) => {
  useEffect(() => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    const handleShow = (e: FocusEvent) => {
      if (isTextField(e.target)) sheetRef.current?.expand();
    };
    const handleHide = (e: FocusEvent) => {
      if (isTextField(e.target) && !isTextField(e.relatedTarget)) sheetRef.current?.collapse();
    };

    document.addEventListener("focusin", handleShow);
    document.addEventListener("focusout", handleHide);
    return () => {
      document.removeEventListener("focusin", handleShow);
      document.removeEventListener("focusout", handleHide);
    };
  }, [sheetRef]);
};

"use client";

import { useSidebarStore } from "@/store";

export function Backdrop() {
  const { isMobileOpen, closeMobile } = useSidebarStore();

  if (!isMobileOpen) return null;

  return <div className="fixed inset-0 z-30 bg-scrim lg:hidden" onClick={closeMobile} />;
}

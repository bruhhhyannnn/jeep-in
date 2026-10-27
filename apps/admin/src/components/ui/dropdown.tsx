"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib";

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dropdown({ isOpen, onClose, children, className }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".dropdown-toggle")
      ) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 z-40 mt-2 animate-in rounded-card border border-line bg-card p-2 shadow-lg duration-150 fade-in-0 zoom-in-95",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 w-full cursor-pointer items-center gap-3 rounded-full px-4 text-left text-[14px] font-semibold text-ink transition-colors hover:bg-sunken",
        className,
      )}
    >
      {children}
    </button>
  );
}

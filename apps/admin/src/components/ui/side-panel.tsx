"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Sticky footer, usually Cancel + one primary action. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  width?: "md" | "lg";
  /** Block closing (backdrop / Escape) while a save is in flight. */
  busy?: boolean;
}

/**
 * Anything you fill in or read in detail slides in from the right and keeps the
 * page visible. Centred dialogs are only for yes/no confirmations.
 */
export function SidePanel({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  children,
  width = "md",
  busy = false,
}: SidePanelProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 320);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, busy, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (visible) panelRef.current?.focus();
  }, [visible]);

  if (!mounted) return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-50", !visible && "pointer-events-none")}>
      <div
        className={cn(
          "absolute inset-0 bg-scrim transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={() => !busy && onClose()}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col bg-card shadow-lg outline-none sm:rounded-l-[28px]",
          width === "md" ? "sm:max-w-[460px]" : "sm:max-w-[540px]",
          "transition-transform duration-300 ease-(--ease-calm)",
          visible ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-6 pt-6 pb-5">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-xl leading-tight font-extrabold text-ink">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-[13px] text-ink-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-line-strong text-ink-muted transition-colors hover:bg-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line bg-card px-6 py-4 sm:rounded-bl-[28px]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** A labelled row inside a panel: what it is on the left, one action on the right. */
export function PanelActionRow({
  title,
  description,
  action,
  tone = "default",
}: {
  title: string;
  description: string;
  action: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-tile border-[1.5px] p-4 sm:flex-row sm:items-center sm:justify-between",
        tone === "danger" ? "border-danger/25" : "border-line",
      )}
    >
      <div className="min-w-0">
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

/** Read-only value in a panel, styled like a quiet field. */
export function PanelValue({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-label text-ink-muted">{label}</p>
      <div
        className={cn(
          "flex min-h-12 items-center rounded-input bg-sunken px-4 py-2 text-[14px] break-all text-ink",
          mono && "font-data text-[13px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

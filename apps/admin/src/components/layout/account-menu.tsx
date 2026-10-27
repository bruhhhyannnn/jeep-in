"use client";

import { useEffect, useRef } from "react";
import { Monitor, Moon, Sun, UserRound } from "lucide-react";
import { cn } from "@/lib";
import { useAuthStore, useSidebarStore, useThemeStore, type Theme } from "@/store";
import { Avatar } from "@/components/common";
import { SignOutButton } from "@/components/auth";

const APPEARANCE: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun size={14} /> },
  { value: "dark", label: "Dark", icon: <Moon size={14} /> },
  { value: "system", label: "Auto", icon: <Monitor size={14} /> },
];

/** Opens from the profile card at the bottom of the sidebar, on any page. */
export function AccountMenu({
  isOpen,
  onClose,
  displayName,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  displayName: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const email = useAuthStore((s) => s.user?.email ?? s.userProfile?.email ?? "");
  const { theme, setTheme } = useThemeStore();
  const openProfile = useSidebarStore((s) => s.openProfile);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".account-menu-toggle")
      ) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      role="menu"
      className={cn(
        "absolute z-50 w-[272px] animate-in rounded-card border border-line bg-card p-3 text-ink shadow-lg duration-150 fade-in-0 zoom-in-95",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-1 pt-1 pb-3">
        <Avatar name={displayName} size="md" tone="solid" />
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold">{displayName}</p>
          <p className="truncate text-[12px] text-ink-muted">{email}</p>
        </div>
      </div>

      <div className="border-t border-line px-1 pt-3 pb-3">
        <p className="mb-2 eyebrow">Appearance</p>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-sunken p-1">
          {APPEARANCE.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="menuitemradio"
              aria-checked={theme === opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex h-[34px] cursor-pointer items-center justify-center gap-1.5 rounded-full text-[12px] font-semibold transition-colors",
                theme === opt.value
                  ? "bg-card text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 border-t border-line pt-2">
        <button
          type="button"
          role="menuitem"
          onClick={() => {
            onClose();
            openProfile();
          }}
          className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-full px-4 text-[14px] font-semibold text-ink transition-colors hover:bg-sunken"
        >
          <UserRound size={17} />
          My profile
        </button>
        <SignOutButton />
      </div>
    </div>
  );
}

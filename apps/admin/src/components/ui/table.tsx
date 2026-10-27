import React from "react";
import { cn } from "@/lib";

/** One bordered block, a header strip, row dividers. */
export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="overflow-hidden rounded-card border-[1.5px] border-line bg-card shadow-sm">
      <div className="custom-scrollbar max-w-full overflow-x-auto">
        <table className={cn("w-full border-collapse", className)}>{children}</table>
      </div>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="border-b-[1.5px] border-line bg-sunken/70">{children}</thead>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
}

export function TableRow({
  children,
  className,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <tr
      onClick={onClick}
      aria-selected={selected || undefined}
      className={cn(
        "transition-colors duration-150",
        onClick && "cursor-pointer",
        selected ? "bg-action-soft" : "hover:bg-page/70",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}) {
  return (
    <th
      onClick={onClick}
      className={cn(
        "h-11 px-4 text-left text-[12px] font-semibold whitespace-nowrap text-ink-muted first:pl-5 last:pr-5",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn("px-4 py-3 text-[14px] text-ink first:pl-5 last:pr-5", className)}
    >
      {children}
    </td>
  );
}

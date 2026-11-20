"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

/**
 * Catches a crash in any admin page, so the sidebar and header stay up and the
 * admin can retry, instead of the whole app falling back to "This page couldn't load".
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin page]", error);
  }, [error]);

  return (
    <div className="flex h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-card border-[1.5px] border-danger/30 bg-card p-6 text-center shadow-sm">
        <p className="text-heading text-ink">This page hit a problem</p>
        <p className="mt-1.5 text-[14px] text-ink-muted">
          {error.message || "Something went wrong while showing this page."}
        </p>
        <Button className="mt-4" variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}

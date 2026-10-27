import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-[420px] rounded-[24px] border-[1.5px] border-line bg-card p-7 text-center shadow-md">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-action-soft text-action">
          <MapPinOff size={26} />
        </span>
        <p className="mt-5 font-data text-[13px] font-semibold text-ink-muted">404</p>
        <h1 className="mt-1 text-title text-ink">This page isn&apos;t on the route</h1>
        <p className="mt-2 text-[15px] text-ink-muted">It doesn&apos;t exist or was moved.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-action text-[15px] font-semibold text-on-action transition-colors hover:bg-action-hover hover:no-underline"
        >
          Back to fleet overview
        </Link>
      </div>
    </div>
  );
}

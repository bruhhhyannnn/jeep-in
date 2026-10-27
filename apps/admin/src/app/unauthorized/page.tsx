import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-[420px] rounded-[24px] border-[1.5px] border-line bg-card p-7 text-center shadow-md">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger-ink">
          <ShieldAlert size={26} />
        </span>
        <h1 className="mt-5 text-title text-ink">This account can&apos;t open the dashboard</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
          Only admins and super admins sign in here. Driver accounts work in the driver app. If you
          think this is a mistake, ask your super admin.
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-action text-[15px] font-semibold text-on-action transition-colors hover:bg-action-hover hover:no-underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

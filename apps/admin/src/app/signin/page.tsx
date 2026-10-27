import { Suspense } from "react";
import { SignInForm } from "@/components/auth";

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-page px-4 py-10">
      <Suspense>
        <SignInForm />
      </Suspense>
    </div>
  );
}

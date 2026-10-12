"use client";

import { createContext, use, useState, type ReactNode } from "react";

export const roles = ["Commuter", "Driver", "LGU or partner"] as const;
export type Role = (typeof roles)[number];

type JoinState = {
  role: Role;
  setRole: (role: Role) => void;
  submitted: boolean;
  setSubmitted: (submitted: boolean) => void;
};

const JoinContext = createContext<JoinState | null>(null);

/** Shares the sign-up form's role between the form and links elsewhere on the page. */
export function JoinProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Commuter");
  const [submitted, setSubmitted] = useState(false);
  return <JoinContext value={{ role, setRole, submitted, setSubmitted }}>{children}</JoinContext>;
}

export function useJoin() {
  const state = use(JoinContext);
  if (!state) throw new Error("useJoin must be used inside <JoinProvider>");
  return state;
}

/** Jumps to the sign-up form with "LGU or partner" picked. */
export function PartnerLink({ className, children }: { className: string; children: ReactNode }) {
  const { setRole, setSubmitted } = useJoin();
  return (
    <a
      href="#join"
      className={className}
      onClick={() => {
        setRole("LGU or partner");
        setSubmitted(false);
      }}
    >
      {children}
    </a>
  );
}

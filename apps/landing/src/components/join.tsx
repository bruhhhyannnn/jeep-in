"use client";

import { useState, type FormEvent } from "react";
import { roles, useJoin } from "@/components/join-context";
import { Container } from "@/components/ui";
import { pilotCopy, site } from "@/lib/site";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function contactProblem(value: string) {
  if (!value) return "Add a mobile number or email so we can reach you.";
  const digits = value.replace(/\D/g, "").length;
  const isPhone = /^\+?[\d\s()-]+$/.test(value) && digits >= 10 && digits <= 13;
  if (!isEmail(value) && !isPhone) return "Enter a mobile number like 0917 123 4567, or an email address.";
  return null;
}

function PrivacyNotice() {
  return (
    <div className="mt-1.5 flex flex-col gap-2 rounded-2xl bg-sky p-4 text-[13px] leading-[1.55] text-slate-700">
      <p className="text-sm font-extrabold text-ink">Privacy notice</p>
      <p>
        <strong>What we collect:</strong> the role you pick and the mobile number or email you type here. Nothing else.
      </p>
      <p>
        <strong>Why:</strong> to contact you about the JEEP-IN pilot on your route. We don’t sell or share it, and we
        don’t send ads.
      </p>
      <p>
        <strong>How long:</strong> until the pilot ends, then it’s deleted. Ask anytime and we’ll delete it sooner.
      </p>
      <p>
        <strong>Your rights:</strong> under the Data Privacy Act of 2012 (RA 10173) you can see, correct or remove your
        data. Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </div>
  );
}

function JoinForm() {
  const { role, setRole, submitted, setSubmitted } = useJoin();
  const [contact, setContact] = useState("");
  const [problem, setProblem] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const honeypot = new FormData(e.currentTarget).get("_gotcha");
    const value = contact.trim();
    const invalid = contactProblem(value);
    if (invalid) {
      setProblem(invalid);
      return;
    }

    setSending(true);
    try {
      const res = await fetch(site.formspreeEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          contact: value,
          // Formspree uses "email" as the reply-to address.
          ...(isEmail(value) && { email: value }),
          _subject: `JEEP-IN pilot sign-up · ${role}`,
          _gotcha: honeypot,
        }),
      });
      if (!res.ok) throw new Error(`Formspree responded with ${res.status}`);
      setContact(value);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setProblem(`We couldn’t send that. Try again, or email us at ${site.email}.`);
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="flex flex-col items-start gap-3.5 py-2.5">
        <span className="flex size-14 items-center justify-center rounded-full bg-accent">
          <svg
            aria-hidden
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-ink"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <p className="text-[26px] leading-[1.2] font-black text-ink">You’re on the list</p>
        <p className="text-base leading-[1.6] text-muted">
          We’ll reach you at <strong className="text-ink">{contact}</strong> as a{" "}
          {role === "LGU or partner" ? "partner" : role.toLowerCase()} when the pilot opens on your route.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setContact("");
            setRole("Commuter");
          }}
          className="cursor-pointer text-sm font-bold text-primary transition-colors hover:text-primary-hover hover:underline"
        >
          Add someone else
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
      <div role="group" aria-labelledby="join-role" className="flex flex-col gap-2.5">
        <p id="join-role" className="text-sm font-bold text-ink">
          I am a
        </p>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => {
            const on = role === r;
            return (
              <button
                key={r}
                type="button"
                aria-pressed={on}
                onClick={() => setRole(r)}
                className={`flex h-11 cursor-pointer items-center rounded-full border-[1.5px] px-4 text-sm font-bold transition hover:border-ink hover:shadow-[0_2px_8px_rgba(17,48,90,.12)] active:translate-y-px ${
                  on ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex flex-col gap-2.5">
        <span className="text-sm font-bold text-ink">Mobile number or email</span>
        <input
          name="contact"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
            setProblem(null);
          }}
          placeholder="09XX XXX XXXX or you@email.com"
          aria-invalid={problem !== null}
          aria-describedby={problem ? "join-problem" : undefined}
          className="h-[54px] rounded-2xl border-[1.5px] border-line-strong bg-white px-[18px] text-base font-medium text-ink outline-none transition focus:border-primary focus:shadow-[0_0_0_4px_rgba(22,112,224,.18)]"
        />
      </label>

      {/* Honeypot: people never see or fill this, bots usually do. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {problem && (
        <p id="join-problem" role="alert" className="text-sm font-semibold text-danger">
          {problem}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-ink text-base font-extrabold text-white transition-colors hover:bg-ink-hover disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? "Sending…" : pilotCopy.ctaLabel}
      </button>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] leading-normal text-subtle">
          We only use this to tell you when the pilot reaches your route.{" "}
          <button
            type="button"
            aria-expanded={showPrivacy}
            aria-controls="join-privacy"
            onClick={() => setShowPrivacy((v) => !v)}
            className="cursor-pointer text-[13px] font-bold text-primary hover:text-primary-hover hover:underline"
          >
            {showPrivacy ? "Hide privacy notice" : "Read our privacy notice"}
          </button>
        </p>
        <div
          id="join-privacy"
          inert={!showPrivacy}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            showPrivacy ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <PrivacyNotice />
          </div>
        </div>
      </div>
    </form>
  );
}

export function Join() {
  return (
    <section id="join" className="bg-primary">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,64px)] py-[clamp(64px,8vw,104px)]">
        <div className="flex flex-col gap-3.5">
          <h2 className="text-[clamp(34px,4.6vw,56px)] leading-[1.04] font-black tracking-[-.035em] text-balance text-white">
            {pilotCopy.joinTitle}
          </h2>
          <p className="max-w-[460px] text-lg leading-[1.6] text-pretty text-on-primary">{pilotCopy.joinSub}</p>
        </div>
        <div className="rounded-[28px] bg-white p-[clamp(22px,3vw,32px)] shadow-[0_30px_60px_rgba(11,27,51,.25)]">
          <JoinForm />
        </div>
      </Container>
    </section>
  );
}

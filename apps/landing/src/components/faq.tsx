"use client";

import { useState } from "react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui";

const faqs = [
  {
    q: "Is it free?",
    a: "Yes. The commuter app is free. Drivers and operators in the pilot also use it at no cost.",
  },
  {
    q: "Which routes does it cover?",
    a: "The pilot covers the Laoag – Batac – Paoay route in both directions, from Laoag terminal to Paoay Church.",
  },
  {
    q: "How accurate are the arrival times?",
    a: "Times come from each jeep’s live position and update as it moves. If a jeep loses signal, the app shows its last known spot and says so, instead of guessing.",
  },
  {
    q: "Can drivers or operators see where I am?",
    a: "No. Your location stays on your phone and is only used to find the stop nearest to you.",
  },
  {
    q: "Does it work with weak mobile data?",
    a: "Yes. The app uses very little data. With no signal it keeps the last map it had and tells you how old it is.",
  },
  {
    q: "We run jeepneys or a transport cooperative. How do we join?",
    a: "Pick “LGU or partner” in the form below and leave a number. We’ll set up the manager dashboard and driver accounts with you.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-sky">
      <Container narrow className="flex flex-col gap-8 py-[clamp(64px,8vw,112px)]">
        <div className="flex flex-col gap-3">
          <Eyebrow>FAQ</Eyebrow>
          <SectionTitle>Questions people ask</SectionTitle>
        </div>
        <div className="flex flex-col gap-2.5">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-[20px] bg-white shadow-sm transition-shadow duration-200 ease-out hover:shadow-[0_8px_22px_rgba(17,48,90,.12)]"
              >
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex min-h-16 w-full cursor-pointer items-center gap-4 px-[22px] py-[18px] text-left transition-colors hover:bg-sky-50"
                  >
                    <span className="flex-1 text-[17px] leading-[1.35] font-extrabold text-ink">{faq.q}</span>
                    <span
                      aria-hidden
                      className={`flex size-8 flex-none items-center justify-center rounded-full text-xl leading-none font-bold transition-[transform,background-color,color] duration-[260ms] ease-out ${
                        isOpen ? "rotate-45 bg-ink text-white" : "bg-sunken text-ink"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className={`px-[22px] pb-5 text-base leading-[1.6] text-pretty text-muted transition duration-300 ease-out ${
                        isOpen ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
                      }`}
                    >
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

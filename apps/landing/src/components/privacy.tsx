import type { ReactNode } from "react";
import { Container, Eyebrow, SectionTitle } from "@/components/ui";

const promises: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: (
      <>
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    title: "Commuters stay invisible",
    body: "Drivers and operators never see where you are. Your location is only used on your phone to find the nearest stop.",
  },
  {
    icon: <rect x="6" y="6" width="12" height="12" rx="2" />,
    title: "Eyes stay on the road",
    body: "Drivers tap once when the shift starts. After that there’s nothing to read or type while the jeep is moving.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    title: "Only during a shift",
    body: "Drivers choose when to share. Nothing is tracked before the shift starts or after it ends.",
  },
];

export function Privacy() {
  return (
    <section id="privacy" className="bg-white">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(32px,5vw,64px)] py-[clamp(64px,8vw,112px)]">
        <div className="flex flex-col gap-3">
          <Eyebrow>Privacy and safety</Eyebrow>
          <SectionTitle>Jeeps are tracked. People are not.</SectionTitle>
          <p className="mt-2 text-[17px] leading-[1.6] text-pretty text-muted">
            JEEP-IN only needs to know where the jeepneys are. Everything else stays on your phone or off the road.
          </p>
        </div>
        <ul className="flex flex-col gap-3.5">
          {promises.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-[22px] bg-sky p-[22px] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(17,48,90,.10)]"
            >
              <span className="flex size-11 flex-none items-center justify-center rounded-[13px] bg-ink">
                <svg
                  aria-hidden
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-accent"
                >
                  {item.icon}
                </svg>
              </span>
              <div>
                <h3 className="text-[17px] font-extrabold text-ink">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-[1.55] text-pretty text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

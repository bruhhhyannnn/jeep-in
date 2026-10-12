import { Container, Eyebrow, SectionTitle } from "@/components/ui";

const steps = [
  {
    title: "Drivers start sharing",
    body: "The driver taps one button when the shift starts. Their jeep then shows up on the map for everyone waiting along the route.",
  },
  {
    title: "You see it on the map",
    body: "Open the app to see every jeep on the route and how many minutes the nearest one is from your stop.",
  },
  {
    title: "Walk out when it’s close",
    body: "Pick your stop and head to the roadside when your jeep is a few minutes away, not half an hour early.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-white">
      <Container className="flex flex-col gap-11 py-[clamp(64px,8vw,112px)]">
        <div className="flex max-w-[640px] flex-col gap-3">
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle>Three steps, from the driver’s phone to yours</SectionTitle>
        </div>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col gap-3.5 rounded-[28px] bg-sky p-7 transition duration-200 ease-out hover:-translate-y-[3px] hover:shadow-[0_14px_30px_rgba(17,48,90,.12)]"
            >
              <span
                aria-hidden
                className="flex size-12 items-center justify-center rounded-[14px] bg-ink text-[22px] font-black text-accent"
              >
                {i + 1}
              </span>
              <h3 className="text-[21px] leading-[1.25] font-extrabold text-ink">{step.title}</h3>
              <p className="text-base leading-[1.6] text-pretty text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

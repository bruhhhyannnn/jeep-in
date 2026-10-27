export const site = {
  name: "JEEP-IN",
  title: "JEEP-IN · Know when your jeep is coming",
  description:
    "See jeepneys on the Laoag – Batac – Paoay route live on a map, with the minutes to your stop. Join the JEEP-IN pilot.",
  shareDescription:
    "Live jeepney tracking for Laoag, Batac and Paoay, Ilocos Norte. Join the pilot.",
  email: "mangapit.bryan@gmail.com",
  facebook: "https://www.facebook.com/people/Jeep-In/61584186487730/",
  /** Pilot sign-ups are emailed through this Formspree form. */
  formspreeEndpoint: "https://formspree.io/f/moejlbww",
};

/** The design's "Tweaks": flip these to change the page without touching components. */
export const pilot = {
  status: "open" as "open" | "full",
  /** Cooperative running the pilot. While null, the "Piloting with …" line is hidden. */
  partner: null as string | null,
  /** Move the jeeps on the maps. Visitors who prefer reduced motion never see movement. */
  animateJeeps: true,
};

const full = pilot.status === "full";

export const pilotCopy = {
  ctaLabel: full ? "Join the waitlist" : "Join the pilot",
  eyebrow: full ? "Pilot full · waitlist open" : "Pilot now open · Laoag – Batac – Paoay",
  joinTitle: full
    ? "The pilot is full. Get the next spot."
    : "Be one of the first to ride with JEEP-IN",
  joinSub: full
    ? "Leave your number and we’ll let you know as soon as a place opens on your route."
    : "The pilot starts on the Laoag – Batac – Paoay route. Leave your number and we’ll send the app when it opens.",
};

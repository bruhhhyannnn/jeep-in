export const ROUTES = {
  root: {
    index: "/",
    notFound: "/_not-found",
  },

  onboarding: {
    layout: "/(onboarding)",
    welcome: "/(onboarding)/welcome",
    roleSelection: "/(onboarding)/role-selection",
  },

  auth: {
    login: "/(auth)/login",
  },

  commuter: {
    layout: "/(map)/(commuter)",
    home: "/(map)/(commuter)/home", // TODO: this is set as default for now

    jeepney: (id: string) => `/(map)/jeepney/${id}` as const,
    stop: (id: string) => `/(map)/stop/${id}` as const,
    etaJeepney: (id: string) => `/(map)/eta-jeepney/${id}` as const,
    etaStop: (id: string) => `/(map)/eta-stop/${id}` as const,
  },

  driver: {
    layout: "/(map)/(driver)",
    home: "/(map)/(driver)/home",
  },

  settings: {
    home: "/(settings)",
  },
} as const;

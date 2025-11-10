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

  commuter: {
    layout: "/(commuter)",
    home: "/(commuter)/home",
    settings: "/(commuter)/settings",

    // Nested commuter pages
    jeepney: (id: string) => `/(commuter)/home/jeepney/${id}` as const,
    stop: (id: string) => `/(commuter)/home/stop/${id}` as const,
    etaJeepney: (id: string) => `/(commuter)/home/eta/jeepney/${id}` as const,
    etaStop: (id: string) => `/(commuter)/home/eta/stop/${id}` as const,
  },

  driver: {
    layout: "/(driver)",
    dashboard: "/(driver)/index",
  },
} as const;

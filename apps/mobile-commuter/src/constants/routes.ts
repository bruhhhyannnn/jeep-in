export const ROUTES = {
  root: {
    index: "/",
    notFound: "/_not-found",
  },

  onboarding: {
    layout: "/(onboarding)",
    roleSelection: "/(onboarding)/role-selection",
    welcome: "/(onboarding)/welcome",
    location: "/(onboarding)/location",
    chooseStop: "/(onboarding)/choose-stop",
  },

  auth: {
    login: "/(auth)/login",
  },

  commuter: {
    layout: "/(map)/(commuter)",
    home: "/(map)/(commuter)/home",
    stops: "/(map)/(commuter)/stops",
    fare: "/(map)/(commuter)/fare",
    alerts: "/(map)/(commuter)/alerts",
    direction: "/(map)/(commuter)/direction",
    fareMatrix: "/(map)/(commuter)/fare-matrix",

    jeepney: (id: string) => `/(map)/(commuter)/jeepney/${id}` as const,
    stop: (id: string) => `/(map)/(commuter)/stop/${id}` as const,
  },

  driver: {
    home: "/driver/gps",
    direction: "/driver/direction",
    report: "/driver/report",
    profile: "/driver/profile",
    display: "/driver/display",
  },

  settings: {
    home: "/(settings)",
  },
} as const;

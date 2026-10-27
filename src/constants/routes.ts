// The same URLs expo-router gives the native app's screens on the web
// (route groups like "(map)" don't appear in the path).
export const ROUTES = {
  root: {
    index: "/",
  },

  onboarding: {
    welcome: "/welcome",
    location: "/location",
    chooseStop: "/choose-stop",
  },

  commuter: {
    home: "/home",
    stops: "/stops",
    fare: "/fare",
    alerts: "/alerts",
    direction: "/direction",
    fareMatrix: "/fare-matrix",

    jeepney: (id: string) => `/jeepney/${id}` as const,
    stop: (id: string) => `/stop/${id}` as const,
  },

  settings: {
    home: "/settings",
  },
} as const;

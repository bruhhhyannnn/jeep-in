export const ROUTES = {
  root: {
    index: "/",
  },

  auth: {
    login: "/login",
  },

  // Same paths as the native app's driver screens.
  driver: {
    home: "/driver/gps",
    direction: "/driver/direction",
    report: "/driver/report",
    profile: "/driver/profile",
    display: "/driver/display",
  },
} as const;

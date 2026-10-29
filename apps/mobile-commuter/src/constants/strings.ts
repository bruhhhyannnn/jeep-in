import { commuterStrings, driverAppStrings } from "@jeep-in/core/strings";

// Commuter copy is shared with the web app, and the sign-in and driver copy with the
// web driver app (packages/core); this adds what only the native app shows.
const shared = commuterStrings;

export const STRINGS = {
  ...shared,

  // Onboarding - Section
  onboarding: {
    roleSelection: {
      title: "Welcome to JEEP-IN",
      subtitle: "Live jeepneys, stops and fares on your route.",
      commuter: "I ride jeeps",
      commuterHint: "See jeeps, stops and fares. No account needed.",
      operator: "I drive or operate",
      operatorHint: "Sign in with your operator account.",
    },
  },

  auth: driverAppStrings.auth,

  settings: {
    ...shared.settings,
    account: "Account",

    logout: {
      changeRole: "Change role",
      changeRoleHint: "Go back to choosing commuter or driver",
      ...driverAppStrings.logout,
    },
  },

  driver: driverAppStrings.driver,
};

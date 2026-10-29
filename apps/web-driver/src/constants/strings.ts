import { commuterStrings, driverAppStrings } from "@jeep-in/core/strings";

// The sign-in, sign-out and driver copy is shared with the native app's driver
// screens (packages/core). What differs here is how a browser handles location:
// it can't share from the background, and its location switch is in site settings.
const { driver } = driverAppStrings;

export const STRINGS = {
  general: commuterStrings.general,
  errors: commuterStrings.errors,
  auth: driverAppStrings.auth,

  settings: {
    appearance: commuterStrings.settings.appearance,
    mincPhoneNumber1: commuterStrings.settings.mincPhoneNumber1,
    logout: driverAppStrings.logout,
  },

  driver: {
    ...driver,
    gps: {
      ...driver.gps,
      foregroundOnly:
        "Keep this page open with the screen on — the browser only shares location while JEEP-IN Driver is on screen.",
      blockedPermissionTitle: "Your browser is not letting JEEP-IN see your location",
      blockedServicesTitle: "Location is switched off on this phone",
      permissionSteps: "Site settings (left of the address) → Location → Allow",
      servicesSteps: "Settings → Location → On",
      // A web page can't open the phone's settings; it can ask again.
      tryAgain: "Try again",
      noGps: "This browser can't share location. Open JEEP-IN Driver in Chrome or Safari.",
    },
  },

  web: {
    update: {
      ready: "A new version is ready",
      reload: "Reload",
    },
  },
};

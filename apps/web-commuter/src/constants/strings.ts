import { commuterStrings } from "@jeep-in/core/strings";

// Commuter copy is shared with the native app (packages/core); this adds and
// rewords what differs in a browser.
const shared = commuterStrings;

export const STRINGS = {
  ...shared,

  commuter: {
    ...shared.commuter,
    alerts: {
      ...shared.commuter.alerts,
      deviceOnly:
        "Kept on this device only — there's no account to sync from. Clears if you clear this browser's data.",
      footer: "Alerts are kept on this phone only — they clear if you clear this browser's data",
    },
  },

  // Web app only — install, updates and browser permissions
  web: {
    install: {
      section: "App",
      title: "Install app",
      hint: "Add JEEP-IN to your home screen",
      iosTitle: "Add to Home Screen",
      iosSteps: [
        "Tap the Share button in Safari's toolbar",
        "Choose “Add to Home Screen”",
        "Tap Add",
      ],
    },
    update: {
      ready: "A new version is ready",
      reload: "Reload",
    },
    alerts: {
      iosHint: "On iPhone, alerts need JEEP-IN on your Home Screen (iOS 16.4 or later).",
    },
    blocked: {
      location: "Location is blocked for this site. Allow it in your browser's site settings.",
      notifications:
        "Notifications are blocked for this site. Allow them in your browser's site settings.",
    },
    copied: "Copied to clipboard!",
  },
};

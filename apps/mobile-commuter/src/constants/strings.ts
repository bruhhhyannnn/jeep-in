import { commuterStrings } from "@jeep-in/core/strings";

// Commuter copy is shared with the web app (packages/core); this adds the native
// app's sign-in and driver screens.
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

  // Auth - Section
  auth: {
    title: "JEEP-IN Driver",
    subtitle: "Sign in before you drive.",
    email: "Email",
    emailPlaceholder: "name@email.com",
    password: "Password",
    show: "Show",
    hide: "Hide",
    emailPasswordRequired: "Both email and password are required.",
    userNotFound: "User not found.",
    accountNotAllowed: "This account is not allowed to sign in.",
    invalidCredentials: "Invalid credentials or network error.",
    signIn: "Sign in",
    signingIn: "Signing in...",
    forgot: "Forgot password — ask your manager",
    lasts: "Signing in lasts the whole shift — you won't be asked again on the road",
  },

  settings: {
    ...shared.settings,
    account: "Account",

    logout: {
      changeRole: "Change role",
      changeRoleHint: "Go back to choosing commuter or driver",

      confirmTitle: "Sign out?",
      body: "You'll need your email and password to sign in again before your next shift.",
      cancel: "Cancel",
      logout: "Sign out",
    },
  },

  // Driver - Section
  driver: {
    tabs: {
      gps: "GPS",
      direction: "Direction",
      report: "Report",
      profile: "Profile",
    },

    unit: (unit: string, plate: string) => `Unit ${unit} · ${plate}`,
    noUnit: "No unit assigned",

    gps: {
      eyebrow: "Location sharing",
      on: "ON",
      off: "OFF",
      broadcasting: "Broadcasting",
      confirmed: (ago: string) => `Commuters can see you · confirmed ${ago}`,
      starting: "Starting",
      notVisible: "not visible yet",
      tapToStart: "commuters can't see you",
      startSharing: "Start sharing",
      stopSharing: "Stop sharing",
      steps: {
        permission: { title: "Location allowed", detail: "The phone lets the app read GPS" },
        fix: { title: "GPS fix", detail: "First position from the phone" },
        write: { title: "Sent", detail: "The server has your position" },
        readback: { title: "On the commuters' map", detail: "Read back from what commuters see" },
      },
      stepState: { waiting: "—", active: "…", done: "OK" },
      foregroundOnly:
        "Keep JEEP-IN open — the phone only allows location while the app is on screen.",

      waiting: "waiting for signal",
      sinceLastSent: "since last sent",
      droppedTitle: (place: string) => `Commuters still see you at ${place}`,
      droppedTitleNoPlace: "Commuters still see your last position",
      droppedBody: (min: number) =>
        `Your position hasn't reached the server for ${min} minutes. It sends by itself when signal returns.`,
      retry: "Retry now",
      gotIt: "Got it",

      blocked: "blocked by phone",
      blockedPermissionTitle: "Your phone is not letting the app see your location",
      blockedServicesTitle: "Location is switched off on this phone",
      blockedBody:
        "Commuters see this jeep as off duty. The switch can't turn on until this is allowed.",
      threeTaps: "Three taps",
      permissionSteps: "Settings → JEEP-IN → Location → Allow all the time",
      servicesSteps: "Settings → Location → On",
      openSettings: "Open phone settings",
      resumes:
        "Sharing resumes by itself once location is allowed — you don't have to sign in again",

      nothing: "nothing to share",
      noUnitTitle: "Today's shift hasn't been published",
      noUnitBody:
        "Your manager assigns the unit and direction. Until then there is no jeep for your location to belong to.",
      callManager: "Call manager",
      checkAgain: "Check again",
      stillNoUnit: "Still no unit assigned.",

      opensAt: (time: string) => `opens at ${time}`,
      tooEarly: "Too early to share yet",
      tooEarlyBody: (start: string, end: string) =>
        `Your cooperative shares location between ${start} and ${end}. The switch turns itself on at ${start} if the app is open — you do not have to wait here.`,
      now: "Now",
      offUntil: (time: string) => `Sharing is off until ${time}`,
      nobodyWaiting: (time: string) =>
        `Commuters are told the first jeep leaves at ${time}, so nobody is waiting for you yet`,

      shiftEnded: (time: string) => `Shift ended ${time}`,
      stoppedByItself: "stopped by itself",
      stoppedAt: (time: string) => `Sharing stopped at ${time}`,
      stoppedBody:
        "Your jeep is no longer on the commuters' map. If you are still finishing this run, keep sharing so the people waiting can still see you.",
      keepSharing: "Keep sharing for 30 more minutes",
      doneForToday: "I'm done for today",
      overtimeNote:
        "Extra time is logged for your manager and stops on its own after 30 minutes — it never runs all night by accident",
      endingSoon: (time: string) => `Shift ends at ${time}`,
      endingSoonBody: (min: number) => `Sharing stops by itself in ${min} min.`,
      overtimeUntil: (time: string) => `Extra time until ${time}`,
    },

    strip: {
      sharing: (direction: string) => `Sharing · ${direction.toLowerCase()}`,
      starting: "Starting · not visible yet",
      off: "Not sharing · commuters can't see you",
      resting: "Resting · hidden from commuters",
      noDirection: "no direction set",
    },

    direction: {
      title: "Which way now?",
      subtitle: "Set this at the terminal, not while moving.",
      current: "Current",
      tapToSwitch: "Tap to switch",
      note: "Switching moves your jeep to the other direction's list for commuters straight away",
      noDirections: "This route has no directions yet.",
    },

    locked: {
      title: "Stop the jeep first",
      direction: "You can switch once the jeep stops.",
      report: "This opens by itself when you stop. Nothing to tap.",
    },

    endOfRoute: {
      reached: "You reached the end of the route",
      title: "Going back now?",
      body: (destination: string) =>
        `Commuters waiting for a jeep to ${destination} will see you once you switch.`,
      yes: (destination: string) => `Yes, switch to ${destination}`,
      notYet: "Not yet, I'm resting here",
      auto: "If you don't tap, it switches by itself when you leave the terminal.",
    },

    report: {
      title: "What's wrong?",
      subtitle: "Tap one. Your manager gets it straight away.",
      reasons: {
        breakdown: { title: "Breakdown", sub: "The jeep can't continue the trip" },
        road_blocked: { title: "Road blocked", sub: "Closure, flood or a landslide ahead" },
        accident: { title: "Accident", sub: "Involving this jeep, or blocking the road" },
        heavy_traffic: { title: "Heavy traffic", sub: "Running well behind the usual time" },
        other: { title: "Something else", sub: "Say what happened in the note below" },
      },
      noteLabel: "Anything to add? (not required)",
      notePlaceholder: "Type a short note",
      send: "Send to manager",
      attached:
        "Your unit, your place on the road and the time are attached for you — nothing else to fill in",
      noUnit: "You need an assigned unit to send a report.",
      sentTitle: "Your manager knows",
      sentMeta: (reason: string, time: string) => `${reason} · sent ${time}`,
      whatNow: "What happens now",
      whatNowSteps: [
        "It appears on the manager's alerts list as a driver report.",
        "They decide whether to send a reliever and whether commuters are told.",
        "Keep driving. Sharing stays as it was.",
      ],
      mistake: "Sent it by mistake?",
      takeBack: "Take it back",
      takenBack: "Taken back — it no longer shows on your manager's list.",
      backToSharing: "Back to sharing",
      queued: "Queued and sent by itself if there is no signal where you stopped",
    },

    profile: {
      main: "Main driver",
      reliever: "Reliever",
      onDuty: "on duty",
      offDuty: "off duty",
      assignment: "Today's assignment",
      unitLine: (unit: string, seats: number | null, direction: string | null) =>
        [`Unit ${unit}`, seats ? `${seats} seats` : null, direction?.toLowerCase()]
          .filter(Boolean)
          .join(" · "),
      noAssignment: "No unit assigned yet",
      record: "My record · read only",
      driverId: "Driver ID",
      license: "Licence no.",
      licenseExpiry: "Licence expiry",
      phone: "Phone",
      email: "Email",
      notOnFile: "Not on file",
      display: "Display",
      change: "Change",
      managerNote:
        "Unit, role and reliever pairing come from your manager — ask them to change anything here",
      signOut: "Sign out",
    },

    display: {
      title: "Display",
      note: "Dark keeps the screen from glaring in the cab before sunrise and after dark. GPS sharing is not affected.",
    },
  },
};

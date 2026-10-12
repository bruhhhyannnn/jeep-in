const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export const STRINGS = {
  // General
  general: {
    appName: "JEEP-IN",
    goBack: "Go back",
    apply: "Apply",
    cancel: "Cancel",
    comingSoon: "Coming soon… Feature under development.",
  },

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

  // Commuter — Section
  commuter: {
    routeFallback: "your route",

    tabs: {
      map: "Map",
      stops: "Stops",
      fare: "Fare",
      alerts: "Alerts",
    },

    onboarding: {
      skip: "Skip",
      next: "Next",
      start: "Start tracking",
      live: {
        title: "See where the jeeps are",
        body: (route: string) =>
          `Live locations along ${route}, updated as drivers move. No sign-up, no account.`,
      },
      direction: {
        title: "Pick your direction",
        body: "One route, two ways. Choose the one you're travelling and only those jeeps show up.",
        remember: "We'll remember it for next time",
        loading: "Loading directions…",
      },
      fare: {
        title: "Know the fare first",
        body: "Check the fare for your stop before you board, so the change you get back is the change you expect.",
      },
      // Sample content for the illustrations only.
      sample: {
        unit: "J14",
        nearest: "Nearest stop · 240 m",
        stop: "Batac City Plaza",
        eta: "J14 · 4 min away",
        boarding: "Laoag terminal",
        tripKm: 10.7,
      },
    },

    location: {
      title: "Find the jeep nearest to you",
      body: "We use your location to show the closest stop and how far the next jeep is. Only while the app is open.",
      privacy: "Drivers and operators never see where you are.",
      allow: "Allow location",
      chooseStop: "Choose my stop instead",
    },

    chooseStop: {
      title: "Where do you usually board?",
      body: "Location is off, so pick a stop. You can change it any time.",
      boardAt: (stop: string) => `Board at ${stop}`,
      pickOne: "Pick a stop",
      turnOnLocation: "Turn on location instead",
      noStops: "Stops haven't loaded yet. You can pick one later from the Stops tab.",
      continue: "Continue without a stop",
    },

    map: {
      direction: "Direction",
      chooseDirection: "Choose a direction",
      nearestStop: (distance: string) => `Nearest stop · ${distance}`,
      yourStop: "Your stop",
      settings: "Settings",
      recenter: "Show my location",
    },

    home: {
      jeepsToward: (n: number, direction: string) =>
        `${plural(n, "jeep")} ${direction.toLowerCase()}`,
      soonestFirst: "Soonest arrival first",
      pickStopForTimes: "Pick your stop to see arrival times",
      pickStop: "Pick a stop",
      live: "Live",
      arriving: "Arriving",
      passed: "Passed your stop",
      offRoute: "Off the route right now",
      lastSeen: (ago: string) => `Last seen ${ago}`,
      nextStop: (stop: string) => `Next stop · ${stop}`,
      atEnd: "Near the end of the route",

      noJeepsTitle: (direction: string) => `No jeeps ${direction.toLowerCase()} right now`,
      beforeService: (start: string) => `Service usually starts around ${start}.`,
      afterService: (end: string, start: string) =>
        `Service usually ends around ${end}. First trip tomorrow is usually around ${start}.`,
      duringService:
        "Drivers show up here as soon as they start sharing. Check again in a few minutes.",
      alertWhenLive: "Alert me when one goes live",
      watchingLive: "We'll alert you when one goes live",
      stopWatching: "Cancel alert",
      otherDirection: (direction: string, n: number) => `${direction} · ${n} live`,
      stillWorks: "Fares and stop details still work with no jeeps out",

      offlineTitle: "No connection",
      offlineSince: (clock: string, ago: string) => `Positions are from ${clock}, ${ago}`,
      offlineNoPositions: "Jeep positions can't load right now",
      retry: "Retry",
      lastSeenToward: (direction: string) => `Last seen ${direction.toLowerCase()}`,
      notUpdating: "Not updating — arrival times hidden",
      offlineWorks: "Fares, stops and the matrix still work",
      offlineWorksHint: "Saved on this phone — no signal needed",
    },

    direction: {
      title: "Which way are you going?",
      subtitle: (route: string) => `${route} · we'll remember this`,
      live: (n: number) => `${n} live`,
      useMyLocation: "Use my location",
      showJeeps: "Show jeeps",
      noDirections: "This route has no directions yet.",
    },

    jeepney: {
      unitToward: (unit: string, direction: string) => `Unit ${unit} · ${direction.toLowerCase()}`,
      arrivesIn: "Arrives in",
      distance: "Distance",
      stopsAhead: "Stops ahead",
      toGo: (n: number) => `${n} to go`,
      nextStop: "Next stop",
      yourStop: "Your stop",
      notify: (min: number) => `Notify me at ${min} min`,
      following: (min: number) => `Alert set for ${min} min`,
      stopFollowing: "Stop",
      notifyNote: "One alert for this jeep, then it clears itself",
      passed: "This jeep has passed your stop.",
      noStop: "Pick your stop to see when this jeep arrives.",
      stale: (ago: string) => `Position not updating since ${ago}. Arrival time hidden.`,
      offRoute: "This jeep is off the route right now. Arrival time hidden.",
      unknownDirection: "The driver hasn't shared a direction yet. Arrival time hidden.",
      notFound: "This jeep stopped sharing its location.",
      backToMap: "Back to map",
      share: (unit: string, eta: number, stop: string) =>
        `JEEP-IN: Jeep ${unit} is about ${eta} min from ${stop}.`,
    },

    stops: {
      search: "Search a stop or landmark",
      yourTrip: "Your trip",
      step: (n: number) => `step ${n} of 2`,
      tripSummary: (stops: number, km: string) => `${plural(stops, "stop")} · ${km}`,
      boardingAt: "Boarding at",
      gettingOffAt: "Getting off at",
      tapStopBelow: "Tap a stop below",
      tapResult: "Tap a result",
      change: "Change",
      filling: "Filling",
      nearest: (distance: string) => `Nearest · ${distance}`,
      stopCount: (n: number) => plural(n, "stop"),
      details: "Details",
      seeFare: "See fare for this trip",
      jeepsComing: (n: number, min: number | null) =>
        n === 0 ? "No jeeps coming" : `${plural(n, "jeep")}${min != null ? ` · ${min} min` : ""}`,
      matches: (n: number, query: string) => `${plural(n, "stop")} match “${query}”`,
      nothingMatched: "Nothing matched?",
      landmarksToo: "Landmarks are searched too.",
      clearSearch: "Clear search",
      noMatchTitle: (query: string) => `No stops match “${query}” on this route`,
      noMatchBody: "Check the spelling, or try a landmark near where you’re going.",
      showAll: "Show all stops",
      mustBeAfter: (stop: string) =>
        `Pick a stop after ${stop} — jeeps on this direction don't go back.`,
      empty: "No stops on this direction yet.",
    },

    stop: {
      position: (order: number, total: number, km: string, origin: string) =>
        `Stop ${order} of ${total} · ${km} from ${origin}`,
      approaching: "jeeps approaching",
      nearestArrival: "nearest arrival",
      about: "About this stop",
      fareFromBoarding: "Fare from your boarding stop",
      fromHere: (stop: string) => `${stop} → here`,
      regularKm: (km: string) => `regular · ${km}`,
      boardHere: "Board here",
      boardHereInstead: "Board here instead",
      getOffHere: "Get off here",
      getOffSeeFare: (fare: string) => `Get off here · see fare ${fare}`,
      isBoarding: "You're boarding here",
      notFound: "This stop isn't on the route anymore.",
    },

    fare: {
      title: "Fare guide",
      yourFare: "Your fare",
      regular: "Regular",
      discounted: "Discounted",
      forTrip: (km: string, stops: number) => `for ${km} · ${plural(stops, "stop")}`,
      pickStops: "Pick where you board and get off",
      discountLabel: (pct: number) => `Student / senior · ${pct}% off`,
      youdPay: (fare: string) => `You'd pay ${fare} · bring your ID`,
      regularIs: (fare: string) => `Regular fare is ${fare}`,
      idNote: "Bring your ID — the discount is claimed with the driver, not in the app",
      viewMatrix: "View official LTFRB matrix",
      placeholderNote: "Placeholder rates · order no. and effective date not posted yet",
      orderNote: (orderNo: string, date: string | null) =>
        date ? `Order ${orderNo} · effective ${date}` : `Order ${orderNo}`,
      pickerBoarding: "Where do you board?",
      pickerAlighting: "Where do you get off?",
      fromStop: (stop: string) => `from ${stop}`,
    },

    matrix: {
      title: "Approved fare matrix",
      source: "Source",
      subtitle: (route: string, vehicleClass: string) => `${route} · ${vehicleClass.toLowerCase()}`,
      orderNo: "Order no.",
      issuedBy: "Issued by",
      effective: "Effective",
      vehicleClass: "Vehicle class",
      lastSynced: "Last synced",
      notPosted: "Not posted yet",
      synced: "Synced from the posted order. The app never sets its own rates.",
      placeholder:
        "Placeholder rates until the posted order is added. The app never sets its own rates.",
      howComputed: "How it's computed",
      baseFare: (km: number) => `Base fare · first ${km} km`,
      perKm: "Every km after",
      discount: "Student / senior / PWD",
      rounding: "Rounded to the nearest",
      table: "Stop-to-stop table",
      tableHint: "regular / discounted",
      leg: "Leg",
      reg: "Reg.",
      disc: "Disc.",
      report: "Report wrong fare",
      reportSubject: "JEEP-IN: wrong fare on the matrix",
      saveCopy: "Save offline copy",
      savedCopy: (date: string) => `Saved · ${date}`,
      footer:
        "Reports reach the operator, not LTFRB. The offline copy is what you show when there's no signal.",
      empty: "Stops for this direction haven't loaded yet.",
    },

    alerts: {
      title: "Alerts",
      markAllRead: "Mark all read",
      deviceOnly:
        "Kept on this device only — there's no account to sync from. Clears when you reinstall.",
      arrivalAlerts: "Arrival alerts",
      arrivalAlertsHint: (min: number) => `Ping me ${min} minutes before my jeep`,
      emptyTitle: "No alerts yet",
      emptyBody: (min: number) =>
        `Alerts appear here after you tap “Notify me at ${min} min” on a jeep. Nothing is sent unless you ask for it.`,
      findJeep: "Find a jeep to track",
      blockedTitle: "Notifications are switched off for this app",
      blockedBody: "Alerts will only show inside the app",
      turnOn: "Turn on",
      footer: "Alerts are kept on this phone only — they clear if you reinstall",

      arrivalTitle: (unit: string, min: number) => `${unit} is ${min} min away`,
      arrivalBody: (stop: string, plate: string) => `Head to ${stop} now. Plate ${plate}.`,
      passedTitle: (unit: string) => `${unit} passed your stop`,
      passedBody: (stop: string) =>
        `It went past ${stop} before the alert time. Pick another jeep.`,
      lostTitle: (unit: string) => `${unit} stopped sharing`,
      lostBody: "Its position stopped updating, so the alert was cleared.",
      liveTitle: (direction: string) => `A jeep is live ${direction.toLowerCase()}`,
      liveBody: (unit: string) =>
        `${unit} just started sharing. Open the map to see how far it is.`,
    },

    following: {
      eyebrow: "Following",
      minutesAway: (plate: string, min: number | null) =>
        min == null ? plate : min === 0 ? `${plate} · arriving` : `${plate} · ${min} min away`,
      alertAt: (min: number, stop: string) => `Alert at ${min} min · ${stop}`,
      stop: "Stop",
    },
  },

  // Settings — Section
  settings: {
    title: "Settings",
    helpInfo: "Help information",
    jeepinEmail: "jeepin.official@gmail.com",
    jeepinEmailSubject: "JEEP-IN Support Request",
    developerEmail: "mangapit.bryan@gmail.com",
    developerPhoneNumber1: "+63 918 217 8716",
    developerPhoneNumber2: "+63 949 924 8562",
    mincEmail: "inminc.pgin@gmail.com",
    mincPhoneNumber1: "+63 995 856 4729",
    mincPhoneNumber2: "+63 939 722 3025",

    appearance: {
      title: "Appearance",
      light: "Light",
      lightHint: "Best in daylight at the stop",
      dark: "Dark",
      darkHint: "Easier on the eyes at night",
      system: "Match phone",
      systemHint: "Follows your phone's dark mode",
      note: "The map, stop list, fares and alerts all switch together. Your choice stays on this phone.",
    },

    textSize: {
      title: "Text size",
      default: "Default",
      large: "Large",
      largest: "Largest",
      preview: "J-14 arrives at your stop in 4 min.",
    },

    help: "Help",
    account: "Account",

    getSupport: {
      title: "Get support",

      help: {
        title: "JEEP-IN help",

        helpYouWith: "WHAT CAN WE HELP YOU WITH?",
        helpYouWithContent: "Provides answers and support information for JEEP-IN users.",

        commonQuestions: "COMMON QUESTIONS",
        commonQuestionsContent: [
          "How do I see when my jeep is coming? - Pick your direction and stop. The map lists every live jeep with the minutes to your stop.",
          "What if a jeep location seems outdated? - The driver's phone might have lost signal. Its marker turns hollow and the arrival time is hidden until it updates.",
          "Why don't I see jeeps going the other way? - Only jeeps in your direction show up. Tap the direction at the top of the map to switch.",
        ],

        reportsTechnicalIssues: "REPORTS & TECHNICAL ISSUES",
        reportsTechnicalIssuesContent:
          "If you experience bugs or incorrect location data, please contact the JEEP-IN support under the Contact Us setting.",
      },

      contactUs: {
        title: "Contact us",

        getInTouch: "GET IN TOUCH WITH US",
        getInTouchContent:
          "We're here to help you with feedback, suggestions, or partnership inquiries.",

        support: "SUPPORT",
        supportContent: "For technical issues or commuter feedback:",

        operations: "Operations",
        operationsContent: "For concerns about jeepney schedules, stop points or fares:",
      },
    },

    about: {
      title: "About JEEP-IN",

      loveSection: "LOVE JEEP-IN?",
      likeFb: {
        title: "Like on facebook",
        content: "https://www.facebook.com/profile.php?id=61584186487730",
      },
      share: {
        title: "Share with friends",
        content:
          "Check out JEEP-IN — the modern jeepney tracking app for Ilocos Norte! Track jeeps, stops, routes, and more. \n\nDownload or visit: https://jeep-in.framer.website",
      },
      visit: {
        title: "Visit our page",
        content: "https://jeep-in.framer.website",
      },

      legalSection: "LEGAL",
      dataAttribution: {
        title: "Data attribution",
        content: [
          "Map and location data provided by Mapbox and OpenStreetMap contributors.",
          "Stop point and jeepney route information are curated by JEEP-IN and the Metro Ilocos Norte Council (MINC).",
        ],
      },
      privacyPolicy: {
        title: "Privacy policy",
        content: [
          "JEEP-IN respects your privacy.",
          "Your location stays on your phone. Drivers and operators never see where you are.",
          "We do not share your personal information with third parties.",
          "For questions, contact jeepin.official@gmail.com.",
        ],
      },
    },

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

  // Errors / Feedback
  errors: {
    notFound: "Page not found",
    notFoundDescription: "The screen you're looking for doesn't exist or has been moved.",
    generic: "Something went wrong. Please try again.",
  },
};

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * Copy shared by the commuter apps, worded as in the native app. Each app spreads
 * this into its own STRINGS and adds or overrides what differs on its platform.
 */
export const commuterStrings = {
  // General
  general: {
    appName: "JEEP-IN",
    goBack: "Go back",
    apply: "Apply",
    cancel: "Cancel",
    comingSoon: "Coming soon… Feature under development.",
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
      stop: "Stop",
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
      nearAt: (stop: string, clock: string) => `Near ${stop} at ${clock}`,
      seenAt: (clock: string) => `Last seen at ${clock}`,
      nextStop: (stop: string) => `Next stop ${stop}`,
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
      hereNow: (unit: string) => `${unit} is here now`,
      between: (from: string, to: string) => `between ${from} and ${to}`,
      before: (stop: string) => `before ${stop}`,
      live: "live",
      yourStop: "your boarding stop",
      endOfRoute: "end of route",
      onRoute: "On route",
      arriving: "Arriving",
      passedPill: "Passed your stop",
      offRoutePill: "Off route",
      alerts: "Alerts",
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
      forTrip: (km: string) => `for ${km}`,
      pickStops: "Pick where you board and get off",
      discountLabel: (pct: number) => `Student / senior · ${pct}% off`,
      youdPay: (fare: string) => `You'd pay ${fare} · bring your ID`,
      regularIs: (fare: string) => `Regular fare is ${fare}`,
      everyStop: "Fares to every stop",
      everyStopHint: "Official LTFRB matrix · regular and discounted",
      everyStopPlaceholder: "Placeholder rates until the LTFRB order is posted",
      pickerBoarding: "Where do you board?",
      pickerAlighting: "Where do you get off?",
      fromStop: (stop: string) => `from ${stop}`,
    },

    matrix: {
      title: "Approved fare matrix",
      source: "Source",
      subtitle: (route: string, vehicleClass: string) => `${route} · ${vehicleClass.toLowerCase()}`,
      orderNo: "Order / case no.",
      issuedBy: "Issuing office",
      route: "Route",
      effective: "Effective date",
      vehicleClass: "Vehicle class",
      lastSynced: "Last synced",
      notPosted: "Not posted yet",
      synced: "Synced from the posted order. The app never sets its own rates.",
      placeholder:
        "Placeholder rates until the posted order is added. The app never sets its own rates.",
      howComputed: "How it's computed",
      baseFare: (km: number) => `Base fare, first ${km} km`,
      perKm: "Each succeeding km",
      discount: "Student / senior / PWD",
      rounding: "Rounding",
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
    },

    help: "Help",

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
  },

  // Errors / Feedback
  errors: {
    notFound: "Page not found",
    notFoundDescription: "The screen you're looking for doesn't exist or has been moved.",
    generic: "Something went wrong. Please try again.",
  },
};

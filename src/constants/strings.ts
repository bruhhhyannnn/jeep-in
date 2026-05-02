export const STRINGS = {
  // General
  general: {
    appName: "JEEP-IN",
    goBack: "Go back",
    apply: "Apply",
    comingSoon: "Coming soon… Feature under development.",
  },

  // Onboarding - Section
  onboarding: {
    welcome: {
      skip: "Skip",
      next: "Next",
      getStarted: "Get started",
    },

    roleSelection: {
      title: "Welcome to JEEP-IN",
      subtitle: "Select how you want to use the app. Continue as…",
      commuter: "😃 Commuter",
      operator: "🤓 Operator",
    },
  },

  // Auth - Section
  auth: {
    title: "Sign In to JEEP-IN",
    email: "Email",
    password: "Password",
    emailPasswordRequired: "Both email and password are required.",
    userNotFound: "User not found.",
    accountNotAllowed: "This account is not allowed to sign in.",
    invalidCredentials: "Invalid credentials or network error.",
    signIn: "Sign in",
    signingIn: "Signing in...",
  },

  // Commuter — Section
  commuter: {
    locationPermissionRequired: "Location permission is required.",
    gettingYourLocation: "Getting your location…",

    home: {
      filterRoutes: "Filter routes",
      searchInput: "Where are you going?",
      nearJeeps: "Nearby jeeps",
      nearStops: "Nearby stops",
      noJeepsFound: "No jeeps active",
      noStopsFound: "No stops found",
    },

    jeepneyScreen: {
      title: "Jeepney info",
      lastStop: "LAST STOP",
      nextStop: "NEXT STOP",
      getEta: "Get ETA",
    },

    stopPointScreen: {
      title: "Stop point info",
      address: "Address",
      getDirections: "Get Directions",
    },

    etaJeepneyScreen: {
      title: "ETA jeepney info",
      arrivingIn: "Arriving in —",
      from: "FROM",
      to: "JEEPNEY LOCATION",
      footer: "You can now proceed to your nearest stop point and wait for the jeepney to arrive.",
    },

    etaStopPointScreen: {
      title: "ETA stop point info",
      arrivingIn: "Arriving in —",
      from: "FROM",
      to: "TO",
      footer: "You can use the directions to walk to the stop point.",
    },
  },

  // Settings — Section
  settings: {
    helpInfo: "Help information",
    jeepinEmail: "jeepin.official@gmail.com",
    jeepinEmailSubject: "JEEP-IN Support Request",
    developerEmail: "mangapit.bryan@gmail.com",
    developerPhoneNumber1: "+63 918 217 8716",
    developerPhoneNumber2: "+63 949 924 8562",
    mincEmail: "inminc.pgin@gmail.com",
    mincPhoneNumber1: "+63 995 856 4729",
    mincPhoneNumber2: "+63 939 722 3025",

    hello: "Hello",
    since: "Since",
    gettingAround: "Getting around",
    preferences: "Preferences",
    helpCenter: "Help center",

    stopPoints: {
      title: "Stop points",

      allStopPoints: "ALL STOP POINTS",
      loadingStopPoints: "Loading stop points...",

      helpStopPoint: {
        title: "Help | Stop points",

        whatItDo: "WHAT'S IT DO?",
        whatItDoContent:
          "Provides a list of stop points or pickup points of commonly known PUV stops.",

        concernsComplaints: "CONCERNS OR COMPLAINTS?",
        concernsComplaintsContent: "Contact the JEEP-IN team hotline or email address.",
      },
    },

    fareGuide: {
      title: "Fare guide",
      jeepneyFareMatrix: "JEEPNEY FARE MATRIX",
      jeepneyFareMatrixContent:
        "A detailed table showing the fare rates per landmark for regular and discounted passengers across different routes.",
      footer:
        "Land Transportation Franchising and Regulatory Board (LTFRB) Fare Guide Matrix effective April 21, 2025.",

      helpFareGuide: {
        title: "Help | Fare guide",

        whatItDo: "WHAT'S IT DO?",
        whatItDoContent:
          "Provides a list of stop points or pickup points of commonly known PUV stops.",

        fareCategory: "FARE CATEGORIES",
        fareCategoryContent: [
          "Regular Fare: Standard fare for all passengers.",
          "Student, PWD, Senior Citizen Fare: Discounted rate (must have a present valid ID).",
        ],

        concernsComplaints: "CONCERNS OR COMPLAINTS?",
        concernsComplaintsContent: "Contact the MINC hotline or email address.",
      },
    },

    settingsAccessibility: {
      title: "Settings & accessibility",

      // TODO: revalidate these if feasible
      // language: "App Language",
      // notifications: "Notifications",
      // dataSaver: "Data Saver Mode",
      // textSize: "Text Size",
      // contrast: "High Contrast Mode",
      // voiceAssist: "Voice Assistance",
    },

    themesAvatar: {
      title: "Themes & avatar",

      nickname: {
        title: "Nickname",
        appNickname: "APP NICKNAME",
      },

      appearance: {
        title: "Appearance",
        themeOptions: "THEME OPTIONS",
      },
    },

    getSupport: {
      title: "Get support",

      help: {
        title: "JEEP-IN help",

        helpYouWith: "WHAT CAN WE HELP YOU WITH?",
        helpYouWithContent: "Provides answers and support information for JEEP-IN users.",

        commonQuestions: "COMMON QUESTIONS",
        commonQuestionsContent: [
          "How can I track a modern jeepney? - You can view live jeepney locations and routes from the home screen map.",
          "What if a jeepney location seems outdated? - The driver's device might have lost signal. Try refreshing or checking again later.",
          "Why do some stops not appear? - They may belong to another route filter. Use the filter button to show other routes. ",
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
        operationsContent: "For concerns about jeepney schedules or stop points:",
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
          "🚐 Check out JEEP-IN — the modern jeepney tracking app for Ilocos Norte! Track jeeps, stops, routes, and more. \n\nDownload or visit: https://jeep-in.framer.website",
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
          "We do not share your personal information with third parties.",
          "For questions, contact jeepin.official@gmail.com.",
        ],
      },
    },

    logout: {
      changeRole: "Change role",

      title: "Are you sure you want to logout?",
      cancel: "Cancel",
      logout: "Logout",
    },
  },

  // Driver - Section
  driver: {
    home: {
      trackingStatus: "TRACKING STATUS",
      waitingForJeepneyAssignment: "Waiting for jeepney assignment.",
      trackingIsOn: "Tracking is ON",
      trackingIsOff: "Tracking is OFF",

      startTracking: "Start tracking",
      stopTracking: "Stop tracking",

      drivingInfo: "Driving info",
      signedInAs: "Signed in as: ",
      jeepneyAssigned: "Jeepney assigned: ",
      loadingUser: "Loading user...",
    },
  },

  // Components
  components: {
    card: {
      yourLocation: "Your Location",
    },
  },

  // Errors / Feedback
  errors: {
    notFound: "404 — Page Not Found",
    notFoundDescription: "Oops! The screen you're looking for doesn't exist or has been moved.",
    generic: "Something went wrong. Please try again.",
  },
};

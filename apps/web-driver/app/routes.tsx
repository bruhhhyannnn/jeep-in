import { createBrowserRouter } from "react-router";
import { bindRouter } from "@/lib/router";
import RootLayout from "./_layout";
import RootScreen from "./index";
import NotFoundScreen from "./+not-found";
import LoginScreen from "./(auth)/login";
import DriverLayout from "./driver/_layout";
import GpsTab from "./driver/gps";
import DirectionTab from "./driver/direction";
import ReportTab from "./driver/report";
import ProfileTab from "./driver/profile";
import DisplayScreen from "./driver/display";

// The native app's driver file routes, wired by hand, at the same paths.
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <RootScreen /> },
      { path: "login", element: <LoginScreen /> },
      {
        path: "driver",
        element: <DriverLayout />,
        children: [
          { path: "gps", element: <GpsTab /> },
          { path: "direction", element: <DirectionTab /> },
          { path: "report", element: <ReportTab /> },
          { path: "profile", element: <ProfileTab /> },
          { path: "display", element: <DisplayScreen /> },
        ],
      },
      { path: "*", element: <NotFoundScreen /> },
    ],
  },
]);

bindRouter(router);

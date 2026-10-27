import { createBrowserRouter, type RouteObject } from "react-router";
import { bindRouter } from "@/lib/router";
import RootLayout from "./_layout";
import RootScreen from "./index";
import NotFoundScreen from "./+not-found";
import MapGroupLayout from "./(map)/_layout";
import CommuterLayout from "./(map)/(commuter)/_layout";
import MapTab from "./(map)/(commuter)/home/index";
import StopsTab from "./(map)/(commuter)/stops/index";
import FareTab from "./(map)/(commuter)/fare/index";
import AlertsTab from "./(map)/(commuter)/alerts/index";
import DirectionSheet from "./(map)/(commuter)/direction";
import FareMatrixSheet from "./(map)/(commuter)/fare-matrix";
import JeepneyDetail from "./(map)/(commuter)/jeepney/[id]";
import StopDetail from "./(map)/(commuter)/stop/[id]";

// The native app's file routes, wired by hand. URLs match what expo-router
// produces on the web (route groups don't appear in the path).

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: "dev/ui-kit",
        lazy: async () => ({ Component: (await import("./dev/ui-kit")).default }),
        HydrateFallback: () => null,
      },
    ]
  : [];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <RootScreen /> },
      {
        element: <MapGroupLayout />,
        children: [
          {
            element: <CommuterLayout />,
            children: [
              { path: "home", element: <MapTab /> },
              { path: "stops", element: <StopsTab /> },
              { path: "fare", element: <FareTab /> },
              { path: "alerts", element: <AlertsTab /> },
              { path: "direction", element: <DirectionSheet /> },
              { path: "fare-matrix", element: <FareMatrixSheet /> },
              { path: "jeepney/:id", element: <JeepneyDetail /> },
              { path: "stop/:id", element: <StopDetail /> },
            ],
          },
        ],
      },
      ...devRoutes,
      { path: "*", element: <NotFoundScreen /> },
    ],
  },
]);

bindRouter(router);

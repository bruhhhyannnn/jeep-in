import { createBrowserRouter, type RouteObject } from "react-router";
import { bindRouter } from "@/lib/router";
import RootLayout from "./_layout";
import RootScreen from "./index";
import NotFoundScreen from "./+not-found";

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
      ...devRoutes,
      { path: "*", element: <NotFoundScreen /> },
    ],
  },
]);

bindRouter(router);

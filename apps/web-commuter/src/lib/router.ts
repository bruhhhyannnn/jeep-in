import { useLocation, useParams, type createBrowserRouter } from "react-router";
import { ROUTES } from "@/constants/routes";

type Router = ReturnType<typeof createBrowserRouter>;

let instance: Router | null = null;

/** Called once by app/routes.tsx. */
export function bindRouter(router: Router) {
  instance = router;
}

/** True when the browser has an earlier JEEP-IN page to go back to. */
const hasHistory = () => ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0;

/**
 * expo-router's imperative `router`, so screens navigate as they do in the
 * native app. `back()` goes to the map when the page was opened directly
 * (a shared link or a refresh) and there is nothing to go back to.
 */
export const router = {
  push: (href: string) => void instance?.navigate(href),
  navigate: (href: string) => void instance?.navigate(href),
  replace: (href: string) => void instance?.navigate(href, { replace: true }),
  back: () => {
    if (hasHistory()) void instance?.navigate(-1);
    else void instance?.navigate(ROUTES.commuter.home, { replace: true });
  },
};

/** expo-router's usePathname. */
export const usePathname = () => useLocation().pathname;

/** expo-router's useLocalSearchParams for path params such as `/stop/:id`. */
export function useLocalSearchParams<T extends Record<string, string>>() {
  return useParams() as Partial<T> as T;
}

import "./global.css";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePreferences } from "@/store";
import { useFonts } from "@/hooks/useFonts";
import { fonts } from "@/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const persistedStores = [usePreferences];
const allHydrated = () => persistedStores.every((s) => s.persist.hasHydrated());

/** Saved preferences, alerts and the offline copy load before the first screen. */
function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(allHydrated);

  useEffect(() => {
    const check = () => setHydrated(allHydrated());
    const unsubscribes = persistedStores.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubscribes.forEach((u) => u());
  }, []);

  return hydrated;
}

/** Fades out the splash drawn by index.html. */
function hideSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  splash.classList.add("hidden");
  window.setTimeout(() => splash.remove(), 250);
}

export default function RootLayout() {
  const hydrated = useStoresHydrated();
  const [fontsLoaded] = useFonts([
    fonts.regular,
    fonts.medium,
    fonts.semibold,
    fonts.bold,
    fonts.moment,
    fonts.mono,
    fonts.monoBold,
  ]);
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) hideSplash();
  }, [ready]);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster
        position="top-center"
        offset={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
        mobileOffset={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              "flex w-full items-center gap-3 rounded-tile border-[1.5px] border-line bg-card px-4 py-3 shadow-md",
            title: "font-puffin-semibold text-[15px] leading-5 text-ink",
            icon: "shrink-0",
            success: "[&_[data-icon]]:text-live",
            error: "[&_[data-icon]]:text-danger",
            info: "[&_[data-icon]]:text-action",
          },
        }}
      />
    </QueryClientProvider>
  );
}

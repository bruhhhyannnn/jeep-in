import { useEffect, useRef, useState } from "react";
import { ROUTES, STRINGS } from "@/constants";
import { useTransit } from "@/hooks";
import { router } from "@/lib/router";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/store";
import { fixedRole, layout, setThemeColorOverride, useTheme } from "@/theme";
import { Pressable, RadioCard, Spinner, ThemedText, View } from "@/components/ui";
import { FareArt, LiveMapArt } from "@/components/onboarding/Illustrations";

/** Each slide has its own colour, and the same colour in dark mode. */
const SLIDE_THEMES = [
  {
    // Navy
    bg: "bg-navy-900",
    skip: "text-navy-300",
    title: "text-white",
    body: "text-navy-200",
    dot: "bg-navy-500",
    dotOn: "bg-yellow-400",
    button: "bg-yellow-400",
    buttonText: "text-navy-950",
    statusBar: "#11305a",
  },
  {
    // Blue
    bg: "bg-blue-600",
    skip: "text-blue-200",
    title: "text-white",
    body: "text-blue-100",
    dot: "bg-blue-400",
    dotOn: "bg-white",
    button: "bg-white",
    buttonText: "text-blue-600",
    statusBar: "#1670e0",
  },
  {
    // Yellow
    bg: "bg-yellow-400",
    skip: "text-yellow-800",
    title: "text-navy-950",
    body: "text-yellow-800",
    dot: "bg-yellow-600",
    dotOn: "bg-navy-950",
    button: "bg-navy-950",
    buttonText: "text-white",
    statusBar: "#ffc62e",
  },
] as const;

/** Real directions from the route, so the pick on this slide is the one the map uses. */
function DirectionArt() {
  const { colors } = useTheme();
  const transit = useTransit();
  const directionId = usePreferences((s) => s.directionId);
  const setDirection = usePreferences((s) => s.setDirection);
  const t = STRINGS.commuter.onboarding.direction;

  return (
    <View className="flex-1 justify-center gap-2.5 bg-page p-4">
      {transit.route && (
        <ThemedText variant="eyebrow" tone="muted" className="px-1">
          {transit.route.name}
        </ThemedText>
      )}
      {transit.directions.length ? (
        <View accessibilityRole="radiogroup" accessibilityLabel={t.title} className="gap-2.5">
          {transit.directions.map((d) => (
            <RadioCard
              key={d.id}
              title={d.label}
              hint={d.via.length ? d.via.join(" → ") : undefined}
              selected={(directionId ?? transit.direction?.id) === d.id}
              onPress={() => setDirection(d.id)}
            />
          ))}
        </View>
      ) : (
        <View className="items-center gap-2 py-6">
          {transit.loading && <Spinner color={colors.action} />}
          <ThemedText variant="small" tone="muted">
            {t.loading}
          </ThemedText>
        </View>
      )}
      <ThemedText variant="small" tone="muted" className="px-1">
        {t.remember}
      </ThemedText>
    </View>
  );
}

/** Three slides, one idea each. Skip on the first two; the last button starts the app. */
export default function WelcomeScreen() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const transit = useTransit();
  const t = STRINGS.commuter.onboarding;

  const slides = [
    {
      key: "live",
      title: t.live.title,
      body: t.live.body(transit.route?.name ?? STRINGS.commuter.routeFallback),
      art: <LiveMapArt />,
    },
    { key: "direction", title: t.direction.title, body: t.direction.body, art: <DirectionArt /> },
    {
      key: "fare",
      title: t.fare.title,
      body: t.fare.body,
      art: <FareArt matrix={transit.fareMatrix} />,
    },
  ];
  const last = index === slides.length - 1;
  const theme = SLIDE_THEMES[index];

  // The browser's status bar takes the slide colour (expo-status-bar natively).
  useEffect(() => {
    setThemeColorOverride(theme.statusBar);
  }, [theme.statusBar]);
  useEffect(() => () => setThemeColorOverride(null), []);

  // The page shown once a swipe settles (onMomentumScrollEnd natively).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timer: number | undefined;
    const settle = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toLocation = () => router.replace(ROUTES.onboarding.location);
  const next = () => {
    const el = scrollRef.current;
    if (last) toLocation();
    else el?.scrollTo({ left: (index + 1) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <View
      className={cn(
        "flex-1 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] transition-colors duration-300",
        theme.bg,
      )}
    >
      <View
        style={{ maxWidth: layout.contentMaxWidth }}
        className="h-14 w-full flex-row items-center justify-end self-center px-3"
      >
        {!last && (
          <Pressable
            onPress={toLocation}
            accessibilityRole="button"
            hitSlop={8}
            className="h-12 justify-center px-3"
          >
            <span style={fixedRole("strong")} className={theme.skip}>
              {t.skip}
            </span>
          </Pressable>
        )}
      </View>

      <div
        ref={scrollRef}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
      >
        {slides.map((slide, i) => {
          const own = SLIDE_THEMES[i];
          return (
            <View
              key={slide.key}
              inert={i !== index}
              className={cn("w-full shrink-0 snap-start items-center px-5 pb-2", own.bg)}
            >
              <View style={{ maxWidth: layout.contentMaxWidth }} className="w-full flex-1 gap-6">
                <View className="flex-1 overflow-hidden rounded-[26px]">{slide.art}</View>
                <View className="gap-2">
                  <h1
                    style={{ ...fixedRole("momentMd"), letterSpacing: -0.3 }}
                    className={own.title}
                  >
                    {slide.title}
                  </h1>
                  <p style={fixedRole("body")} className={own.body}>
                    {slide.body}
                  </p>
                </View>
              </View>
            </View>
          );
        })}
      </div>

      <View
        style={{ maxWidth: layout.contentMaxWidth }}
        className="w-full flex-row items-center gap-3.5 self-center px-5 pb-4 pt-5"
      >
        <View
          className="flex-row gap-1.5"
          accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}
        >
          {slides.map((s, i) => (
            <View
              key={s.key}
              className={cn(
                "h-2 rounded-full transition-all duration-200",
                i === index ? cn("w-6", theme.dotOn) : cn("w-2", theme.dot),
              )}
            />
          ))}
        </View>
        <Pressable
          onPress={next}
          accessibilityRole="button"
          className={cn(
            "h-[54px] flex-1 items-center justify-center rounded-full active:opacity-90",
            theme.button,
          )}
        >
          <span style={fixedRole("button")} className={theme.buttonText}>
            {last ? t.start : t.next}
          </span>
        </Pressable>
      </View>
    </View>
  );
}

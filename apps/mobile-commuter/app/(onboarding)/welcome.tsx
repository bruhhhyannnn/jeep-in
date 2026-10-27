import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROUTES, STRINGS } from "@/constants";
import { useTransit } from "@/hooks";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/store";
import { typeRoles, useTheme } from "@/theme";
import { RadioCard, ThemedText } from "@/components/ui";
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
    statusBar: "light",
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
    statusBar: "light",
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
    statusBar: "dark",
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
        transit.directions.map((d) => (
          <RadioCard
            key={d.id}
            title={d.label}
            hint={d.via.length ? d.via.join(" → ") : undefined}
            selected={(directionId ?? transit.direction?.id) === d.id}
            onPress={() => setDirection(d.id)}
          />
        ))
      ) : (
        <View className="items-center gap-2 py-6">
          {transit.loading && <ActivityIndicator color={colors.action} />}
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
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
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

  const toLocation = () => router.replace(ROUTES.onboarding.location);
  const next = () => {
    if (last) toLocation();
    else scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  return (
    <SafeAreaView edges={["top", "left", "right", "bottom"]} className={cn("flex-1", theme.bg)}>
      <StatusBar style={theme.statusBar} />
      <View className="h-14 flex-row items-center justify-end px-3">
        {!last && (
          <Pressable
            onPress={toLocation}
            accessibilityRole="button"
            hitSlop={8}
            className="h-12 justify-center px-3"
          >
            <Text maxFontSizeMultiplier={1.4} style={typeRoles.strong} className={theme.skip}>
              {t.skip}
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        className="flex-1"
      >
        {slides.map((slide, i) => {
          const own = SLIDE_THEMES[i];
          return (
            <View
              key={slide.key}
              style={{ width, height: pageHeight }}
              className={cn("gap-6 px-5 pb-2", own.bg)}
            >
              <View className="flex-1 overflow-hidden rounded-[26px]">{slide.art}</View>
              <View className="gap-2">
                <Text
                  accessibilityRole="header"
                  maxFontSizeMultiplier={1.4}
                  style={[typeRoles.momentMd, { letterSpacing: -0.3 }]}
                  className={own.title}
                >
                  {slide.title}
                </Text>
                <Text maxFontSizeMultiplier={1.6} style={typeRoles.body} className={own.body}>
                  {slide.body}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className="flex-row items-center gap-3.5 px-5 pb-4 pt-5">
        <View
          className="flex-row gap-1.5"
          accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}
        >
          {slides.map((s, i) => (
            <View
              key={s.key}
              className={cn(
                "h-2 rounded-full",
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
          <Text maxFontSizeMultiplier={1.4} style={typeRoles.button} className={theme.buttonText}>
            {last ? t.start : t.next}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { ROUTES, STRINGS } from "@/constants";
import { useTransit } from "@/hooks";
import { cn } from "@/lib/utils";
import { usePreferences } from "@/store";
import { useTheme } from "@/theme";
import { Button, RadioCard, SafeAreaContainer, ThemedText } from "@/components/ui";
import { FareArt, LiveMapArt } from "@/components/onboarding/Illustrations";

/** Real directions from the route, so the pick on this slide is the one the map uses. */
function DirectionArt() {
  const { colors } = useTheme();
  const transit = useTransit();
  const directionId = usePreferences((s) => s.directionId);
  const setDirection = usePreferences((s) => s.setDirection);
  const t = STRINGS.commuter.onboarding.direction;

  return (
    <View className="flex-1 justify-center gap-3 bg-page p-4">
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

  const toLocation = () => router.replace(ROUTES.onboarding.location);
  const next = () => {
    if (last) toLocation();
    else scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  return (
    <SafeAreaContainer showPadding={false}>
      <View className="h-14 flex-row items-center justify-end px-3">
        {!last && <Button label={t.skip} variant="ghost" size="sm" onPress={toLocation} />}
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
        {slides.map((slide) => (
          <View key={slide.key} style={{ width, height: pageHeight }} className="gap-6 px-5 pb-2">
            <View className="flex-1 overflow-hidden rounded-card border-[1.5px] border-line">
              {slide.art}
            </View>
            <View className="gap-2">
              <ThemedText variant="title" accessibilityRole="header">
                {slide.title}
              </ThemedText>
              <ThemedText tone="muted">{slide.body}</ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center gap-4 px-5 pb-4 pt-5">
        <View
          className="flex-row gap-1.5"
          accessibilityLabel={`Slide ${index + 1} of ${slides.length}`}
        >
          {slides.map((s, i) => (
            <View
              key={s.key}
              className={cn(
                "h-2 rounded-full",
                i === index ? "w-6 bg-action" : "w-2 bg-line-strong",
              )}
            />
          ))}
        </View>
        <View className="flex-1">
          <Button label={last ? t.start : t.next} onPress={next} />
        </View>
      </View>
    </SafeAreaContainer>
  );
}

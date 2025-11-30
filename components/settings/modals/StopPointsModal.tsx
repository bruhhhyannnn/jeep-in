import { useStopsList } from "@/hooks";
import { STRINGS } from "@/constants";
import { callNumber, sendEmail } from "@/lib/linkActions";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { StopCard } from "@/components/card";
import { router } from "expo-router";
import { BottomSheetModalBaseRef } from "@/types";
import SettingsModalCard from "@/components/settings/modals/SettingsModalCard";

const StopPointsModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "help">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={
        view === "default"
          ? STRINGS.settings.stopPoints.title
          : STRINGS.settings.stopPoints.helpStopPoint.title
      }
      ref={baseRef}
    >
      {view === "default" ? (
        <DefaultStopPointsView onHelp={() => setView("help")} />
      ) : (
        <HelpStopPointsView onBack={() => setView("default")} />
      )}
    </BottomSheetModalBase>
  );
});

export default StopPointsModal;

// Default View
function DefaultStopPointsView({ onHelp }: { onHelp: () => void }) {
  const stops = useStopsList();

  return (
    <View className="gap-4">
      {/* Stop Points Section */}
      <View className="gap-2">
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.stopPoints.allStopPoints}
        </ThemedText>

        <View className="gap-2">
          {stops.length === 0 ? (
            <ThemedText color="text_muted">
              {STRINGS.settings.stopPoints.loadingStopPoints}
            </ThemedText>
          ) : (
            stops.map((s) => (
              <StopCard
                key={s.id}
                location={s.landmark_name}
                address={s.address}
                onPress={() =>
                  router.push({
                    pathname: "/(map)/stop/[id]",
                    params: {
                      id: s.id,
                      name: s.name,
                      landmark_name: s.landmark_name,
                      address: s.address,
                      route_id: s.route_id,
                      lat: String(s.latitude),
                      lng: String(s.longitude),
                    },
                  })
                }
              />
            ))
          )}
        </View>
      </View>

      {/* Button help information */}
      <View className="self-start">
        <ButtonText
          label={STRINGS.settings.helpInfo}
          variant="secondary"
          iconName="information-circle-outline"
          onPress={onHelp}
        />
      </View>
    </View>
  );
}

// Help Info View
function HelpStopPointsView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      {/* What's It Do Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.stopPoints.helpStopPoint.whatItDo}
        </ThemedText>
        <ThemedText color="text_muted">
          {STRINGS.settings.stopPoints.helpStopPoint.whatItDoContent}
        </ThemedText>
      </View>

      {/* Concern or Complaints Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.stopPoints.helpStopPoint.concernsComplaints}
        </ThemedText>
        <ThemedText color="text_muted">
          {STRINGS.settings.stopPoints.helpStopPoint.concernsComplaintsContent}
        </ThemedText>

        {/* Contact Cards */}
        <View className="mt-1 gap-2">
          <SettingsModalCard
            label={STRINGS.settings.developerPhoneNumber1}
            iconName="call-outline"
            onPress={() => callNumber(STRINGS.settings.developerPhoneNumber1.trim())}
          />
          <SettingsModalCard
            label={STRINGS.settings.developerPhoneNumber2}
            iconName="call-outline"
            onPress={() => callNumber(STRINGS.settings.developerPhoneNumber2.trim())}
          />
          <SettingsModalCard
            label={STRINGS.settings.jeepinEmail}
            iconName="mail-outline"
            onPress={() =>
              sendEmail(STRINGS.settings.jeepinEmail, STRINGS.settings.jeepinEmailSubject)
            }
          />
          <SettingsModalCard
            label={STRINGS.settings.developerEmail}
            iconName="mail-outline"
            onPress={() =>
              sendEmail(STRINGS.settings.developerEmail, STRINGS.settings.jeepinEmailSubject)
            }
          />
        </View>
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

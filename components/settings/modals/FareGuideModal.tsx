import { STRINGS } from "@/constants";
import { callNumber, sendEmail } from "@/lib/linkActions";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/ui";
import SettingsModalCard from "@/components/settings/modals/SettingsModalCard";
import { BottomSheetModalBaseRef } from "@/types";

const FareGuideModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
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
          ? STRINGS.settings.fareGuide.title
          : STRINGS.settings.fareGuide.helpFareGuide.title
      }
      ref={baseRef}
    >
      {view === "default" ? (
        <DefaultFareGuideView onHelp={() => setView("help")} />
      ) : (
        <HelpFareGuideView onBack={() => setView("default")} />
      )}
    </BottomSheetModalBase>
  );
});

export default FareGuideModal;

// Default View
function DefaultFareGuideView({ onHelp }: { onHelp: () => void }) {
  // TODO: Get actual fare matrix table here someday
  const data = [
    {
      id: 1,
      landmark: "Newton",
      distance: "0",
      regular: "P 14.00",
      discounted: "P 11.25",
    },
    {
      id: 2,
      landmark: "Tupec Bridge",
      distance: "1",
      regular: "P 14.00",
      discounted: "P 11.25",
    },
    {
      id: 3,
      landmark: "Tupec Bridge",
      distance: "2",
      regular: "P 14.00",
      discounted: "P 11.25",
    },
    {
      id: 4,
      landmark: "Tupec Bridge",
      distance: "3",
      regular: "P 14.00",
      discounted: "P 11.25",
    },
  ];

  return (
    <View className="gap-4">
      <View className="gap-2">
        <View>
          <ThemedText variant="h500" className="uppercase">
            {STRINGS.settings.fareGuide.jeepneyFareMatrix}
          </ThemedText>
          <ThemedText color="text_muted">
            {STRINGS.settings.fareGuide.jeepneyFareMatrixContent}
          </ThemedText>
        </View>

        {/* Fare Matrix Table */}
        <View className="overflow-hidden rounded-2xl">
          {/* Table Header */}
          <View className="flex-row items-center justify-center bg-dodger-blue-600 px-2 py-4 dark:bg-dodger-blue-800">
            <ThemedText color="default_blue" className="flex-1 text-center">
              Landmark
            </ThemedText>
            <ThemedText color="default_blue" className="flex-1 text-center">
              Distance (km)
            </ThemedText>
            <ThemedText color="default_blue" className="flex-1 text-center">
              Regular
            </ThemedText>
            <ThemedText color="default_blue" className="flex-1 text-center">
              Student, PWD, Senior Citizen
            </ThemedText>
          </View>
          {/* Table Body */}
          {data.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row px-2 py-2 ${
                index % 2 === 0
                  ? "bg-dodger-blue-500 dark:dark:bg-dodger-blue-700"
                  : "bg-dodger-blue-500/80 dark:dark:bg-dodger-blue-700/80"
              }`}
            >
              <ThemedText color="default_blue" className="flex-1 text-center">
                {item.landmark}
              </ThemedText>
              <ThemedText color="default_blue" className="flex-1 text-center">
                {item.distance}
              </ThemedText>
              <ThemedText color="default_blue" className="flex-1 text-center">
                {item.regular}
              </ThemedText>
              <ThemedText color="default_blue" className="flex-1 text-center">
                {item.discounted}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Footer Text */}
        <ThemedText color="text_muted" className="text-center">
          {STRINGS.settings.fareGuide.footer}
        </ThemedText>
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
function HelpFareGuideView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      {/* What's It Do Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.fareGuide.helpFareGuide.whatItDo}
        </ThemedText>
        <ThemedText color="text_muted">
          {STRINGS.settings.fareGuide.helpFareGuide.whatItDoContent}
        </ThemedText>
      </View>

      {/* Fare Categories Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.fareGuide.helpFareGuide.fareCategory}
        </ThemedText>
        {STRINGS.settings.fareGuide.helpFareGuide.fareCategoryContent.map((text, i) => (
          <ThemedText key={i} color="text_muted">
            • {text}
          </ThemedText>
        ))}
      </View>

      {/* Concern or Complaints Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.fareGuide.helpFareGuide.concernsComplaints}
        </ThemedText>
        <ThemedText color="text_muted">
          {STRINGS.settings.fareGuide.helpFareGuide.concernsComplaintsContent}
        </ThemedText>

        {/* Contact Cards */}
        <View className="mt-1 gap-2">
          <SettingsModalCard
            label={STRINGS.settings.mincPhoneNumber1}
            iconName="call-outline"
            onPress={() => callNumber(STRINGS.settings.mincPhoneNumber1.trim())}
          />
          <SettingsModalCard
            label={STRINGS.settings.mincPhoneNumber2}
            iconName="call-outline"
            onPress={() => callNumber(STRINGS.settings.mincPhoneNumber2.trim())}
          />
          <SettingsModalCard
            label={STRINGS.settings.mincEmail}
            iconName="mail-outline"
            onPress={() => sendEmail(STRINGS.settings.mincEmail)}
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

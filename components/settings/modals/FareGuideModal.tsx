import { callNumber, sendEmail } from "@/lib/linkActions";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ThemedText, ButtonText } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/components/ui/BottomSheetModalBase";

export type FareGuideModalRef = {
  open: () => void;
  close: () => void;
};

const FareGuideModal = forwardRef<FareGuideModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "help">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={view === "default" ? "Fare Guide" : "Help | Fare Guide"}
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
            JEEPNEY FARE MATRIX
          </ThemedText>
          <ThemedText color="secondary">
            A detailed table showing the fare rates per landmark for regular and discounted
            passengers across different routes.
          </ThemedText>
        </View>

        {/* Fare Matrix Table */}
        <View className="overflow-hidden rounded-lg">
          {/* Table Header */}
          <View className="flex-row items-center justify-center bg-dodger-blue-600 px-2 py-4">
            <ThemedText color="primary" className="flex-1 text-center">
              Landmark
            </ThemedText>
            <ThemedText color="primary" className="flex-1 text-center">
              Distance (km)
            </ThemedText>
            <ThemedText color="primary" className="flex-1 text-center">
              Regular
            </ThemedText>
            <ThemedText color="primary" className="flex-1 text-center">
              Student, PWD, Senior Citizen
            </ThemedText>
          </View>
          {/* Table Body */}
          {data.map((item, index) => (
            <View
              key={item.id}
              className={`flex-row px-2 py-2 ${
                index % 2 === 0 ? "bg-dodger-blue-500" : "bg-dodger-blue-500/90"
              }`}
            >
              <ThemedText color="primary" className="flex-1 text-center">
                {item.landmark}
              </ThemedText>
              <ThemedText color="primary" className="flex-1 text-center">
                {item.distance}
              </ThemedText>
              <ThemedText color="primary" className="flex-1 text-center">
                {item.regular}
              </ThemedText>
              <ThemedText color="primary" className="flex-1 text-center">
                {item.discounted}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Footer Text */}
        <ThemedText color="secondary" className="text-center">
          Land Transportation Franchising and Regulatory Board (LTFRB) Fare Guide Matrix effective
          April 21, 2025.
        </ThemedText>
      </View>

      {/* Button help information */}
      <View className="self-start">
        <ButtonText
          label="Help Info"
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
          WHAT'S IT DO?
        </ThemedText>
        <ThemedText color="secondary">
          Provides updated jeepney fares for different routes and categories of passengers.
        </ThemedText>
      </View>

      {/* Fare Categories Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          FARE CATEGORIES
        </ThemedText>
        <ThemedText color="secondary">
          - Regular Fare: Standard fare for all passengers.{"\n"}- Student, PWD, Senior Citizen
          Fare: Discounted rate (must have a present valid ID).
        </ThemedText>
      </View>

      {/* Concern or Complaints Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          CONCERNS OR COMPLAINTS?
        </ThemedText>
        <ThemedText color="secondary">Contact the MINC hotline or email address.</ThemedText>

        {/* Contact Cards */}
        <View className="mt-1 gap-2">
          {/* TODO: all this information here should be in another data file */}
          <ButtonText
            label="+63 995 856 4729"
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber("+639958564729")}
          />
          <ButtonText
            label="+63 939 722 3025"
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber("+639397223025")}
          />
          <ButtonText
            label="inminc.pgin@gmail.com"
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail("inminc.pgin@gmail.com")}
          />
          <ButtonText
            label="attynikkilar.minc@gmail.com"
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail("attynikkilar.minc@gmail.com")}
          />
        </View>
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label="Go Back" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

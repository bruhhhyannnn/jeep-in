import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/components/ui/BottomSheetModalBase";
import { openWebsite } from "@/lib/linkActions";
import { Share, ToastAndroid, View } from "react-native";

export type AboutJeepInModalRef = {
  open: () => void;
  close: () => void;
};

const AboutJeepInModal = forwardRef<AboutJeepInModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "dataAttribution" | "privacyPolicy">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={
        view === "default"
          ? "About JEEP-IN"
          : view === "dataAttribution"
            ? "Data attribution"
            : "Privacy policy"
      }
      ref={baseRef}
    >
      {view === "default" ? (
        <DefaultAboutJeepInView
          onDataAttribution={() => setView("dataAttribution")}
          onPrivacyPolicy={() => setView("privacyPolicy")}
        />
      ) : view === "dataAttribution" ? (
        <DataAttributionView onBack={() => setView("default")} />
      ) : (
        <PrivacyPolicyView onBack={() => setView("default")} />
      )}
    </BottomSheetModalBase>
  );
});

export default AboutJeepInModal;

// Default View
function DefaultAboutJeepInView({
  onDataAttribution,
  onPrivacyPolicy,
}: {
  onDataAttribution: () => void;
  onPrivacyPolicy: () => void;
}) {
  const handleFacebook = () => openWebsite("https://facebook.com/jeepin.ilocos");
  const handleShare = async () => {
    const message =
      "🚐 Check out JEEP-IN — the modern jeepney tracking app for Ilocos Norte! Track routes, stops, and more. Download or visit: https://jeepin.ilocos.app";

    await Clipboard.setStringAsync(message);
    ToastAndroid.show("Copied to clipboard!", 2.0);
    await Share.share({ message });
  };
  const handleVisitPage = () => openWebsite("https://jeepin.ilocos.app");

  return (
    <View className="gap-4">
      {/* Love JEEP-IN Section */}
      <View className="gap-2">
        <ThemedText variant="h500" className="uppercase">
          Love JEEP-IN?
        </ThemedText>
        <ButtonText
          label="Like on facebook"
          variant="tertiary"
          iconName="thumbs-up-outline"
          showChevron
          fullWidth
          onPress={handleFacebook}
        />
        <ButtonText
          label="Share with friends"
          variant="tertiary"
          iconName="megaphone-outline"
          showChevron
          fullWidth
          onPress={handleShare}
        />
        <ButtonText
          label="Visit our page"
          variant="tertiary"
          iconName="document-text-outline"
          showChevron
          fullWidth
          onPress={handleVisitPage}
        />
      </View>

      {/* Legal Section */}
      <View className="gap-2">
        <ThemedText variant="h500" className="uppercase">
          LEGAL
        </ThemedText>
        <ButtonText
          label="Data Attribution"
          variant="tertiary"
          iconName="file-tray-full-outline"
          showChevron
          fullWidth
          onPress={onDataAttribution}
        />
        <ButtonText
          label="Privacy Policy"
          variant="tertiary"
          iconName="newspaper-outline"
          showChevron
          fullWidth
          onPress={onPrivacyPolicy}
        />
      </View>
    </View>
  );
}

// Data Attribution View
function DataAttributionView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      <ThemedText>
        - Map and location data provided by Mapbox and OpenStreetMap contributors.{"\n"}- Stop point
        and jeepney route information are curated by JEEP-IN and the Metro Ilocos Norte Council
        (MINC).
      </ThemedText>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label="Go Back" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

// Privacy Policy View
function PrivacyPolicyView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      <ThemedText>
        - JEEP-IN respects your privacy. Location data is used only to provide real-time tracking
        and commuting insights.{"\n"}- We do not share your personal information with third parties.
        {"\n"}- For questions, contact jeepin.official@gmail.com.
      </ThemedText>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label="Go Back" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

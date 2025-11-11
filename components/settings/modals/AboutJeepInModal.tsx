import { STRINGS } from "@/constants";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { openWebsite } from "@/lib/linkActions";
import { Share, ToastAndroid, View } from "react-native";
import { BottomSheetModalBaseRef } from "@/types";

const AboutJeepInModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
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
  const handleFacebook = () => openWebsite(STRINGS.settings.about.likeFb.content);
  const handleShare = async () => {
    const message = STRINGS.settings.about.share.content;

    await Clipboard.setStringAsync(message);
    ToastAndroid.show("Copied to clipboard!", 2.0);
    await Share.share({ message });
  };
  const handleVisitPage = () => openWebsite(STRINGS.settings.about.visit.content);

  return (
    <View className="gap-4">
      {/* Love JEEP-IN Section */}
      <View className="gap-2">
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.about.loveSection}
        </ThemedText>
        <ButtonText
          label={STRINGS.settings.about.likeFb.title}
          variant="tertiary"
          iconName="thumbs-up-outline"
          showChevron
          fullWidth
          onPress={handleFacebook}
        />
        <ButtonText
          label={STRINGS.settings.about.share.title}
          variant="tertiary"
          iconName="megaphone-outline"
          showChevron
          fullWidth
          onPress={handleShare}
        />
        <ButtonText
          label={STRINGS.settings.about.visit.title}
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
          {STRINGS.settings.about.legalSection}
        </ThemedText>
        <ButtonText
          label={STRINGS.settings.about.dataAttribution.title}
          variant="tertiary"
          iconName="file-tray-full-outline"
          showChevron
          fullWidth
          onPress={onDataAttribution}
        />
        <ButtonText
          label={STRINGS.settings.about.privacyPolicy.title}
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
      <View>
        {STRINGS.settings.about.dataAttribution.content.map((text, i) => (
          <ThemedText key={i}>• {text}</ThemedText>
        ))}
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

// Privacy Policy View
function PrivacyPolicyView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      <View>
        {STRINGS.settings.about.privacyPolicy.content.map((text, i) => (
          <ThemedText key={i}>• {text}</ThemedText>
        ))}
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

import { STRINGS } from "@/constants";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { openWebsite } from "@/lib/linkActions";
import { Share, ToastAndroid, View } from "react-native";
import { BottomSheetModalBaseRef } from "@/types";
import ButtonSettings from "@/components/settings/ButtonSettings";

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
          ? STRINGS.settings.about.title
          : view === "dataAttribution"
            ? STRINGS.settings.about.dataAttribution.title
            : STRINGS.settings.about.privacyPolicy.title
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
  // TODO: maybe make this as to the linkAction file someday
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
        <ButtonSettings
          label={STRINGS.settings.about.likeFb.title}
          iconName="thumbs-up-outline"
          onPress={handleFacebook}
        />
        <ButtonSettings
          label={STRINGS.settings.about.share.title}
          iconName="megaphone-outline"
          onPress={handleShare}
        />
        <ButtonSettings
          label={STRINGS.settings.about.visit.title}
          iconName="document-text-outline"
          onPress={handleVisitPage}
        />
      </View>

      {/* Legal Section */}
      <View className="gap-2">
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.about.legalSection}
        </ThemedText>
        <ButtonSettings
          label={STRINGS.settings.about.dataAttribution.title}
          iconName="file-tray-full-outline"
          onPress={onDataAttribution}
        />
        <ButtonSettings
          label={STRINGS.settings.about.privacyPolicy.title}
          iconName="newspaper-outline"
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

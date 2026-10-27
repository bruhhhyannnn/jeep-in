import { STRINGS } from "@/constants";
import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { BottomSheetModalBase, Button, ThemedText, View } from "@/components/ui";
import { showSuccess } from "@/services/ui/toasts";
import { openWebsite } from "@/utils";
import type { BottomSheetModalBaseRef } from "@/types";
import SettingsRow from "@/components/settings/SettingsRow";

export default function AboutJeepInModal({ ref }: { ref?: Ref<BottomSheetModalBaseRef> }) {
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
}

// Default View
function DefaultAboutJeepInView({
  onDataAttribution,
  onPrivacyPolicy,
}: {
  onDataAttribution: () => void;
  onPrivacyPolicy: () => void;
}) {
  const handleFacebook = () => openWebsite(STRINGS.settings.about.likeFb.content);
  // Copies the message, then opens the share sheet where the browser has one.
  const handleShare = async () => {
    const message = STRINGS.settings.about.share.content;

    try {
      await navigator.clipboard.writeText(message);
      showSuccess(STRINGS.web.copied);
    } catch (err) {
      console.warn("Copy failed:", err);
    }
    if (navigator.share) {
      // Cancelling the share sheet rejects; nothing to do then.
      await navigator.share({ text: message }).catch(() => {});
    }
  };
  const handleVisitPage = () => openWebsite(STRINGS.settings.about.visit.content);

  return (
    <View className="gap-5">
      {/* Love JEEP-IN Section */}
      <View className="gap-2">
        <ThemedText variant="eyebrow" tone="muted">
          {STRINGS.settings.about.loveSection}
        </ThemedText>
        <SettingsRow
          label={STRINGS.settings.about.likeFb.title}
          iconName="thumbs-up-outline"
          onPress={handleFacebook}
        />
        <SettingsRow
          label={STRINGS.settings.about.share.title}
          iconName="megaphone-outline"
          onPress={handleShare}
        />
        <SettingsRow
          label={STRINGS.settings.about.visit.title}
          iconName="document-text-outline"
          onPress={handleVisitPage}
        />
      </View>

      {/* Legal Section */}
      <View className="gap-2">
        <ThemedText variant="eyebrow" tone="muted">
          {STRINGS.settings.about.legalSection}
        </ThemedText>
        <SettingsRow
          label={STRINGS.settings.about.dataAttribution.title}
          iconName="file-tray-full-outline"
          onPress={onDataAttribution}
        />
        <SettingsRow
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
    <View className="gap-5">
      <View>
        {STRINGS.settings.about.dataAttribution.content.map((text, i) => (
          <ThemedText key={i}>• {text}</ThemedText>
        ))}
      </View>

      {/* Go Back Button */}
      <View>
        <Button
          label={STRINGS.general.goBack}
          variant="outline"
          size="md"
          iconName="arrow-back"
          onPress={onBack}
        />
      </View>
    </View>
  );
}

// Privacy Policy View
function PrivacyPolicyView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-5">
      <View>
        {STRINGS.settings.about.privacyPolicy.content.map((text, i) => (
          <ThemedText key={i}>• {text}</ThemedText>
        ))}
      </View>

      {/* Go Back Button */}
      <View>
        <Button
          label={STRINGS.general.goBack}
          variant="outline"
          size="md"
          iconName="arrow-back"
          onPress={onBack}
        />
      </View>
    </View>
  );
}

import { STRINGS } from "@/constants";
import { callNumber, sendEmail } from "@/lib/linkActions";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/types";

const GetSupportModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "help" | "contactUs">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={
        view === "default"
          ? STRINGS.settings.getSupport.title
          : view === "help"
            ? STRINGS.settings.getSupport.help.title
            : STRINGS.settings.getSupport.contactUs.title
      }
      ref={baseRef}
    >
      {view === "default" ? (
        <DefaultGetSupportView
          onHelp={() => setView("help")}
          onContactUs={() => setView("contactUs")}
        />
      ) : view === "help" ? (
        <HelpView onBack={() => setView("default")} />
      ) : (
        <ContactUsView onBack={() => setView("default")} />
      )}
    </BottomSheetModalBase>
  );
});

export default GetSupportModal;

// Default View
function DefaultGetSupportView({
  onHelp,
  onContactUs,
}: {
  onHelp: () => void;
  onContactUs: () => void;
}) {
  return (
    <View className="gap-4">
      <ButtonText
        label={STRINGS.settings.getSupport.help.title}
        variant="tertiary"
        iconName="information-circle-outline"
        showChevron
        fullWidth
        onPress={onHelp}
      />
      <ButtonText
        label={STRINGS.settings.getSupport.contactUs.title}
        variant="tertiary"
        iconName="call-outline"
        showChevron
        fullWidth
        onPress={onContactUs}
      />
    </View>
  );
}

// Help View
function HelpView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.getSupport.help.helpYouWith}
        </ThemedText>
        <ThemedText color="secondary">
          {STRINGS.settings.getSupport.help.helpYouWithContent}
        </ThemedText>
      </View>
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.getSupport.help.commonQuestions}
        </ThemedText>
        <View className="gap-1">
          {STRINGS.settings.getSupport.help.commonQuestionsContent.map((item, i) => {
            const [question, answer] = item.split(" - ");

            return (
              <View key={i}>
                <ThemedText className="mb-1">• {question.trim()}</ThemedText>
                <ThemedText className="ml-2" color="secondary">{`- ${answer.trim()}`}</ThemedText>
              </View>
            );
          })}
        </View>
      </View>
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.getSupport.help.reportsTechnicalIssues}
        </ThemedText>
        <ThemedText color="secondary">
          {STRINGS.settings.getSupport.help.reportsTechnicalIssuesContent}
        </ThemedText>
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label={STRINGS.general.goBack} variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

// Contact Us View
function ContactUsView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.getSupport.contactUs.getInTouch}
        </ThemedText>
        <ThemedText color="secondary">
          {STRINGS.settings.getSupport.contactUs.getInTouchContent}
        </ThemedText>
      </View>

      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.getSupport.contactUs.support}
        </ThemedText>
        <ThemedText color="secondary">
          {STRINGS.settings.getSupport.contactUs.supportContent}
        </ThemedText>
        <View className="mt-1 gap-2">
          <ButtonText
            label={STRINGS.settings.jeepinEmail}
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() =>
              sendEmail(STRINGS.settings.jeepinEmail, STRINGS.settings.jeepinEmailSubject)
            }
          />
          <ButtonText
            label={STRINGS.settings.developerPhoneNumber1}
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber(STRINGS.settings.developerPhoneNumber1.trim())}
          />
          <ButtonText
            label={STRINGS.settings.developerPhoneNumber2}
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber(STRINGS.settings.developerPhoneNumber2.trim())}
          />
        </View>
      </View>

      <View>
        <ThemedText variant="h500" className="uppercase">
          {STRINGS.settings.getSupport.contactUs.operations}
        </ThemedText>
        <ThemedText color="secondary">
          {STRINGS.settings.getSupport.contactUs.operationsContent}
        </ThemedText>
        <View className="mt-1 gap-2">
          <ButtonText
            label={STRINGS.settings.mincEmail}
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail(STRINGS.settings.mincEmail)}
          />
          <ButtonText
            label={STRINGS.settings.mincPhoneNumber1}
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber(STRINGS.settings.mincPhoneNumber1.trim())}
          />
          <ButtonText
            label={STRINGS.settings.mincPhoneNumber2}
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber(STRINGS.settings.mincPhoneNumber2.trim())}
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

import { callNumber, sendEmail } from "@/lib/linkActions";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { BottomSheetModalBaseRef } from "@/components/ui/BottomSheetModalBase";

export type GetSupportModalRef = {
  open: () => void;
  close: () => void;
};

const GetSupportModal = forwardRef<GetSupportModalRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "help" | "contactUs">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={view === "default" ? "Get Support" : view === "help" ? "JEEP-IN help" : "Contact us"}
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
        label="Help"
        variant="tertiary"
        iconName="information-circle-outline"
        showChevron
        fullWidth
        onPress={onHelp}
      />
      <ButtonText
        label="Contact Us"
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
          WHAT CAN WE HELP YOU WITH?
        </ThemedText>
        <ThemedText color="secondary">
          Provides answers and support information for JEEP-IN users.
        </ThemedText>
      </View>
      <View>
        <ThemedText variant="h500" className="uppercase">
          WHAT CAN WE HELP YOU WITH?
        </ThemedText>
        <ThemedText color="secondary">
          - How can I track a modern jeepney?{"\n\t\t"}- You can view live jeepney locations and
          routes from the home screen map.{"\n"}- What if a jeepney location seems outdated?
          {"\n\t\t"}- The driver’s device might have lost signal. Try refreshing or checking again
          later.{"\n"}- Why do some stops not appear?{"\n\t\t"}- They may belong to another route
          filter. Use the filter button to show other routes.
        </ThemedText>
      </View>
      <View>
        <ThemedText variant="h500" className="uppercase">
          REPORTS & TECHNICAL ISSUES
        </ThemedText>
        <ThemedText color="secondary">
          If you experience bugs or incorrect location data, please contact the JEEP-IN support
          under the Contact Us setting.
        </ThemedText>
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label="Go Back" variant="secondary" onPress={onBack} />
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
          GET IN TOUCH WITH US
        </ThemedText>
        <ThemedText color="secondary">
          We're here to help you with feedback, suggestions, or partnership inquiries.
        </ThemedText>
      </View>

      <View>
        <ThemedText variant="h500" className="uppercase">
          SUPPORT
        </ThemedText>
        <ThemedText color="secondary">For technical issues or commuter feedback:</ThemedText>
        <View className="mt-1 gap-2">
          {/* TODO: all this information here should be in another data file */}
          <ButtonText
            label="jeepin.official@gmail.com"
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail("jeepin.official@gmail.com", "JEEP-IN Support Request")}
          />
          <ButtonText
            label="+63 918 217 8716"
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber("+639182178716")}
          />
          <ButtonText
            label="+63 949 924 8562"
            variant="tertiary"
            iconName="call-outline"
            showChevron
            fullWidth
            onPress={() => callNumber("+639499248562")}
          />
        </View>
      </View>

      <View>
        <ThemedText variant="h500" className="uppercase">
          OPERATIONS
        </ThemedText>
        <ThemedText color="secondary">
          For concerns about jeepney schedules or stop points:
        </ThemedText>
        <View className="mt-1 gap-2">
          {/* TODO: all this information here should be in another data file */}
          <ButtonText
            label="inminc.pgin@gmail.com"
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail("inminc.pgin@gmail.com")}
          />
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
        </View>
      </View>

      {/* Go Back Button */}
      <View className="self-start">
        <ButtonText label="Go Back" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}

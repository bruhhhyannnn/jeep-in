import { callNumber, sendEmail } from "@/lib/linkActions";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { BottomSheetModalBase, ButtonText, ThemedText } from "@/components/ui";
import { StopCard } from "@/components/commuter";
import { useRouter } from "expo-router";
import { BottomSheetModalBaseRef } from "@/types";


const StopPointsModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const [view, setView] = useState<"default" | "help">("default");

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase
      title={view === "default" ? "Stop Points" : "Help | Stop Point"}
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
  const router = useRouter();

  return (
    <View className="gap-4">
      {/* Going laoag route */}
      {/* TODO: render actual stop points here, all of it */}
      <View className="gap-1">
        <ThemedText variant="h500" className="uppercase">
          Going laoag route
        </ThemedText>
        <View className="gap-2">
          <StopCard
            location="MMSU Gate 3"
            address="Batac City"
            onPress={() => router.push("/(commuter)/home/stop/MMSU Gate 3")}
          />
          <StopCard
            location="Bingao Elementary & National High School"
            address="Batac City"
            onPress={() =>
              router.push("/(commuter)/home/stop/Bingao Elementary & National High School")
            }
          />
        </View>
      </View>

      {/* Going paoay route */}
      {/* TODO: render actual stop points here, all of it */}
      <View className="gap-1">
        <ThemedText variant="h500" className="uppercase">
          Going paoay route
        </ThemedText>
        <View className="gap-2">
          <StopCard
            location="MMSU Gate 3"
            address="Batac City"
            onPress={() => router.push("/(commuter)/home/stop/MMSU Gate 3")}
          />
          <StopCard
            location="Bingao Elementary & National High School"
            address="Batac City"
            onPress={() =>
              router.push("/(commuter)/home/stop/Bingao Elementary & National High School")
            }
          />
        </View>
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
function HelpStopPointsView({ onBack }: { onBack: () => void }) {
  return (
    <View className="gap-4">
      {/* What's It Do Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          WHAT'S IT DO?
        </ThemedText>
        <ThemedText color="secondary">
          Provides a list of stop points or pickup points of commonly known PUV stops.
        </ThemedText>
      </View>

      {/* Concern or Complaints Section */}
      <View>
        <ThemedText variant="h500" className="uppercase">
          CONCERNS OR COMPLAINTS?
        </ThemedText>
        <ThemedText color="secondary">
          Contact the JEEP-IN team hotline or email address.
        </ThemedText>

        {/* Contact Cards */}
        <View className="mt-1 gap-2">
          {/* TODO: all this information here should be in another data file */}
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
          <ButtonText
            label="jeepin.official@gmail.com"
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail("jeepin.official@gmail.com", "JEEP-IN Support Request")}
          />
          <ButtonText
            label="mangapit.bryan@gmail.com"
            variant="tertiary"
            iconName="mail-outline"
            showChevron
            fullWidth
            onPress={() => sendEmail("mangapit.bryan@gmail.com", "JEEP-IN Support Request")}
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

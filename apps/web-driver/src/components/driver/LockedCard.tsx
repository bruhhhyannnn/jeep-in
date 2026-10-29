import { STRINGS } from "@/constants";
import { Icon, ThemedText, View } from "@/components/ui";

/** Shown over Direction and Report while the jeep moves. Unlocks by itself once it stops. */
export default function LockedCard({ body }: { body: string }) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ boxShadow: "0px 12px 32px rgba(17, 48, 90, 0.16)" }}
      className="items-center gap-2.5 rounded-[24px] border-2 border-action bg-card px-5 py-6"
    >
      <View className="h-14 w-14 items-center justify-center rounded-full bg-action">
        <Icon name="hand-left-outline" size={26} tone="actionInk" />
      </View>
      <ThemedText variant="heading" className="text-center">
        {STRINGS.driver.locked.title}
      </ThemedText>
      <ThemedText variant="small" tone="muted" className="text-center">
        {body}
      </ThemedText>
    </View>
  );
}

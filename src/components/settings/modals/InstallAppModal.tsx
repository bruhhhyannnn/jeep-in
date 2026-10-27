import { useImperativeHandle, useRef, type Ref } from "react";
import { STRINGS } from "@/constants";
import type { BottomSheetModalBaseRef } from "@/types";
import { BottomSheetModalBase, Icon, ThemedText, View, type IconName } from "@/components/ui";

const STEP_ICONS: IconName[] = ["share-outline", "add-circle-outline", "checkmark"];

/** iPhone and iPad have no install prompt: the steps for Add to Home Screen in Safari. */
export default function InstallAppModal({ ref }: { ref?: Ref<BottomSheetModalBaseRef> }) {
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  const t = STRINGS.web.install;

  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  return (
    <BottomSheetModalBase title={t.iosTitle} ref={baseRef}>
      <View className="gap-2">
        {t.iosSteps.map((step, i) => (
          <View
            key={step}
            className="min-h-[56px] flex-row items-center gap-3 rounded-tile border-[1.5px] border-line bg-card px-4 py-3"
          >
            <View className="h-8 w-8 items-center justify-center rounded-full bg-sunken">
              <ThemedText variant="label">{String(i + 1)}</ThemedText>
            </View>
            <ThemedText variant="strong" className="flex-1">
              {step}
            </ThemedText>
            <Icon name={STEP_ICONS[i]} tone="action" />
          </View>
        ))}
      </View>
    </BottomSheetModalBase>
  );
}

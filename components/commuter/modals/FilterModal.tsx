import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { ThemedText, ButtonText, BottomSheetModalBase, ButtonCheckbox } from "@/components/ui/";
import { BottomSheetModalBaseRef } from "@/components/ui/BottomSheetModalBase";

export type FilterModalRef = {
  open: () => void;
  close: () => void;
};

const FilterModal = forwardRef<FilterModalRef>((_, ref) => {
  // BottomSheet Modal logic
  const baseRef = useRef<BottomSheetModalBaseRef>(null);
  useImperativeHandle(ref, () => ({
    open: () => baseRef.current?.open(),
    close: () => baseRef.current?.close(),
  }));

  // Input checkbox logic
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const toggleRoute = (route: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route],
    );
  };

  return (
    <BottomSheetModalBase title="Filer Routes" ref={baseRef}>
      <View className="gap-5">
        <View className="gap-2">
          {/* Content */}
          <ThemedText variant="h400" className="uppercase">
            Show only
          </ThemedText>
          {/* Cards */}
          {/* TODO: Add dynamic cards later on */}
          <ButtonCheckbox
            label="Going Paoay Route"
            iconName="road-variant"
            checked={selectedRoutes.includes("Going Paoay Route")}
            onToggle={() => toggleRoute("Going Paoay Route")}
          />
          <ButtonCheckbox
            label="Going Laoag Route"
            iconName="road-variant"
            checked={selectedRoutes.includes("Going Laoag Route")}
            onToggle={() => toggleRoute("Going Laoag Route")}
          />
        </View>

        {/* Cancel & Apply button */}
        <View className="flex-row items-center gap-2">
          <ButtonText label="Cancel" variant="secondary" onPress={() => baseRef.current?.close()} />
          <View className="flex-1">
            <ButtonText label="Apply" fullWidth onPress={() => console.log("Apply filters")} />
          </View>
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default FilterModal;

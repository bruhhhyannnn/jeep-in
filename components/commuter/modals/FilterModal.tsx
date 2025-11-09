import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import RouteCard from "@/components/commuter/RouteCard";
import { ThemedText, ButtonText, BottomSheetModalBase } from "@/components/shared/";
import { BottomSheetModalBaseRef } from "@/components/shared/BottomSheetModalBase";

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
          <RouteCard
            route="Going Paoay Route"
            checked={selectedRoutes.includes("Going Paoay Route")}
            onToggle={() => toggleRoute("Going Paoay Route")}
          />
          <RouteCard
            route="Going Laoag Route"
            checked={selectedRoutes.includes("Going Laoag Route")}
            onToggle={() => toggleRoute("Going Laoag Route")}
          />
        </View>

        {/* Cancel & Filter button */}
        <View className="flex-row gap-2">
          <ButtonText label="Cancel" variant="secondary" onPress={() => baseRef.current?.close()} />
          <ButtonText label="Apply" fullWidth onPress={() => console.log("Apply filters")} />
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default FilterModal;

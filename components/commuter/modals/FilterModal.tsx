import { STRINGS } from "@/constants";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import { ThemedText, ButtonText, BottomSheetModalBase, ButtonCheckbox } from "@/components/ui/";
import { BottomSheetModalBaseRef } from "@/types";

const FilterModal = forwardRef<BottomSheetModalBaseRef>((_, ref) => {
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

  // TODO: Add dynamic cards later on
  const ROUTES = ["Going Paoay Route", "Going Laoag Route"];

  return (
    <BottomSheetModalBase title={STRINGS.commuter.filterRoutes} ref={baseRef}>
      <View className="gap-5">
        <View className="gap-2">
          {/* Content */}
          <ThemedText variant="h400" className="uppercase">
            Show only
          </ThemedText>
          {/* Cards */}
          {ROUTES.map((route) => (
            <ButtonCheckbox
              key={route}
              label={route}
              iconName="road-variant"
              checked={selectedRoutes.includes(route)}
              onToggle={() => toggleRoute(route)}
            />
          ))}
        </View>

        {/* Cancel & Apply button */}
        <View className="flex-row items-center gap-2">
          <ButtonText
            label={STRINGS.general.goBack}
            variant="secondary"
            onPress={() => baseRef.current?.close()}
          />
          <View className="flex-1">
            <ButtonText
              label={STRINGS.general.apply}
              fullWidth
              onPress={() => {
                console.log("Apply filters", selectedRoutes);
                baseRef.current?.close();
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheetModalBase>
  );
});

export default FilterModal;

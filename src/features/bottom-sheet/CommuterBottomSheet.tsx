import BottomSheet from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { Text, View } from "react-native";

export default function CommuterBottomSheet() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "60%"], []);

  return (
    <BottomSheet ref={sheetRef} index={0} snapPoints={snapPoints}>
      <View className="p-4">
        <Text className="text-lg font-semibold">Commuter Info</Text>
        <Text className="text-gray-500">WHERE IS THIS?</Text>
      </View>
    </BottomSheet>
  );
}

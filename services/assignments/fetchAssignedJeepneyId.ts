import * as SecureStore from "expo-secure-store";
export const fetchAssignedJeepneyId = async (): Promise<string | null> => {
  try {
    const stored = await SecureStore.getItemAsync("assignedJeepneyId");
    if (!stored) {
      console.log("No assignedJeepneyId found in SecureStore");
      return null;
    }
    return stored;
  } catch (err) {
    console.error("❌ Error reading assignedJeepneyId:", err);
    return null;
  }
};

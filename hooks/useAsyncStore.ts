import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAsyncStore = () => {
  const setItem = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("AsyncStorage set error:", error);
    }
  };

  const getItem = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("AsyncStorage get error:", error);
      return null;
    }
  };

  const removeItem = async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorage remove error:", error);
    }
  };

  return { setItem, getItem, removeItem };
};

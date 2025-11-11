// TODO: unused
import * as SecureStore from "expo-secure-store";

export const useSecureStore = () => {
  const saveToken = async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("Failed to save token", error);
    }
  };

  const getToken = async (key: string) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("Failed to get token", error);
      return null;
    }
  };

  const clearToken = async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("Failed to delete token", error);
    }
  };

  return { saveToken, getToken, clearToken };
};

import { useSecureStore } from "./useSecureStore";
import { useAsyncStore } from "./useAsyncStore";

export const useAuthStorage = () => {
  const { saveToken, getToken, clearToken } = useSecureStore();
  const { setItem, getItem, removeItem } = useAsyncStore();

  const saveSession = async (token: string, role: string) => {
    await saveToken("authToken", token);
    await setItem("userRole", role);
  };

  const loadSession = async () => {
    const token = await getToken("authToken");
    const role = await getItem("userRole");
    return { token, role };
  };

  const clearSession = async () => {
    await clearToken("authToken");
    await removeItem("userRole");
  };

  return { saveSession, loadSession, clearSession };
};

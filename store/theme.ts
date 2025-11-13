import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NicknameState {
  nickname: string;
  setNickname: (value: string) => Promise<void>;
  loadNickname: () => Promise<void>;
}

export const useNicknameStore = create<NicknameState>((set) => ({
  nickname: "User", // default value
  setNickname: async (value: string) => {
    set({ nickname: value });
    await AsyncStorage.setItem("nickname", value);
  },
  loadNickname: async () => {
    const stored = await AsyncStorage.getItem("nickname");
    if (stored) set({ nickname: stored });
  },
}));

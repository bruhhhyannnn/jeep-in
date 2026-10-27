import { initializeApp } from "firebase/app";
import { type Auth, type Persistence, initializeAuth, getAuth } from "firebase/auth";
import * as firebaseAuth from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Metro loads firebase/auth's React Native build, which exports this; the TypeScript
// types describe the browser build, which doesn't.
type ReactNativeAuth = {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

let authInstance: Auth | null = null;

export function getAuthInstance(): Auth {
  if (!authInstance) {
    if (Platform.OS === "web") {
      authInstance = getAuth(app);
    } else {
      const persistence = (firebaseAuth as unknown as ReactNativeAuth).getReactNativePersistence;
      authInstance = initializeAuth(app, {
        persistence: persistence(AsyncStorage),
      });
    }
  }
  return authInstance;
}

export const db = getFirestore(app);

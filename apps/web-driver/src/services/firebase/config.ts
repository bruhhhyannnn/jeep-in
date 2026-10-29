import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { env } from "@/services/env";

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// The sign-in is kept in IndexedDB, so it lasts the whole shift across reloads.
const auth = getAuth(app);
export const getAuthInstance = () => auth;

// The cache lives in IndexedDB: reports and positions sent with no signal are kept
// and go out by themselves when it returns, even after a reload.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

// For trying the app without touching live data: `firebase emulators:start --project demo-jeep-in`
// at the monorepo root, then run with VITE_FIREBASE_EMULATORS=true and VITE_FIREBASE_PROJECT_ID=demo-jeep-in.
if (env.VITE_FIREBASE_EMULATORS === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

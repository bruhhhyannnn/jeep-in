import "./global.css";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { auth, db, storage, functions } from "@/services/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Puffin-Regular": require("../assets/fonts/Puffin-Regular.otf"),
    "Puffin-Medium": require("../assets/fonts/Puffin-Medium.otf"),
    "Puffin-SemiBold": require("../assets/fonts/Puffin-SemiBold.otf"),
    "Puffin-Bold": require("../assets/fonts/Puffin-Bold.otf"),
    "Puffin-ExtraBold-Italic": require("../assets/fonts/Puffin-ExtraBold-Italic.otf"),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "super_admin"));
        snap.forEach((doc) => console.log(doc.id, doc.data()));
      } catch (error) {
        console.error("Data pipeline failed gracefully:", error);
      }
    };

    fetchUsers();
  }, []);

  console.log("🔥 Firebase ready:", !!auth, !!db, !!storage, !!functions);

  // Load fonts
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: "fade_from_bottom",
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

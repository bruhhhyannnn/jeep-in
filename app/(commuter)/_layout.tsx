// import { useEffect } from "react";
// import { router } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function RootLayout() {
//   useEffect(() => {
//     const checkRole = async () => {
//       const role = await AsyncStorage.getItem("userRole");
//       if (!role) router.replace("/onboarding");
//       else if (role === "commuter") router.replace("/(commuter)/home");
//       else router.replace("/(driver)/home");
//     };
//     checkRole();
//   }, []);

//   return null;
// }

// // app/dev/seed-stops.tsx
// import { View, Text } from "react-native";
// import { useEffect } from "react";
// import stops from "@/data/stops.json";
// import { db } from "@/services/firebase/config";
// import { doc, setDoc } from "firebase/firestore";

// export default function SeedStops() {
//   useEffect(() => {
//     async function seed() {
//       console.log("🚀 Starting stop point seeding...");

//       for (const stop of stops) {
//         const now = new Date();

//         const payload = {
//           ...stop,
//           created_at: now,
//           updated_at: now,
//         };

//         await setDoc(doc(db, "stops", stop.id), payload);

//         console.log(`✔ Added: ${stop.name}`);
//       }

//       console.log("🎉 Seeding complete!");
//     }

//     seed();
//   }, []);

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Seeding stops... Check console.</Text>
//     </View>
//   );
// }

import { disableNetwork, enableNetwork } from "firebase/firestore";
import { db } from "@/services/firebase/config";

/** "Retry now": drops Firestore's connection and opens a fresh one. */
export async function reconnect() {
  await disableNetwork(db);
  await enableNetwork(db);
}

import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const deleteUserCascade = async (request: any, context: any) => {
  const { uid } = request.data;
  if (!uid) throw new Error("Missing UID.");

  const auth = getAuth();
  const db = getFirestore();

  // delete profiles
  await db.collection("driver_profiles").doc(uid).delete();
  await db.collection("admin_profiles").doc(uid).delete();
  await db.collection("super_admin_profiles").doc(uid).delete();

  // delete user record
  await db.collection("users").doc(uid).delete();

  // delete auth account
  await auth.deleteUser(uid);

  return { success: true };
};

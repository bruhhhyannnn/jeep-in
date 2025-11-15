import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const deleteUserCascadeFn = onCall(async (request) => {
  console.log("🔥 DELETE USER DATA:", request.data);

  const { uid } = request.data;

  if (!uid) {
    throw new HttpsError("invalid-argument", "Missing UID.");
  }

  const auth = getAuth();
  const db = getFirestore();

  // Delete sub-profiles
  await db
    .collection("driver_profiles")
    .doc(uid)
    .delete()
    .catch(() => {});
  await db
    .collection("admin_profiles")
    .doc(uid)
    .delete()
    .catch(() => {});
  await db
    .collection("super_admin_profiles")
    .doc(uid)
    .delete()
    .catch(() => {});

  // Delete user doc
  await db.collection("users").doc(uid).delete();

  // Delete auth user
  await auth.deleteUser(uid);

  return { success: true };
});

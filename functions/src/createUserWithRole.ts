import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const createUserWithRoleFn = onCall(async (request) => {
  const { role, email, password, name, route_id } = request.data;

  if (!role || !email || !password || !name) {
    throw new HttpsError("invalid-argument", "Missing required fields.");
  }

  const auth = getAuth();
  const db = getFirestore();

  const user = await auth.createUser({ email, password });

  await db.collection("users").doc(user.uid).set({
    id: user.uid,
    email,
    name,
    role,
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (role === "driver") {
    if (!route_id) {
      throw new HttpsError("invalid-argument", "Drivers require route_id.");
    }
    await db.collection("driver_profiles").doc(user.uid).set({
      id: user.uid,
      user_id: user.uid,
      route_id,
      status: "inactive",
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return { success: true, uid: user.uid };
});

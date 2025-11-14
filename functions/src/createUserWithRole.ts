import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const createUserWithRole = async (request: any, context: any) => {
  const { role, email, password, name, route_id } = request.data;

  if (!role || !email || !password || !name) {
    throw new Error("Missing required fields.");
  }

  const auth = getAuth();
  const db = getFirestore();

  const validRoles = ["driver", "admin", "super_admin"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role.");
  }

  // ① Create Firebase Auth user
  const user = await auth.createUser({ email, password });

  // ② Save User record
  await db.collection("users").doc(user.uid).set({
    id: user.uid,
    email,
    name,
    role,
    created_at: new Date(),
    updated_at: new Date(),
  });

  // ③ Create corresponding profile
  if (role === "driver") {
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
};

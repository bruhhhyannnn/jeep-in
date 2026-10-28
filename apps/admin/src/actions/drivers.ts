"use server";

import { Timestamp, FieldValue } from "firebase-admin/firestore";
import { normalizeDriver, type RawDoc } from "@jeep-in/core/documents";
import { DriverCreateFormData, DriverRecordFormData, serializeDoc } from "@/lib";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import type { DriverProfile } from "@/types";

const COL = "drivers";

/** Fills in the driver app's record fields, which older driver documents don't have. */
function toProfile(uid: string, data: RawDoc): DriverProfile {
  const { employeeId, role, phone, licenseNo, licenseExpiry, photoUrl } = normalizeDriver(
    uid,
    data,
  );
  return serializeDoc({
    ...(data as DriverProfile),
    uid,
    employeeId,
    role,
    phone,
    licenseNo,
    licenseExpiry,
    photoUrl,
  });
}

/** The record fields as stored: trimmed, with empty answers saved as null. */
function recordFields(data: DriverRecordFormData) {
  const optional = (value: string | undefined) => value?.trim() || null;
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    employeeId: optional(data.employeeId),
    role: data.role,
    phone: optional(data.phone),
    licenseNo: optional(data.licenseNo),
    licenseExpiry: optional(data.licenseExpiry),
  };
}

export async function getDrivers(organizationId: string): Promise<DriverProfile[]> {
  const snap = await adminDb
    .collection(COL)
    .where("organizationId", "==", organizationId)
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => toProfile(d.id, d.data()));
}

export async function getDriver(uid: string): Promise<DriverProfile | null> {
  const snap = await adminDb.collection(COL).doc(uid).get();
  if (!snap.exists) return null;
  return toProfile(snap.id, snap.data()!);
}

export async function createDriver(
  data: DriverCreateFormData,
  organizationId: string,
  routeId: string,
): Promise<{ uid: string; tempPassword: string }> {
  const record = recordFields(data);
  const displayName = `${record.firstName} ${record.lastName}`;

  // 1. Create Firebase Auth user via Admin SDK
  const userRecord = await adminAuth.createUser({
    email: data.email,
    password: data.password,
    displayName,
  });

  const uid = userRecord.uid;

  // 2. Set custom claim: role = driver
  await adminAuth.setCustomUserClaims(uid, { role: "driver" });

  const now = Timestamp.now();

  // 3. Create /users/{uid}
  await adminDb.collection("users").doc(uid).set({
    uid,
    email: data.email,
    role: "driver",
    displayName,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  // 4. Create /drivers/{uid}
  await adminDb
    .collection(COL)
    .doc(uid)
    .set({
      uid,
      email: data.email,
      ...record,
      photoUrl: null,
      organizationId,
      routeId,
      assignedJeepneyId: null,
      isActive: true,
      mustChangePassword: true,
      lastLocationUpdate: null,
      createdAt: now,
      updatedAt: now,
    });

  return { uid, tempPassword: data.password };
}

/** Saves the name and the record the driver app shows. The sign-in email stays as it is. */
export async function updateDriver(uid: string, data: DriverRecordFormData): Promise<void> {
  const record = recordFields(data);
  const displayName = `${record.firstName} ${record.lastName}`;

  const batch = adminDb.batch();
  batch.update(adminDb.collection(COL).doc(uid), {
    ...record,
    updatedAt: FieldValue.serverTimestamp(),
  });
  batch.set(
    adminDb.collection("users").doc(uid),
    { displayName, updatedAt: FieldValue.serverTimestamp() },
    { merge: true },
  );
  await batch.commit();
  try {
    await adminAuth.updateUser(uid, { displayName });
  } catch (e) {
    // Seeded and simulated drivers have no sign-in account to rename.
    if ((e as { code?: string }).code !== "auth/user-not-found") throw e;
  }
}

export async function deactivateDriver(uid: string): Promise<void> {
  // Mark inactive and unassign jeepney
  const snap = await adminDb.collection(COL).doc(uid).get();
  if (snap.exists) {
    const driver = snap.data() as DriverProfile;

    // If assigned to a jeepney, clear that assignment too
    if (driver.assignedJeepneyId) {
      await adminDb.collection("jeepneys").doc(driver.assignedJeepneyId).update({
        assignedDriverId: null,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }
  await adminDb.collection(COL).doc(uid).update({
    isActive: false,
    assignedJeepneyId: null,
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Revoke Firebase Auth session (immediate kick-out)
  await adminAuth.revokeRefreshTokens(uid);
}

export async function reactivateDriver(uid: string): Promise<void> {
  await adminAuth.updateUser(uid, { disabled: false });
  await adminDb
    .collection(COL)
    .doc(uid)
    .update({ isActive: true, updatedAt: FieldValue.serverTimestamp() });
}

export async function deleteDriver(uid: string): Promise<void> {
  // Clear jeepney assignment if any
  const snap = await adminDb.collection(COL).doc(uid).get();
  if (snap.exists) {
    const driver = snap.data() as DriverProfile;
    if (driver.assignedJeepneyId) {
      await adminDb.collection("jeepneys").doc(driver.assignedJeepneyId).update({
        assignedDriverId: null,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  // Remove from Firestore
  await adminDb.collection(COL).doc(uid).delete();
  await adminDb.collection("users").doc(uid).delete();
  await adminDb.collection("driver_locations").doc(uid).delete();

  // Delete Firebase Auth account
  await adminAuth.deleteUser(uid);
}

export async function assignJeepney(driverUid: string, jeepneyId: string): Promise<void> {
  // Clear old assignment on previous jeepney if any
  const snap = await adminDb.collection(COL).doc(driverUid).get();
  if (snap.exists) {
    const driver = snap.data() as DriverProfile;
    if (driver.assignedJeepneyId && driver.assignedJeepneyId !== jeepneyId) {
      await adminDb.collection("jeepneys").doc(driver.assignedJeepneyId).update({
        assignedDriverId: null,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  // Assign driver → jeepney
  await adminDb.collection(COL).doc(driverUid).update({
    assignedJeepneyId: jeepneyId,
    updatedAt: FieldValue.serverTimestamp(),
  });
  // Assign jeepney → driver
  await adminDb.collection("jeepneys").doc(jeepneyId).update({
    assignedDriverId: driverUid,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function unassignJeepney(driverUid: string, jeepneyId: string): Promise<void> {
  await adminDb.collection(COL).doc(driverUid).update({
    assignedJeepneyId: null,
    updatedAt: FieldValue.serverTimestamp(),
  });
  await adminDb.collection("jeepneys").doc(jeepneyId).update({
    assignedDriverId: null,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

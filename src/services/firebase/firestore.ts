import { db } from "@/services/firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
  FirestoreError,
} from "firebase/firestore";

// 🔹 Get all documents from a collection
export const getCollection = async <T>(path: string): Promise<T[]> => {
  const snap = await getDocs(collection(db, path));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
};

// 🔹 Get a single document by ID
export const getDocument = async <T>(path: string, id: string): Promise<T | null> => {
  const snap = await getDoc(doc(db, path, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
};

// 🔹 Add a new document
export const addDocument = async <T>(path: string, data: Omit<T, "id">): Promise<string> => {
  const ref = await addDoc(collection(db, path), data);
  return ref.id;
};

// 🔹 Update an existing document
export const updateDocument = async <T>(
  path: string,
  id: string,
  data: Partial<T>,
): Promise<void> => {
  await updateDoc(doc(db, path, id), data);
};

// 🔹 Delete a document
export const deleteDocument = async (path: string, id: string): Promise<void> => {
  await deleteDoc(doc(db, path, id));
};

// 🔹 Listen to real-time updates on a collection
export const listenToCollection = <T>(
  path: string,
  callback: (data: T[]) => void,
  onError?: (error: FirestoreError) => void,
) => {
  return onSnapshot(
    collection(db, path),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)),
    onError,
  );
};

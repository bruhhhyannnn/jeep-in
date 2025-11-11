import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/services/firebase/config";

export const useUploadImage = () => {
  const uploadImage = async (uri: string, path: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  return { uploadImage };
};

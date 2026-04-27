import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../firebaseConfig";

export async function uploadImage(userId, file) {
  const imageRef = ref(storage, `post-images/${userId}/${v4()}`);
  const snapshot = await uploadBytes(imageRef, file);
  return getDownloadURL(snapshot.ref);
}

export default uploadImage;

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const getAllCategories = async (col) => {
  const refCol = await getDocs(collection(db, col));
  const data = refCol.docs.map((item) => ({ ...item.data(), id: item.id }));
  return data;
};

export const getDocumentData = async (ref) => {
  const docSnap = await getDoc(doc(db, ref));
  const data = docSnap.data();
  return data;
};

export const getPersonalPosts = async (req) => {
  const ref = collection(db, req.col);
  const q = query(
    ref,
    where(req.name, req.condition, req.value),
    orderBy("createTime", "desc"),
  );
  const refCol = await getDocs(q);
  const data = refCol.docs.map(
    (item) => ({
      ...item.data(),
      id: item.id,
      createTime: item.data().createTime.toDate().toString(),
    }),
  );
  return data;
};

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Post, PostDB, PostsQueryParams } from "../types/post";
import type { Category, CategoryDB } from "../types/category";

export const getAllCategories = async (
  col: string,
): Promise<Category[]> => {
  const refCol = await getDocs(collection(db, col));

  return refCol.docs.map((item) => ({
    ...(item.data() as CategoryDB),
    id: item.id,
  }) satisfies Category);
};

export const getDocumentData = async <T>(ref: string): Promise<T | null> => {
  const docSnap = await getDoc(doc(db, ref));

  if (!docSnap.exists()) return null;

  return docSnap.data() as T;
};

export const getPosts = async ({
  col,
  name,
  condition,
  value,
}: PostsQueryParams): Promise<Post[]> => {
  const ref = collection(db, col);

  const q = name && condition && value
    ? query(
      ref,
      where(name, condition, value),
      orderBy("createTime", "desc"),
    )
    : query(ref, orderBy("createTime", "desc"));

  const result = await getDocs(q);

  return result.docs.map((item) => {
    const data = item.data() as PostDB;

    return {
      ...data,
      id: item.id,
      createTime:
        data.createTime instanceof Timestamp ? data.createTime.toMillis() : 0,
    } satisfies Post;
  });
};

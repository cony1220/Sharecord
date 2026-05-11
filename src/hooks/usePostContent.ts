import { useState, useEffect } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Post, PostDB } from "../types/post";

const usePostContent = (ref: string) => {
  const [data, setData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(doc(db, "posts", ref), (docSnap) => {
      if (!docSnap.exists()) {
        setData(null);
        setIsLoading(false);
        return;
      }

      const rawData = docSnap.data() as PostDB;

      setData({
        ...rawData,
        id: docSnap.id,
        createTime:
          rawData.createTime instanceof Timestamp
            ? rawData.createTime.toMillis()
            : null,
      });
      setIsLoading(false);
    });
    return () => unsub();
  }, [ref]);

  return { isLoading, data };
};

export default usePostContent;

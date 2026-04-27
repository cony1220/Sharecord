import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import defaultAvatar from "../assets/icons/default-avatar.png";

const useComments = (col) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!col) return () => {};

    setIsLoading(true);

    const ref = collection(db, col);
    const q = query(ref, orderBy("createTime"));

    const unsub = onSnapshot(q, (colSnap) => {
      const mappedComments = colSnap.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          content: data.content || "",
          createTime: data.createTime?.toMillis?.() || null,
          author: {
            uid: data.author?.uid || "",
            name: data.author?.name || "使用者",
            photoURL:
              data.author?.photoURL || defaultAvatar,
          },
        };
      });

      setComments(mappedComments);
      setIsLoading(false);
    });

    return unsub;
  }, [col]);

  return { isLoading, comments };
};
export default useComments;

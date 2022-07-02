import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const useComments = (col) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const ref = collection(db, col);
    const q = query(ref, orderBy("createTime"));
    const unsub = onSnapshot(q, (colSnap) => {
      const comments = colSnap.docs.map((comment) => ({ ...comment.data(), id: comment.id }));
      setData(comments);
      setIsLoading(false);
    });
    return unsub;
  }, []);
  return { isLoading, data };
};
export default useComments;

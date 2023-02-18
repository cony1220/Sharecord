import { useState, useEffect } from "react";
import {
  doc, onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const usePostContent = (ref) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(doc(db, `posts/${ref}`), (docSnap) => {
      setData(docSnap.data());
      setIsLoading(false);
    });
    return unsub;
  }, []);
  return { isLoading, data };
};

export default usePostContent;

import { useState, useEffect } from "react";
import {
  doc, getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const useGetDocData = (ref) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      const docSnap = await getDoc(doc(db, ref));
      setData(docSnap.data());
      setIsLoading(false);
    };
    getData();
  }, [ref]);
  return { isLoading, data, setData };
};
export default useGetDocData;

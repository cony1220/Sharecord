import { useState, useEffect } from "react";
import {
  collection, getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const useGetColData = (col) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      const refCol = await getDocs(collection(db, col));
      setData(refCol.docs.map((item) => ({ ...item.data(), id: item.id })));
      setIsLoading(false);
    };
    getData();
  }, []);
  return { isLoading, data };
};
export default useGetColData;

import { useState } from "react";
import {
  collection, getDocs, query, where, orderBy,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const useGetQueryColData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getData = async (col, queryString) => {
    setIsLoading(true);
    const ref = collection(db, col);
    let q;
    if (queryString) {
      q = query(ref, where(queryString.name, queryString.condition, queryString.value), orderBy("createTime", "desc"));
    } else {
      q = query(ref, orderBy("createTime", "desc"));
    }
    const result = await getDocs(q);
    setData(result.docs.map((item) => ({ ...item.data(), id: item.id })));
    setIsLoading(false);
  };
  return { isLoading, data, getData };
};

export default useGetQueryColData;

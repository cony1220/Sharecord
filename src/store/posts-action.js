import {
  collection, getDocs, query, where, orderBy,
} from "firebase/firestore";
import { postsActions } from "./posts-slice";
import { db } from "../firebaseConfig";

const fetchPostsData = (col, queryString) => async (dispatch) => {
  dispatch(
    postsActions.replacePosts({
      status: "loading",
      items: [],
      error: null,
    }),
  );
  const fetchData = async () => {
    const ref = collection(db, col);
    let q;
    if (queryString) {
      q = query(
        ref,
        where(queryString.name, queryString.condition, queryString.value),
        orderBy("createTime", "desc"),
      );
    } else {
      q = query(ref, orderBy("createTime", "desc"));
    }
    const result = await getDocs(q);
    const data = result.docs.map((item) => ({
      ...item.data(),
      id: item.id,
      createTime: item.data().createTime.toDate().toString(),
    }));
    return data;
  };

  try {
    const cartData = await fetchData();

    dispatch(
      postsActions.replacePosts({
        status: "succeed",
        items: cartData || [],
        error: null,
      }),
    );
  } catch (error) {
    dispatch(
      postsActions.replacePosts({
        status: "failed",
        items: [],
        error: error.message,
      }),
    );
  }
};

export default fetchPostsData;

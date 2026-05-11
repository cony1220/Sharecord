import { postsActions } from "./posts-slice";
import { getPosts } from "../lib/api";
import type { AppDispatch } from "./index";
import type { PostsQueryParams } from "../types/post";

const fetchPostsData = (
  params: PostsQueryParams,
) => async (dispatch: AppDispatch) => {
  dispatch(
    postsActions.replacePosts({
      status: "loading",
      items: [],
      error: null,
    }),
  );

  try {
    const postsData = await getPosts(params);

    dispatch(
      postsActions.replacePosts({
        status: "succeed",
        items: postsData,
        error: null,
      }),
    );
  } catch (error) {
    dispatch(
      postsActions.replacePosts({
        status: "failed",
        items: [],
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }),
    );
  }
};

export default fetchPostsData;

import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import "../Styles/Home.css";
import CategoryList from "../components/Post/CategoryList";
import Loading from "../components/UI/Loading";
import fetchPostsData from "../store/posts-action";
import { uiActions } from "../store/ui-slice";
import PostsList from "../components/Post/PostsList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { PostsQueryParams } from "../types/post";

function Home() {
  const { categoryPage } = useParams<{categoryPage: string}>();
  const [searchKeyword] = useSearchParams();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    let params: PostsQueryParams;

    if (categoryPage === "all") {
      params = {
        col: "posts",
      };
    } else if (categoryPage === "search") {
      params = {
        col: "posts",
        name: "keywords",
        condition: "array-contains",
        value: searchKeyword.get("query") ?? "",
      };
    } else {
      params = {
        col: "posts",
        name: "categoryId",
        condition: "==",
        value: categoryPage ?? "",
      };
    }

    dispatch(fetchPostsData(params));
    dispatch(uiActions.closeCategoryMenu());
  }, [categoryPage, searchKeyword, dispatch]);

  if (error) {
    return <div className="center">{error}</div>;
  }

  return (
    <div className="Home-box">
      {status === "loading" ? (
        <Loading />
      ) : (
        <>
          <div className="Home-background">
            <div className="Home-background-slogan">
              <div className="Home-slogan-line1">Share what you see,</div>
              <div className="Home-slogan-line2">record what you live.</div>
            </div>
          </div>
          <div className="Home-content-box">
            <div className="Home-personal-label-container">
              <CategoryList />
            </div>
            <PostsList />
          </div>
        </>
      )}
    </div>
  );
}
export default Home;

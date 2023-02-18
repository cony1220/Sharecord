import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "../Styles/Home.css";
import CategoryList from "../components/Post/CategoryList";
import Loading from "../components/UI/Loading";
import fetchPostsData from "../store/posts-action";
import { uiActions } from "../store/ui-slice";
import PostsList from "../components/Post/PostsList";

function Home() {
  const { categoryPage } = useParams();
  const [searchKeyword] = useSearchParams();
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  if (posts.error) {
    return <div className="center">{posts.error}</div>;
  }
  useEffect(() => {
    let queryString;

    if (categoryPage === "all") {
      queryString = "";
    } else if (categoryPage === "search") {
      queryString = { name: "keywords", condition: "array-contains", value: searchKeyword.get("query") };
    } else {
      queryString = { name: "categoryName", condition: "==", value: `${categoryPage}` };
    }

    dispatch(fetchPostsData("posts", queryString));
    dispatch(uiActions.close());
  }, [categoryPage, searchKeyword, dispatch]);

  return (
    <div className="Home-box">
      {posts.status === "loading" ? (
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

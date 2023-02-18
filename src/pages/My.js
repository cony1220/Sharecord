import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../Styles/Personal.css";
import { useSelector } from "react-redux";
import PostItem from "../components/Post/PostItem";
import Noposts from "../components/Post/Noposts";
import Loading from "../components/UI/Loading";
import useHttp from "../hooks/use-http";
import { getPersonalPosts } from "../lib/api";

function My() {
  const currentUser = useSelector((state) => state.user.user);
  const [isMyPostclicked, setIsMyPostclicked] = useState("mypost");
  const navigate = useNavigate();

  const {
    sendRequest: getPosts,
    isLoading: LoadPosts,
    data: postList,
    error: postsError,
  } = useHttp(getPersonalPosts, true);

  useEffect(() => {
    if (currentUser) {
      getPosts({
        col: "posts", name: "author.uid", condition: "==", value: `${currentUser.uid}`,
      });
    }
  }, [getPosts, currentUser]);

  const togglePostList = (action) => {
    switch (action) {
      case "mypost":
        getPosts({
          col: "posts", name: "author.uid", condition: "==", value: `${currentUser.uid}`,
        });
        setIsMyPostclicked("mypost");
        break;
      case "mycollect":
        getPosts({
          col: "posts", name: "collectby", condition: "array-contains", value: `${currentUser.uid}`,
        });
        setIsMyPostclicked("mycollect");
        break;
      default:
    }
  };

  if (postsError) {
    return <div className="center">{postsError}</div>;
  }

  return (
    <div className="Personal-box">
      { LoadPosts ? <Loading /> : (
        <>
          <div className="Personal-background" />
          <div className="Personal-content-box">
            <div className="Personal-information-container">
              <div className="Personal-avatar-container">
                <img className="Personal-avatar" src={currentUser && (currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png")} alt="" />
              </div>
              <div className="Personal-name-container">
                <div onClick={() => navigate("/profile")} className="Personal-setup-container">
                  <img className="Personal-setup" src="https://cdn-icons-png.flaticon.com/128/7321/7321337.png" alt="setup" />
                </div>
                <div className="Personal-name">{currentUser && (currentUser.displayName || "使用者")}</div>
              </div>
              <div className="Personal-post-count">{`${postList.length}篇文章`}</div>
            </div>
            <div className="Personal-bar" />
            <div className="Personal-post-container">
              <div className="Personal-post-menu-button-container">
                <div onClick={() => togglePostList("mypost")} className={isMyPostclicked === "mypost" ? "Personal-post-menu-button-clicked" : "Personal-post-menu-button-unclicked"}>我的文章</div>
                <div onClick={() => togglePostList("mycollect")} className={isMyPostclicked === "mycollect" ? "Personal-post-menu-button-clicked" : "Personal-post-menu-button-unclicked"}>我的收藏</div>
              </div>
              {postList.length > 0 ? postList.map((item) => (
                <PostItem key={item.id} item={item} />
              )) : (
                <Noposts />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default My;

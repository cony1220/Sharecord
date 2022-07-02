import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Personal.css";
import PostBlock from "../components/Post/PostBlock";
import useGetDocData from "../hooks/useDoc";
import { useAuth } from "../hooks/useAuth";
import Noposts from "../components/Post/Noposts";
import useGetQueryColData from "../hooks/useQueryCollection";
import Loading from "../components/Loading";

function My() {
  const { currentUser } = useAuth();
  const [isMyPostclicked, setIsMyPostclicked] = useState("mypost");
  const navigator = useNavigate();
  const { isLoading: LoadPageOwner, data: pageOwner } = useGetDocData(`users/${currentUser.uid}`);
  const { isLoading: LoadPostList, data: postList, getData } = useGetQueryColData();
  useEffect(() => {
    if (currentUser) {
      getData("posts", { name: "author.uid", condition: "==", value: `${currentUser.uid}` });
    }
  }, [currentUser.uid]);
  const togglePostList = (action) => {
    switch (action) {
      case "mypost":
        getData("posts", { name: "author.uid", condition: "==", value: `${currentUser.uid}` });
        setIsMyPostclicked("mypost");
        break;
      case "mycollect":
        getData("posts", { name: "collectby", condition: "array-contains", value: `${currentUser.uid}` });
        setIsMyPostclicked("mycollect");
        break;
      default:
    }
  };
  return (
    <div className="Personal-box">
      { LoadPageOwner && LoadPostList ? <Loading /> : (
        <>
          <div className="Personal-background" />
          <div className="Personal-content-box">
            <div className="Personal-information-container">
              <div className="Personal-avatar-container">
                <img className="Personal-avatar" src={pageOwner && pageOwner.photoURL} alt="" />
              </div>
              <div className="Personal-name-container">
                <div onClick={() => navigator("/setup")} className="Personal-setup-container">
                  <img className="Personal-setup" src="https://cdn-icons-png.flaticon.com/128/7321/7321337.png" alt="setup" />
                </div>
                <div className="Personal-name">{pageOwner && pageOwner.name}</div>
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
                <PostBlock key={item.id} item={item} />
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

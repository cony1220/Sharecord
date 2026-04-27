import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Personal.css";
import { useSelector } from "react-redux";
import useHttp from "../hooks/use-http";
import { getPersonalPosts } from "../lib/api";
import settingIcon from "../assets/icons/setting.png";
import ProfileLayout from "../Layouts/ProfileLayout";

function My() {
  const { auth: authUser, profile } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("mypost");
  const uid = authUser?.uid;
  const navigate = useNavigate();

  const {
    sendRequest: fetchMyPosts,
    isLoading: isLoadingMyPosts,
    data: myPosts,
    error: myPostsError,
  } = useHttp(getPersonalPosts, true, []);

  const {
    sendRequest: fetchMyCollectPosts,
    isLoading: isLoadingMyCollect,
    data: myCollectPosts,
    error: myCollectPostsError,
  } = useHttp(getPersonalPosts, false, []);

  useEffect(() => {
    if (!uid) return;

    fetchMyPosts({
      col: "posts", name: "author.uid", condition: "==", value: `${uid}`,
    });
  }, [fetchMyPosts, uid]);

  const handleTabChange = (type) => {
    if (!uid || activeTab === type) return;

    setActiveTab(type);

    if (type === "mycollect" && myCollectPosts.length === 0) {
      fetchMyCollectPosts({
        col: "posts",
        name: "collectby",
        condition: "array-contains",
        value: uid,
      });
    }
  };

  const getMenuClass = (type) => (
    activeTab === type
      ? "Personal-post-menu-button-clicked"
      : "Personal-post-menu-button-unclicked");

  const postList = activeTab === "mypost"
    ? myPosts
    : myCollectPosts;

  const isLoading = activeTab === "mypost"
    ? isLoadingMyPosts
    : isLoadingMyCollect;

  const error = activeTab === "mypost"
    ? myPostsError
    : myCollectPostsError;

  return (
    <ProfileLayout
      user={{
        uid,
        ...profile,
      }}
      postList={postList}
      isLoading={isLoading}
      error={error}
      headerExtra={(
        <div
          onClick={() => navigate("/profile/edit")}
          className="Personal-setup-container"
        >
          <img className="Personal-setup" src={settingIcon} alt="setup" />
        </div>
      )}
      postMenu={(
        <div className="Personal-post-menu-button-container">
          <div
            onClick={() => handleTabChange("mypost")}
            className={getMenuClass("mypost")}
          >
            我的文章
          </div>

          <div
            onClick={() => handleTabChange("mycollect")}
            className={getMenuClass("mycollect")}
          >
            我的收藏
          </div>
        </div>
      )}
    />
  );
}
export default My;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import "../Styles/Personal.css";
import PostItem from "../components/Post/PostItem";
import Noposts from "../components/Post/Noposts";
import Loading from "../components/UI/Loading";
import useHttp from "../hooks/use-http";
import { getDocumentData, getPersonalPosts } from "../lib/api";

function Personal() {
  const { userId } = useParams();

  const {
    sendRequest: getProfileData,
    isLoading: LoadPageOwner,
    data: pageOwner,
    error: profileError,
  } = useHttp(getDocumentData, true);

  const {
    sendRequest: getPosts,
    isLoading: LoadPosts,
    data: postList,
    error: postsError,
  } = useHttp(getPersonalPosts, true);

  useEffect(() => {
    getProfileData(`users/${userId}`);
    getPosts({
      col: "posts", name: "author.uid", condition: "==", value: `${userId}`,
    });
  }, [getProfileData, getPosts]);

  if (profileError) {
    return <div className="center">{profileError}</div>;
  }

  if (postsError) {
    return <div className="center">{postsError}</div>;
  }

  return (
    <div className="Personal-box">
      {LoadPageOwner || LoadPosts ? <Loading /> : (
        <>
          <div className="Personal-background" />
          <div className="Personal-content-box">
            <div className="Personal-information-container">
              <div className="Personal-avatar-container">
                <img className="Personal-avatar" src={pageOwner && pageOwner.photoURL} alt="" />
              </div>
              <div className="Personal-name-container">
                <div className="Personal-name">{pageOwner && pageOwner.name}</div>
              </div>
              <div className="Personal-post-count">{`${postList.length}篇文章`}</div>
            </div>
            <div className="Personal-bar" />
            <div className="Personal-post-container">
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
export default Personal;

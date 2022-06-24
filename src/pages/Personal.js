import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Styles/Personal.css";
import PostBlock from "../components/Post/PostBlock";
import useGetDocData from "../hooks/useDoc";
import Noposts from "../components/Post/Noposts";
import useGetQueryColData from "../hooks/useQueryCollection";

function Personal() {
  const { userId } = useParams();
  const { isLoading, data: pageOwner } = useGetDocData(`users/${userId}`);
  const { isLoading: LoadPostList, data: postList, getData } = useGetQueryColData();
  useEffect(() => {
    getData("posts", { name: "author.uid", condition: "==", value: `${userId}` });
  }, []);
  return (
    <div className="Personal-box">
      <div className="Personal-background" />
      <div className="Personal-content-box">
        <div className="Personal-information-container">
          <div className="Personal-avatar-container">
            <img className="Personal-avatar" src={pageOwner?.photoURL} alt="" />
          </div>
          <div className="Personal-name-container">
            <div className="Personal-name">{pageOwner?.name}</div>
          </div>
          <div className="Personal-post-count">{`${postList.length}篇文章`}</div>
        </div>
        <div className="Personal-bar" />
        <div className="Personal-post-container">
          {postList.length > 0 ? postList.map((item) => (
            <PostBlock key={item.id} item={item} />
          )) : (
            <Noposts />
          )}
        </div>
      </div>
    </div>
  );
}
export default Personal;

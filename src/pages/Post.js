import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../Styles/Post.css";
import {
  Editor,
  EditorState,
  convertFromRaw,
} from "draft-js";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import moment from "moment";
import { useSelector } from "react-redux";
import { db } from "../firebaseConfig";
import usePostContent from "../hooks/usePostContent";
import Loading from "../components/UI/Loading";
import Comment from "../components/Comment/Comment";
import decorator from "../components/Editor/mediaDecorator";

function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const { isLoading: LoadPostContent, data: post } = usePostContent(postId);
  const [isPostMenu, setIsPostMenu] = useState(false);
  const isLiked = currentUser ? post?.likeby?.includes(currentUser.uid) : false;
  const isCollected = currentUser
    ? post?.collectby?.includes(currentUser.uid)
    : false;
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    if (post) {
      const data = post.stateContent;
      if (data) {
        const contentState = convertFromRaw(JSON.parse(data));
        setEditorState(EditorState.createWithContent(contentState, decorator));
      }
    }
  }, [post]);

  const toggle = (isActive, field) => {
    if (isActive) {
      updateDoc(doc(db, `posts/${postId}`), {
        [field]: arrayRemove(currentUser.uid),
      });
    } else {
      updateDoc(doc(db, `posts/${postId}`), {
        [field]: arrayUnion(currentUser.uid),
      });
    }
  };

  const postEdit = () => {
    navigate(`/edit/${postId}`);
  };

  const postDelete = async () => {
    await deleteDoc(doc(db, `posts/${postId}`));
    navigate(-1);
  };

  const handlePostMenu = () => {
    setIsPostMenu((pre) => !pre);
  };

  return (
    <div className="Post-box">
      {LoadPostContent ? (
        <Loading />
      ) : (
        <>
          <div className="Post-background" />
          <div className="Post-content-box">
            <div className="Post-content-container">
              {currentUser?.uid === post?.author?.uid && (
                <>
                  <div
                    onClick={() => handlePostMenu()}
                    className="Post-posts-menu-icon-container"
                  >
                    <img
                      className="Post-posts-menu-icon"
                      src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png"
                      alt="選項"
                    />
                  </div>
                  {isPostMenu ? (
                    <div className="Post-posts-menu-box">
                      <div onClick={() => postEdit()}>編輯</div>
                      <div onClick={() => postDelete()}>刪除</div>
                      <div className="Post-comments-box-cube" />
                    </div>
                  ) : null}
                </>
              )}
              <Link
                to={`/personal/${post?.author?.uid}`}
                className="Post-personal-information-container"
              >
                <div className="Post-personal-information item">
                  <div className="Post-avatar-container">
                    <img
                      className="Post-avatar"
                      src={post?.author?.photoURL}
                      alt=""
                    />
                  </div>
                  <div className="Post-information-container">
                    <div className="Post-name">{post?.author?.name}</div>
                    <div className="Post-date">
                      {post?.categoryName}
                      ・
                      {post?.createTime
                      && moment(post?.createTime.toDate()).format(
                        "YYYY/MM/DD h:mm a",
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              <div>
                <div className="Post-title item">{post?.title}</div>
                <div className="Post-text-container item">
                  <Editor editorState={editorState} readOnly />
                </div>
              </div>
              <div className="Post-like-message-container">
                <div className="Post-like-icon-container">
                  <img
                    className="Post-like-message-icon"
                    src="https://cdn-icons-png.flaticon.com/128/1029/1029132.png"
                    alt="讚"
                  />
                </div>
                <div>{post?.likeby?.length}</div>
                <div className="Post-message-icon-container">
                  <img
                    className="Post-like-message-icon"
                    src="https://cdn-icons-png.flaticon.com/512/2190/2190552.png"
                    alt="留言"
                  />
                </div>
                <div>{post?.commentsCount || 0}</div>
                <div
                  onClick={() => toggle(isLiked, "likeby")}
                  className="Post-like-button-icon-container"
                >
                  <img
                    className="Post-like-message-icon"
                    src={
                      isLiked
                        ? "https://cdn-icons-png.flaticon.com/512/833/833472.png"
                        : "https://cdn-icons-png.flaticon.com/512/833/833300.png"
                    }
                    alt="讚"
                  />
                </div>
                <div
                  onClick={() => toggle(isCollected, "collectby")}
                  className="Post-collect-button-icon-container"
                >
                  <img
                    className="Post-like-message-icon"
                    src={
                      isCollected
                        ? "https://cdn-icons-png.flaticon.com/512/758/758688.png"
                        : "https://cdn-icons-png.flaticon.com/512/709/709496.png"
                    }
                    alt="收藏"
                  />
                </div>
              </div>
            </div>
            <Comment />
          </div>
        </>
      )}
    </div>
  );
}
export default Post;

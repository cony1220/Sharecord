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
import mediaBlockRenderer from "../components/Editor/mediaBlockRenderer";
import postOptionsIcon from "../assets/icons/post-options.png";
import likeCountIcon from "../assets/icons/like.png";
import likeButtonIcon from "../assets/icons/like-outline.png";
import likeButtonActiveIcon from "../assets/icons/like-filled.png";
import commentIcon from "../assets/icons/comment.png";
import collectButtonIcon from "../assets/icons/bookmark-outline.png";
import collectButtonActiveIcon from "../assets/icons/bookmark-filled.png";
import defaultAvatar from "../assets/icons/default-avatar.png";

function Post() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { auth: authUser } = useSelector((state) => state.user);
  const { isLoading: LoadPostContent, data: post } = usePostContent(postId);
  const [isPostMenu, setIsPostMenu] = useState(false);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const author = post?.author || {};
  const currentUid = authUser?.uid;

  const isOwner = currentUid && currentUid === author.uid;
  const isLiked = currentUid ? post?.likeby?.includes(currentUid) : false;
  const isCollected = currentUid ? post?.collectby?.includes(currentUid) : false;

  useEffect(() => {
    if (!post?.stateContent) return;

    const content = convertFromRaw(JSON.parse(post.stateContent));
    setEditorState(EditorState.createWithContent(content));
  }, [post]);

  useEffect(() => {
    const handleClickOutside = () => setIsPostMenu(false);

    if (isPostMenu) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isPostMenu]);

  const toggle = async (isActive, field) => {
    if (!currentUid) return;

    try {
      await updateDoc(doc(db, `posts/${postId}`), {
        [field]: isActive ? arrayRemove(currentUid) : arrayUnion(currentUid),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const postEdit = () => {
    navigate(`/edit/${postId}`);
  };

  const postDelete = async () => {
    await deleteDoc(doc(db, `posts/${postId}`));
    navigate(-1);
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
              {/* owner menu */}
              {isOwner && (
                <>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPostMenu((pre) => !pre);
                    }}
                    className="Post-posts-menu-icon-container"
                  >
                    <img
                      className="Post-posts-menu-icon"
                      src={postOptionsIcon}
                      alt="選項"
                    />
                  </div>
                  {isPostMenu && (
                    <div className="Post-posts-menu-box">
                      <div onClick={postEdit}>編輯</div>
                      <div onClick={postDelete}>刪除</div>
                      <div className="Post-comments-box-cube" />
                    </div>
                  )}
                </>
              )}

              {/* author info */}
              <Link
                to={author.uid ? `/personal/${author.uid}` : "#"}
                className="Post-personal-information-container"
              >
                <div className="Post-personal-information item">
                  <div className="Post-avatar-container">
                    <img
                      className="Post-avatar"
                      src={author.photoURL || defaultAvatar}
                      alt="avatar"
                    />
                  </div>
                  <div className="Post-information-container">
                    <div className="Post-name">{author.name || "使用者"}</div>
                    <div className="Post-date">
                      {post?.categoryName}
                      ・
                      {post?.createTime
                        ? moment(post.createTime).format(
                          "YYYY/MM/DD h:mm a",
                        )
                        : ""}
                    </div>
                  </div>
                </div>
              </Link>

              {/* content */}
              <div>
                <div className="Post-title item">{post?.title}</div>
                <div className="Post-text-container item">
                  <Editor
                    editorState={editorState}
                    readOnly
                    blockRendererFn={mediaBlockRenderer}
                  />
                </div>
              </div>

              {/* actions */}
              <div className="Post-like-message-container">
                <div className="Post-like-icon-container">
                  <img
                    className="Post-like-message-icon"
                    src={likeCountIcon}
                    alt="讚"
                  />
                </div>
                <div>{post?.likeby?.length || 0}</div>
                <div className="Post-message-icon-container">
                  <img
                    className="Post-like-message-icon"
                    src={commentIcon}
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
                        ? likeButtonActiveIcon
                        : likeButtonIcon
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
                        ? collectButtonActiveIcon
                        : collectButtonIcon
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

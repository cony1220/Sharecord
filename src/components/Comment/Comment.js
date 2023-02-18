import React, { useState } from "react";
import { useParams } from "react-router-dom";

import {
  doc,
  writeBatch,
  increment,
  collection,
  Timestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { db } from "../../firebaseConfig";
import useComments from "../../hooks/useComments";
import CommentItem from "./CommentItem";
import classes from "./Comment.module.css";

function Comment() {
  const [commentContent, setCommentContent] = useState("");
  const { postId } = useParams();
  const currentUser = useSelector((state) => state.user.user);
  const { isLoading: LoadComments, data: comments } = useComments(
    `posts/${postId}/comments`,
  );
  const [isMenu, setIsMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [clickedCommentId, setClickedCommentId] = useState("");

  const toggleMenu = (id) => {
    if (isEdit) {
      setIsEdit(false);
    }
    if (clickedCommentId === id) {
      setIsMenu((pre) => !pre);
    } else if (isMenu === false) {
      setIsMenu((pre) => !pre);
    }
    setClickedCommentId(id);
  };

  const closeMenu = () => {
    setIsMenu(false);
  };

  const openEdit = () => {
    setIsEdit(true);
  };

  const closeEdit = () => {
    setIsEdit(false);
  };

  const commentSubmit = async () => {
    if (commentContent) {
      const batch = writeBatch(db);
      const ref = collection(db, `posts/${postId}/comments`);
      batch.update(doc(db, `posts/${postId}`), {
        commentsCount: increment(1),
      });
      batch.set(doc(ref), {
        content: commentContent,
        createTime: Timestamp.now(),
        author: {
          uid: currentUser.uid,
          name: currentUser.displayName || "使用者",
          photoURL:
            currentUser.photoURL
            || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        },
      });
      await batch.commit();
      setCommentContent("");
    }
  };

  if (LoadComments) {
    return <div className="center">loading...</div>;
  }

  return (
    <div className={classes["message-container"]}>
      <div className={classes["message-title"]}>留言</div>
      <div className={classes["user-message-box"]}>
        <img
          className={classes["user-message-avatar"]}
          src={
            currentUser
            && (currentUser.photoURL
              || "https://cdn-icons-png.flaticon.com/512/847/847969.png")
          }
          alt=""
        />
        <div className={classes["user-message-input-container"]}>
          <textarea
            className={classes["user-message-input"]}
            placeholder="撰寫留言"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          />
          <button
            type="button"
            onClick={commentSubmit}
            className={`${classes["user-message-next"]} ${
              !commentContent && classes.gray
            }`}
            disabled={!commentContent}
          >
            送出
          </button>
        </div>
      </div>
      {comments.map((item) => (
        <CommentItem
          key={item.id}
          item={item}
          isMenu={isMenu}
          closeMenu={closeMenu}
          toggleMenu={toggleMenu}
          clickedCommentId={clickedCommentId}
          isEdit={isEdit}
          openEdit={openEdit}
          closeEdit={closeEdit}
        />
      ))}
    </div>
  );
}

export default Comment;

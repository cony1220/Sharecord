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
  const [content, setContent] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [mode, setMode] = useState(null); // "menu" | "edit" | null
  const { postId } = useParams();
  const { auth: authUser, profile } = useSelector((state) => state.user);
  const { isLoading, comments } = useComments(
    `posts/${postId}/comments`,
  );

  const handleSubmit = async () => {
    if (!content.trim() || !authUser?.uid) return;

    const batch = writeBatch(db);
    const ref = collection(db, `posts/${postId}/comments`);

    batch.update(doc(db, `posts/${postId}`), {
      commentsCount: increment(1),
    });

    batch.set(doc(ref), {
      content,
      createTime: Timestamp.now(),
      author: {
        uid: authUser.uid,
        name: profile?.name,
        photoURL: profile?.photoURL,
      },
    });

    await batch.commit();
    setContent("");
  };

  if (isLoading) {
    return <div className="center">loading...</div>;
  }

  return (
    <div className={classes["message-container"]}>
      <div className={classes["message-title"]}>留言</div>

      {/* input */}
      <div className={classes["user-message-box"]}>
        <img
          className={classes["user-message-avatar"]}
          src={profile?.photoURL}
          alt="avatar"
        />
        <div className={classes["user-message-input-container"]}>
          <textarea
            className={classes["user-message-input"]}
            placeholder="撰寫留言"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className={`${classes["user-message-next"]} ${
              !content && classes.gray
            }`}
            disabled={!content.trim()}
          >
            送出
          </button>
        </div>
      </div>

      {/* list */}
      {comments.map((item) => (
        <CommentItem
          key={item.id}
          item={item}
          activeId={activeId}
          mode={mode}
          setActiveId={setActiveId}
          setMode={setMode}
        />
      ))}
    </div>
  );
}

export default Comment;

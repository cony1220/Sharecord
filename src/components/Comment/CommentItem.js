import React, { useState } from "react";

import {
  doc, updateDoc, writeBatch, increment,
} from "firebase/firestore";
import moment from "moment";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { db } from "../../firebaseConfig";
import classes from "./CommentItem.module.css";

function CommentItem({
  item, isMenu, closeMenu, toggleMenu, clickedCommentId, isEdit, openEdit, closeEdit,
}) {
  const [commentEditContent, setCommentEditContent] = useState("");
  const { postId } = useParams();
  const currentUser = useSelector((state) => state.user.user);

  const commentDelete = async () => {
    const batch = writeBatch(db);
    batch.update(doc(db, `posts/${postId}`), {
      commentsCount: increment(-1),
    });
    batch.delete(doc(db, `posts/${postId}/comments/${item.id}`));
    await batch.commit();
    closeMenu();
  };

  const handleEdit = () => {
    openEdit();
    closeMenu();
    setCommentEditContent(item.content);
  };

  const commentEditSubmit = async () => {
    await updateDoc(doc(db, `posts/${postId}/comments/${item.id}`), {
      content: commentEditContent,
    });
    closeEdit();
  };

  const cancelEdit = () => {
    closeEdit();
  };

  return (
    <div className={classes["comments-container"]}>
      {currentUser?.uid === item.author.uid && (
        <>
          <div
            onClick={() => toggleMenu(item.id)}
            className={classes["comments-menu-container"]}
          >
            <img
              className={classes["comments-menu-icon"]}
              src="https://cdn-icons-png.flaticon.com/128/2089/2089793.png"
              alt="選項"
            />
          </div>
          {isMenu && clickedCommentId === item.id && (
            <div className={classes["comments-menu-box"]}>
              <div onClick={() => handleEdit(item.content)}>編輯</div>
              <div onClick={() => commentDelete()}>刪除</div>
              <div className={classes["comments-box-cube"]} />
            </div>
          )}
        </>
      )}
      <div className={classes["comments-avatar-container"]}>
        <img
          className={classes["comments-avatar"]}
          src={item.author.photoURL}
          alt="avatar"
        />
      </div>
      <div className={classes["comments-name-content-container"]}>
        <div>
          {item.author.name}
          ・
          <span className={classes["comments-createtime"]}>
            {moment(item.createTime.toDate()).format("YYYY/MM/DD h:mm a")}
          </span>
        </div>
        {isEdit && clickedCommentId === item.id ? (
          <>
            <div className={classes["comments-content"]}>
              <textarea
                onChange={(e) => setCommentEditContent(e.target.value)}
                className={classes["user-message-input"]}
                value={commentEditContent}
              />
            </div>
            <div className={classes["comments-edit-button-container"]}>
              <button
                className={classes["comments-edit-cancel-button"]}
                onClick={cancelEdit}
                type="button"
              >
                取消
              </button>
              <button
                className={classes["comments-edit-next-button"]}
                onClick={() => commentEditSubmit(item.id)}
                type="button"
              >
                完成
              </button>
            </div>
          </>
        ) : (
          <div className={classes["comments-content"]}>{item.content}</div>
        )}
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  isMenu: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  clickedCommentId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool.isRequired,
  openEdit: PropTypes.func.isRequired,
  closeEdit: PropTypes.func.isRequired,
};

export default CommentItem;

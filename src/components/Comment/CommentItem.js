import React, { useState } from "react";

import {
  doc, updateDoc, writeBatch, increment,
} from "firebase/firestore";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../../firebaseConfig";
import classes from "./CommentItem.module.css";
import menuIcon from "../../assets/icons/menu.png";

function CommentItem({
  item,
  activeId,
  mode,
  setActiveId,
  setMode,
}) {
  const [editContent, setEditContent] = useState("");
  const { postId } = useParams();
  const { auth: authUser } = useSelector((state) => state.user);

  const isOwner = authUser?.uid === item.author.uid;
  const isActive = activeId === item?.id;

  const openMenu = () => {
    const isSame = activeId === item.id && mode === "menu";

    setActiveId(isSame ? null : item.id);
    setMode(isSame ? null : "menu");
  };

  const openEdit = () => {
    setEditContent(item.content);
    setActiveId(item.id);
    setMode("edit");
  };

  const close = () => {
    setMode(null);
    setActiveId(null);
  };

  const handleDelete = async () => {
    const batch = writeBatch(db);

    batch.update(doc(db, `posts/${postId}`), {
      commentsCount: increment(-1),
    });

    batch.delete(doc(db, `posts/${postId}/comments/${item.id}`));

    await batch.commit();
    close();
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;

    await updateDoc(doc(db, `posts/${postId}/comments/${item.id}`), {
      content: editContent,
    });

    close();
  };

  return (
    <div className={classes["comments-container"]}>
      {/* menu */}
      {isOwner && (
        <>
          <div
            onClick={openMenu}
            className={classes["comments-menu-container"]}
          >
            <img
              className={classes["comments-menu-icon"]}
              src={menuIcon}
              alt="選項"
            />
          </div>
          {mode === "menu" && isActive && (
            <div className={classes["comments-menu-box"]}>
              <div onClick={openEdit}>編輯</div>
              <div onClick={handleDelete}>刪除</div>
              <div className={classes["comments-box-cube"]} />
            </div>
          )}
        </>
      )}

      {/* avatar */}
      <div className={classes["comments-avatar-container"]}>
        <img
          className={classes["comments-avatar"]}
          src={item.author.photoURL}
          alt="avatar"
        />
      </div>

      {/* content */}
      <div className={classes["comments-name-content-container"]}>
        <div>
          {item.author.name}
          ・
          <span className={classes["comments-createtime"]}>
            {item.createTime
              ? moment(item.createTime).format("YYYY/MM/DD h:mm a")
              : ""}
          </span>
        </div>
        {mode === "edit" && isActive ? (
          <>
            <div className={classes["comments-content"]}>
              <textarea
                onChange={(e) => setEditContent(e.target.value)}
                className={classes["user-message-input"]}
                value={editContent}
              />
            </div>
            <div className={classes["comments-edit-button-container"]}>
              <button
                className={classes["comments-edit-cancel-button"]}
                onClick={close}
                type="button"
              >
                取消
              </button>
              <button
                className={classes["comments-edit-next-button"]}
                onClick={handleEditSubmit}
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

export default CommentItem;

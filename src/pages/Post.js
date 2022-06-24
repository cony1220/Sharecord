import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../Styles/Post.css";
import {
  Editor, EditorState, convertFromRaw, CompositeDecorator,
} from "draft-js";
import {
  query, doc, updateDoc, arrayUnion, orderBy, arrayRemove,
  onSnapshot, writeBatch, increment, collection, Timestamp, deleteDoc,
} from "firebase/firestore";
import moment from "moment";
import { db, auth } from "../firebaseConfig";
import { useAuth } from "../hooks/useAuth";

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null
        && contentState.getEntity(entityKey).getType().toLowerCase() === "image"
      );
    },
    callback,
  );
}
function Image(props) {
  const {
    src,
  } = props.contentState.getEntity(props.entityKey).getData();
  return (
    <img src={src} alt="" />
  );
}
function Post() {
  const [post, setPost] = useState({
    author: {},
  });
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [isMenu, setIsMenu] = useState(false);
  const [clickedComment, setClickedComment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [commentEditContent, setCommentEditContent] = useState("");
  const [isPostMenu, setIsPostMenu] = useState(false);
  const navigator = useNavigate();
  const isLiked = auth.currentUser ? post.likeby?.includes(auth.currentUser.uid) : false;
  const isCollected = auth.currentUser ? post.collectby?.includes(auth.currentUser.uid) : false;
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const decorator = new CompositeDecorator([
    {
      strategy: findImageEntities,
      component: Image,
    },
  ]);
  useEffect(() => {
    onSnapshot(doc(db, `posts/${postId}`), (docSnap) => {
      setPost(docSnap.data());
      if (docSnap.data()) {
        const data = docSnap.data().stateContent;
        const contentState = convertFromRaw(JSON.parse(data));
        setEditorState(EditorState.createWithContent(contentState, decorator));
      }
    });
  }, []);
  useEffect(() => {
    const ref = collection(db, `posts/${postId}/comments`);
    const q = query(ref, orderBy("createTime"));
    onSnapshot(q, (colSnap) => {
      const data = colSnap.docs.map((comment) => ({ ...comment.data(), id: comment.id }));
      setComments(data);
    });
  }, []);
  const toggle = (isActive, field) => {
    if (isActive) {
      updateDoc(doc(db, `posts/${postId}`), {
        [field]: arrayRemove(auth.currentUser.uid),
      });
    } else {
      updateDoc(doc(db, `posts/${postId}`), {
        [field]: arrayUnion(auth.currentUser.uid),
      });
    }
  };
  const commentSubmit = async () => {
    const batch = writeBatch(db);
    const ref = collection(db, `posts/${postId}/comments`);
    batch.update(doc(db, `posts/${postId}`), {
      commentsCount: increment(1),
    });
    batch.set(doc(ref), {
      content: commentContent,
      createTime: Timestamp.now(),
      author: {
        uid: auth.currentUser.uid,
        name: auth.currentUser.displayName || "使用者",
        photoURL: auth.currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      },
    });
    await batch.commit();
    setCommentContent("");
  };
  const handleMenu = (id) => {
    if (isEdit) {
      setIsEdit(false);
    }
    if (clickedComment === id) {
      setIsMenu((pre) => !pre);
    } else if (isMenu === false) {
      setIsMenu((pre) => !pre);
    } else {
      setIsMenu((pre) => pre);
    }
    setClickedComment(id);
  };
  const commentDelete = async (id) => {
    const batch = writeBatch(db);
    batch.update(doc(db, `posts/${postId}`), {
      commentsCount: increment(-1),
    });
    batch.delete(doc(db, `posts/${postId}/comments/${id}`));
    await batch.commit();
    setIsMenu(false);
  };
  const handleEdit = () => {
    setIsEdit(true);
    setIsMenu(false);
  };
  const commentEdit = async (id) => {
    await updateDoc(doc(db, `posts/${postId}/comments/${id}`), {
      content: commentEditContent,
    });
    setIsEdit(false);
  };
  const cancelEdit = () => {
    setIsEdit(false);
  };
  const postEdit = () => {
    navigator(`/edit/${postId}`);
  };
  const postDelete = () => {
    deleteDoc(doc(db, `posts/${postId}`));
    navigator(-1);
  };
  const handlePostMenu = () => {
    setIsPostMenu((pre) => !pre);
  };
  return (
    <div className="Post-box">
      <div className="Post-background" />
      <div className="Post-content-box">
        <div className="Post-content-container">
          {auth.currentUser?.uid === post.author.uid
            && (
              <>
                <div onClick={() => handlePostMenu()} className="Post-posts-menu-icon-container">
                  <img className="Post-posts-menu-icon" src="https://cdn-icons-png.flaticon.com/512/1160/1160515.png" alt="選項" />
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
          <Link to={`/personal/${post.author.uid}`} className="Post-personal-information-container">
            <div className="Post-personal-information item">
              <div className="Post-avatar-container">
                <img className="Post-avatar" src={post.author.photoURL} alt="" />
              </div>
              <div className="Post-information-container">
                <div className="Post-name">{post.author.name}</div>
                <div className="Post-date">
                  {post.categoryName}
                  ・
                  {post.createTime && moment(post.createTime.toDate()).format("YYYY/MM/DD h:mm a")}
                </div>
              </div>
            </div>
          </Link>
          <div>
            <div className="Post-title item">{post.title}</div>
            <div className="Post-text-container item">
              <Editor editorState={editorState} readOnly />
            </div>
          </div>
          <div className="Post-like-message-container">
            <div className="Post-like-icon-container">
              <img className="Post-like-message-icon" src="https://cdn-icons-png.flaticon.com/128/1029/1029132.png" alt="讚" />
            </div>
            <div>{post.likeby?.length}</div>
            <div className="Post-message-icon-container">
              <img className="Post-like-message-icon" src="https://cdn-icons-png.flaticon.com/512/2190/2190552.png" alt="留言" />
            </div>
            <div>{post.commentsCount || 0}</div>
            <div onClick={() => toggle(isLiked, "likeby")} className="Post-like-button-icon-container">
              <img className="Post-like-message-icon" src={isLiked ? "https://cdn-icons-png.flaticon.com/512/833/833472.png" : "https://cdn-icons-png.flaticon.com/512/833/833300.png"} alt="讚" />
            </div>
            <div onClick={() => toggle(isCollected, "collectby")} className="Post-collect-button-icon-container">
              <img className="Post-like-message-icon" src={isCollected ? "https://cdn-icons-png.flaticon.com/512/758/758688.png" : "https://cdn-icons-png.flaticon.com/512/709/709496.png"} alt="收藏" />
            </div>
          </div>
        </div>
        <div className="Post-message-container">
          <div className="Post-message-title">留言</div>
          <div className="Post-user-message-box">
            <img className="Post-user-message-avatar" src={auth.currentUser && auth.currentUser.photoURL ? auth.currentUser.photoURL : "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt="" />
            <div className="Post-user-message-input-container">
              <textarea
                className="Post-user-message-input"
                placeholder="撰寫留言"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <div onClick={commentSubmit} className="Post-user-message-next">送出</div>
            </div>
          </div>
          {comments.map((item) => (
            <div className="Post-comments-container" key={item.id}>
              {auth.currentUser?.uid === item.author.uid
                && (
                  <>
                    <div onClick={() => handleMenu(item.id)} className="Post-comments-menu-container">
                      <img className="Post-comments-menu-icon" src="https://cdn-icons-png.flaticon.com/128/2089/2089793.png" alt="選項" />
                    </div>
                    {isMenu && clickedComment === item.id ? (
                      <div className="Post-comments-menu-box">
                        <div onClick={() => handleEdit(item.id)}>編輯</div>
                        <div onClick={() => commentDelete(item.id)}>刪除</div>
                        <div className="Post-comments-box-cube" />
                      </div>
                    ) : null}
                  </>
                )}
              <div className="Post-comments-avatar-container">
                <img className="Post-comments-avatar" src={item.author.photoURL} alt="avatar" />
              </div>
              <div className="Post-comments-name-content-container">
                <div>
                  {item.author.name}
                  ・
                  <span className="Post-comments-createtime">{moment(item.createTime.toDate()).format("YYYY/MM/DD h:mm a")}</span>
                </div>
                {isEdit && clickedComment === item.id ? (
                  <>
                    <div className="Post-comments-content">
                      <textarea onChange={(e) => setCommentEditContent(e.target.value)} className="Post-user-message-input" defaultValue={item.content} />
                    </div>
                    <div className="Post-comments-edit-button-container">
                      <button className="Post-comments-edit-cancel-button" onClick={cancelEdit} type="button">取消</button>
                      <button className="Post-comments-edit-next-button" onClick={() => commentEdit(item.id)} type="button">完成</button>
                    </div>
                  </>
                )
                  : <div className="Post-comments-content">{item.content}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Post;

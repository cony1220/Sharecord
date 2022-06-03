import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Post.css";
import { Editor, EditorState, convertFromRaw, CompositeDecorator } from "draft-js";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDoc, query, where, doc,
}
  from "firebase/firestore";
import moment from "moment";
import { db, auth } from "../firebaseConfig";

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
  const [currentUser, setCurrentUser] = useState({});
  const [post, setPost] = useState({
    author: {},
  });
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const decorator = new CompositeDecorator([
    {
      strategy: findImageEntities,
      component: Image,
    },
  ]);
  const { postId } = useParams();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, `posts/${postId}`));
      setPost(docSnap.data());
      const contentState = convertFromRaw(JSON.parse(docSnap.data().stateContent));
      setEditorState(EditorState.createWithContent(contentState, decorator));
    };
    getPost();
  }, []);
  return (
    <div className="Post-box">
      <div className="Post-background" />
      <div className="Post-content-box">
        <div className="Post-content-container">
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
          <div>
            <div className="Post-title item">{post.title}</div>
            <div className="Post-text-container item">
              <Editor editorState={editorState} readOnly />
            </div>
          </div>
          <div className="Post-like-message-container">
            <div className="Post-like-container">
              <img className="Post-like" src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="讚" />
            </div>
            <div>0</div>
            <div className="Post-message-container">
              <img className="Post-message" src="https://cdn-icons-png.flaticon.com/128/2462/2462719.png" alt="留言" />
            </div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Post;

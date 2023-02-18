import React, { useState, useEffect } from "react";
import {
  Link, useNavigate, useParams, Navigate,
} from "react-router-dom";

import "../Styles/Createpost.css";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  AtomicBlockUtils,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import moment from "moment";
import { useSelector } from "react-redux";
import { db, storage, auth } from "../firebaseConfig";
import mediaBlockRenderer from "../components/Editor/mediaBlockRenderer";
import Loading from "../components/UI/Loading";
import useHttp from "../hooks/use-http";
import { getAllCategories, getDocumentData } from "../lib/api";
import ToolBar from "../components/Editor/ToolBar";
import decorator from "../components/Editor/mediaDecorator";

function Edit() {
  const { postId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const currentUser = useSelector((state) => state.user.user);

  const {
    sendRequest: getcategoryList,
    data: categoryList,
    isLoading: LoadCategory,
    error: categoryListError,
  } = useHttp(getAllCategories, true);

  const {
    sendRequest: getPost,
    data: post,
    isLoading: LoadPost,
    error: postError,
  } = useHttp(getDocumentData, true);

  useEffect(() => {
    getcategoryList("category");
    getPost(`posts/${postId}`);
  }, [getcategoryList, getPost]);

  useEffect(() => {
    if (post) {
      setCategoryName(post.categoryName);
      setTitle(post.title);
      const data = post.stateContent;
      if (data) {
        const contentState = convertFromRaw(JSON.parse(data));
        setEditorState(EditorState.createWithContent(contentState, decorator));
      }
    }
  }, [post]);

  const handleKeyCommand = (command, editorStateParam) => {
    const newState = RichUtils.handleKeyCommand(editorStateParam, command);
    if (newState) {
      setEditorState(newState);
      return "handle";
    }

    return "not-handled";
  };

  const handleTogggleClick = (e, inlineStyle) => {
    e.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const undoHandler = () => {
    if (editorState.getUndoStack().size > 0) {
      setEditorState(EditorState.undo(editorState));
    }
  };

  const handleInsertImage = (file) => {
    const imageRef = ref(
      storage,
      `post-images/${auth.currentUser.uid}/${v4()}`,
    );
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((src) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
          "image",
          "IMMUTABLE",
          { src },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });
        setEditorState(
          AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
        );
      });
    });
  };

  const handleSubmit = async () => {
    const editorContent = convertToRaw(editorState.getCurrentContent());
    let pureText = "";
    let firstPicture = "";
    const keywords = [];
    for (let i = 0; i < editorContent.blocks.length; i += 1) {
      pureText += editorContent.blocks[i].text;
      if (pureText.length >= 100) {
        pureText = pureText.substr(0, 100);
        break;
      }
    }
    for (let i = 0; i < Object.keys(editorContent.entityMap).length; i += 1) {
      if (editorContent.entityMap[i].type === "image") {
        firstPicture = editorContent.entityMap[i].data.src;
        break;
      } else {
        firstPicture = "";
      }
    }
    for (let i = 0; i < title.length; i += 1) {
      for (let j = i + 1; j < title.length + 1; j += 1) {
        keywords.push(title.slice(i, j));
      }
    }
    await updateDoc(doc(db, `posts/${postId}`), {
      categoryName,
      title,
      keywords,
      stateContent: JSON.stringify(
        convertToRaw(editorState.getCurrentContent()),
      ),
      htmlContent: stateToHTML(editorState.getCurrentContent()),
      pureText,
      firstPicture: firstPicture || "",
    });
    navigate("/home/all");
  };

  if (categoryListError) {
    return <div className="center">{categoryListError}</div>;
  }

  if (postError) {
    return <div className="center">{postError}</div>;
  }

  if (post) {
    if (post.author.uid !== currentUser.uid) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="Createpost-box">
      {LoadCategory || LoadPost ? (
        <Loading />
      ) : (
        <>
          <div className="Createpost-background" />
          <div className="Createpost-content-box">
            <div className="Createpost-content-container">
              <div className="Createpost-category-select-container item">
                <select
                  className="Createpost-category-select"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                >
                  <option value="" disabled hidden>
                    選擇類別
                  </option>
                  {categoryList.map((item) => (
                    <option value={item.name} key={`${item.id}`}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="Createpost-personal-information item">
                <div className="Createpost-avatar-container">
                  <img
                    className="Createpost-avatar"
                    src={post.author?.photoURL}
                    alt=""
                  />
                </div>
                <div className="Createpost-information-container">
                  <div className="Createpost-name">{post.author?.name}</div>
                  <div className="Createpost-date">
                    {moment(post.createTime?.toDate()).format(
                      "YYYY/MM/DD h:mm a",
                    )}
                  </div>
                </div>
              </div>
              <div className="Createpost-title item">
                <input
                  type="text"
                  className="Createpost-input-title"
                  defaultValue={post.title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="Createpost-text-container item">
                <Editor
                  editorState={editorState}
                  onChange={setEditorState}
                  handleKeyCommand={handleKeyCommand}
                  blockRendererFn={mediaBlockRenderer}
                />
              </div>
              <div className="Createpost-toolbar-container">
                <ToolBar
                  handleTogggleClick={handleTogggleClick}
                  handleInsertImage={handleInsertImage}
                  undoHandler={undoHandler}
                />
                <Link to="/home/all" className="Createpost-cancel">
                  取消
                </Link>
                <div onClick={handleSubmit} className="Createpost-next">
                  下一步
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Edit;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../Styles/Createpost.css";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  AtomicBlockUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import moment from "moment";
import { useSelector } from "react-redux";
import { db, storage } from "../firebaseConfig";
import mediaBlockRenderer from "../components/Editor/mediaBlockRenderer";
import Loading from "../components/UI/Loading";
import useHttp from "../hooks/use-http";
import { getAllCategories } from "../lib/api";
import ToolBar from "../components/Editor/ToolBar";

function Createpost() {
  const [categoryName, setCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const {
    sendRequest,
    data: categoryList,
    isLoading: LoadCategory,
    error,
  } = useHttp(getAllCategories, true);

  useEffect(() => {
    sendRequest("category");
  }, [sendRequest]);

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
    const imageRef = ref(storage, `post-images/${currentUser.uid}/${v4()}`);
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
    await addDoc(collection(db, "posts"), {
      categoryName,
      title,
      keywords,
      stateContent: JSON.stringify(
        convertToRaw(editorState.getCurrentContent()),
      ),
      htmlContent: stateToHTML(editorState.getCurrentContent()),
      pureText,
      firstPicture: firstPicture || "",
      likeby: [],
      collectby: [],
      createTime: Timestamp.now(),
      author: {
        name: currentUser.displayName || "使用者",
        uid: currentUser.uid,
        photoURL:
          currentUser.photoURL
          || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      },
    });
    navigate("/home/all");
  };

  if (error) {
    return <div className="center">{error}</div>;
  }

  return (
    <div className="Createpost-box">
      {LoadCategory ? (
        <Loading />
      ) : (
        <>
          <div className="Createpost-background" />
          <div className="Createpost-content-box">
            <div className="Createpost-content-container">
              <div className="Createpost-category-select-container item">
                <select
                  className="Createpost-category-select"
                  defaultValue=""
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
                    src={
                      currentUser
                      && (currentUser.photoURL
                      || "https://cdn-icons-png.flaticon.com/512/847/847969.png")
                    }
                    alt=""
                  />
                </div>
                <div className="Createpost-information-container">
                  <div className="Createpost-name">
                    {currentUser && (currentUser.displayName || "使用者")}
                  </div>
                  <div className="Createpost-date">
                    {moment().format("YYYY/MM/DD h:mm a")}
                  </div>
                </div>
              </div>
              <div className="Createpost-title item">
                <input
                  type="text"
                  className="Createpost-input-title"
                  placeholder="標題"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="Createpost-text-container item">
                <Editor
                  placeholder="寫點什麼吧..."
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
export default Createpost;

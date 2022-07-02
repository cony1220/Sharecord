import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Createpost.css";
import {
  Editor, EditorState, RichUtils, convertToRaw, AtomicBlockUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import {
  collection, addDoc, Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import moment from "moment";
import { db, storage, auth } from "../firebaseConfig";
import mediaBlockRenderer from "../components/mediaBlockRenderer";
import useGetColData from "../hooks/useCollection";
import { useAuth } from "../hooks/useAuth";
import useGetDocData from "../hooks/useDoc";
import Loading from "../components/Loading";

function Createpost() {
  const { currentUser } = useAuth();
  const { isLoading: LoadCategory, data: categoryList } = useGetColData("category");
  const { isLoading: LoadPageOwner, data: pageOwner } = useGetDocData(`users/${currentUser.uid}`);
  const [categoryName, setCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const imageInput = useRef();
  const navigator = useNavigate();
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
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
  const onClickInsertImage = () => {
    imageInput.current.click();
  };
  const handleInsertImage = () => {
    const files = imageInput.current.files || [];
    if (files.length > 0) {
      const imageRef = ref(storage, `post-images/${auth.currentUser.uid}/${v4()}`);
      const file = files[0];
      uploadBytes(imageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((src) => {
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity("image", "IMMUTABLE", { src });
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
          });
          setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
        });
      });
    }
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
      stateContent: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      htmlContent: stateToHTML(editorState.getCurrentContent()),
      pureText,
      firstPicture: firstPicture || "",
      likeby: [],
      collectby: [],
      createTime: Timestamp.now(),
      author: {
        name: auth.currentUser.displayName || "使用者",
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      },
    });
    navigator("/");
  };
  return (
    <div className="Createpost-box">
      {LoadCategory && LoadPageOwner ? <Loading /> : (
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
                  <option value="" disabled hidden>選擇類別</option>
                  {categoryList.map((item) => <option value={item.name} key={`${item.id}`}>{item.name}</option>)}
                </select>
              </div>
              <div className="Createpost-personal-information item">
                <div className="Createpost-avatar-container">
                  <img className="Createpost-avatar" src={pageOwner && pageOwner.photoURL} alt="" />
                </div>
                <div className="Createpost-information-container">
                  <div className="Createpost-name">{pageOwner && pageOwner.name}</div>
                  <div className="Createpost-date">{moment().format("YYYY/MM/DD h:mm a")}</div>
                </div>
              </div>
              <div className="Createpost-title item">
                <input
                  type="text"
                  className="Createpost-input-title"
                  placeholder="標題"
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
                <div className="Createpost-toolbar">
                  <div onMouseDown={(e) => handleTogggleClick(e, "BOLD")} className="Createpost-toolbar-box">
                    <img className="Createpost-toolbar-img" src="https://cdn-icons-png.flaticon.com/512/5099/5099193.png" alt="" />
                  </div>
                  <div onMouseDown={(e) => handleTogggleClick(e, "ITALIC")} className="Createpost-toolbar-box">
                    <img className="Createpost-toolbar-img" src="https://cdn-icons-png.flaticon.com/128/5099/5099214.png" alt="" />
                  </div>
                  <div onMouseDown={(e) => handleTogggleClick(e, "UNDERLINE")} className="Createpost-toolbar-box">
                    <img className="Createpost-toolbar-img" src="https://cdn-icons-png.flaticon.com/512/5099/5099204.png" alt="" />
                  </div>
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onClickInsertImage();
                    }}
                    className="Createpost-toolbar-box"
                  >
                    <img className="Createpost-toolbar-img" src="https://cdn-icons-png.flaticon.com/512/739/739249.png" alt="" />
                  </div>
                  <input accept="image/*" type="file" ref={imageInput} onChange={handleInsertImage} style={{ display: "none" }} />
                  <div
                    disabled={editorState.getUndoStack().size <= 0}
                    onMouseDown={() => setEditorState(EditorState.undo(editorState))}
                    className="Createpost-toolbar-box"
                  >
                    <img className="Createpost-toolbar-img" src="https://cdn-icons-png.flaticon.com/512/44/44426.png" alt="" />
                  </div>
                </div>
                <Link to="/" className="Createpost-cancel">取消</Link>
                <div onClick={handleSubmit} className="Createpost-next">下一步</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Createpost;

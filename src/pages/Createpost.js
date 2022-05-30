import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Createpost.css";
import {
  Editor, EditorState, RichUtils, convertToRaw, AtomicBlockUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";
import { v4 } from "uuid";
import moment from "moment";
import mediaBlockRenderer from "../components/mediaBlockRenderer";

function Createpost() {
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const [user, setUser] = useState({});
  const navigator = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigator("/");
      }
    });
  }, []);
  useEffect(() => {
    const getCategory = async () => {
      const categorys = await getDocs(collection(db, "category"));
      setCategoryList(categorys.docs.map((category) => ({ ...category.data(), id: category.id })));
    };
    getCategory();
  }, []);
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
  const handleInsertImage = () => {
    const src = prompt("Please enter the URL of your picture");
    if (!src) {
      return;
    }
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("image", "IMMUTABLE", { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "));
  };
  const handleSubmit = async () => {
    const editorContent = convertToRaw(editorState.getCurrentContent());
    let pureText = "";
    let firstPicture = "";
    for (let i = 0; i < editorContent.blocks.length; i += 1) {
      pureText += editorContent.blocks[i].text;
      if (pureText.length >= 100) {
        pureText = pureText.substr(0, 100);
        break;
      }
    }
    if (editorContent.entityMap[0]) {
      firstPicture = editorContent.entityMap[0].data.src;
    } else {
      firstPicture = "";
    }
    await addDoc(collection(db, "posts"), {
      categoryName,
      title,
      postText: stateToHTML(editorState.getCurrentContent()),
      pureText,
      firstPicture: firstPicture || "",
      likeby: [],
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
              <img className="Createpost-avatar" src={user && user.photoURL ? user.photoURL : "https://cdn-icons-png.flaticon.com/512/847/847969.png"} alt="" />
            </div>
            <div className="Createpost-information-container">
              <div className="Createpost-name">{user && user.displayName ? user.displayName : "Yourname"}</div>
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
          <Editor
            placeholder="寫點什麼吧..."
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            blockRendererFn={mediaBlockRenderer}
          />
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
                  handleInsertImage();
                }}
                className="Createpost-toolbar-box"
              >
                <img className="Createpost-toolbar-img" src="https://cdn-icons-png.flaticon.com/512/739/739249.png" alt="" />
              </div>
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
        {/* <textarea
          disabled
          value={stateToHTML(editorState.getCurrentContent())}
        /> */}
      </div>
    </div>
  );
}
export default Createpost;

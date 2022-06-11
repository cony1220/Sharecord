import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./Createpost.css";
import {
  Editor, EditorState, RichUtils, convertToRaw, AtomicBlockUtils, CompositeDecorator, convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { stateToHTML } from "draft-js-export-html";
import { collection, getDocs, doc, getDoc, updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage, auth } from "../firebaseConfig";
import { v4 } from "uuid";
import moment from "moment";
import mediaBlockRenderer from "../components/mediaBlockRenderer";

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
function Edit() {
  const { postId } = useParams();
  const [post, setPost] = useState({
    author: {},
  });
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const navigator = useNavigate();
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
    const getCategory = async () => {
      const categorys = await getDocs(collection(db, "category"));
      setCategoryList(categorys.docs.map((category) => ({ ...category.data(), id: category.id })));
    };
    getCategory();
  }, []);
  useEffect(() => {
    const getPost = async () => {
      const docSnap = await getDoc(doc(db, `posts/${postId}`));
      if (auth.currentUser.uid !== docSnap.data().author.uid) {
        navigator("/home");
      } else {
        setPost(docSnap.data());
        setCategoryName(docSnap.data().categoryName);
        setTitle(docSnap.data().title);
        if (docSnap.data()) {
          const data = docSnap.data().stateContent;
          const contentState = convertFromRaw(JSON.parse(data));
          setEditorState(EditorState.createWithContent(contentState, decorator));
        }
      }
    };
    getPost();
  }, []);
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
      stateContent: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      htmlContent: stateToHTML(editorState.getCurrentContent()),
      pureText,
      firstPicture: firstPicture || "",
    });
    navigator("/");
  };
  const show = () => {
    console.log(convertToRaw(editorState.getCurrentContent()));
  };
  return (
    <div className="Createpost-box">
      <div className="Createpost-background" />
      <div className="Createpost-content-box">
        <div className="Createpost-content-container">
          <div className="Createpost-category-select-container item">
            <select
              className="Createpost-category-select"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            >
              <option value="" disabled hidden>選擇類別</option>
              {categoryList.map((item) => <option value={item.name} key={`${item.id}`}>{item.name}</option>)}
            </select>
          </div>
          <div className="Createpost-personal-information item">
            <div className="Createpost-avatar-container">
              <img className="Createpost-avatar" src={post.author.photoURL} alt="" />
            </div>
            <div className="Createpost-information-container">
              <div className="Createpost-name">{ post.author.name}</div>
              <div className="Createpost-date">{moment(post.createTime?.toDate()).format("YYYY/MM/DD h:mm a")}</div>
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
        {/* <div onClick={show}>show</div> */}
      </div>
    </div>
  );
}
export default Edit;

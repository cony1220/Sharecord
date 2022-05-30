import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Createpost.css";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, storage, auth } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import draftToHtml from "draftjs-to-html";
import { v4 } from "uuid";

function Createpost({ isAuth }) {
  const [category, setCategory] = useState([]);
  const [title, setTitle] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [name, setName]=useState("");
  const today = new Date();
  const date=(today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
  const navigator = useNavigate();
  useEffect(() => {
    if (!isAuth) return navigator("/");
    setName(auth.currentUser.displayName);
  }, []);
  useEffect(() => {
    const getCategory = async () => {
      const docsSnap = await getDocs(collection(db, "category"));
      setCategory(docsSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getCategory();
  }, []);
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
  const uploadCallback = (file) => new Promise(
    (resolve) => {
      const imageRef = ref(storage, `post-images/${auth.currentUser.uid}/${v4()}`);
      uploadBytes(imageRef, file).then((snapshot)=>{
        getDownloadURL(snapshot.ref).then((url)=>{
          resolve({ data: { link: url }});
        });
      });
    },
  );
  const handleSubmit = async () => {
    await addDoc(collection(db, "posts"), {
      categoryName,
      title,
      postText:draftToHtml(convertToRaw(editorState.getCurrentContent())),
      author:{
        name:auth.currentUser.displayName,
        id: auth.currentUser.uid
      }
    });
    navigator("/");
  };
  function myBlockRenderer(contentBlock) {
    const type = contentBlock.getType();
    // Convert image type to mediaComponent
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
        props: {
          foo: 'bar',
        },
      };
    }
  }
  class MediaComponent extends React.Component {
    render() {
      const { block, contentState } = this.props;
      const { foo } = this.props.blockProps;
      const data = contentState.getEntity(block.getEntityAt(0)).getData();
      const emptyHtml = ' ';
      return (
        <div>
          {emptyHtml}
          <img
            src={data.src}
            alt={data.alt || ''}
            style={{height: data.height || 'auto', width: data.width || 'auto'}}
          />
        </div>
      );
    }
  }
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
              {category.map((item) => <option value={item.id} key={`${item.id}`}>{item.name}</option>)}
            </select>
          </div>
          <div className="Createpost-personal-information item">
            <img className="Createpost-avatar" src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="" />
            <div className="Createpost-information-container">
              <div className="Createpost-name">{name? name : "Yourname"}</div>
              <div className="Createpost-date">{date}</div>
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
            wrapperClassName="Createpost-wrapper"
            editorClassName="Createpost-editor"
            toolbarClassName="Createpost-toolbar"
            placeholder="寫點什麼吧..."
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ["inline", "emoji", "image", "remove", "history"],
              inline: { options: ["bold", "underline"] },
              image: { uploadCallback, alt: { present: true, mandatory: false } },
              history: { options: ["undo"] },
            }}
            blockRendererFn={myBlockRenderer}
          />
          <div onClick={()=>{console.log((convertToRaw(editorState.getCurrentContent())));}}>show</div>
          <Link to="/" className="Createpost-cancel">取消</Link>
          <div onClick={handleSubmit} className="Createpost-next">下一步</div>
        </div>
        {/* <textarea
         disabled
         value={draftToHtml(convertToRaw(editorState.getCurrentContent()))} /> */}
      </div>
    </div>
  );
}
export default Createpost;

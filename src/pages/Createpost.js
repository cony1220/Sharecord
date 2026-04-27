import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EditorState } from "draft-js";
import { useSelector } from "react-redux";
import moment from "moment";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAllCategories } from "../lib/api";
import { buildPostPayload } from "../lib/post-utils";
import uploadImage from "../lib/uploadImage";
import useHttp from "../hooks/use-http";
import useDraftEditor from "../hooks/useDraftEditor";
import Loading from "../components/UI/Loading";
import PostForm from "../components/Editor/PostForm";
import "../Styles/Createpost.css";
import "draft-js/dist/Draft.css";

function Createpost() {
  const navigate = useNavigate();
  const [category, setCategory] = useState({ id: "", name: "" });
  const [title, setTitle] = useState("");
  const [now] = useState(() => moment().format("YYYY/MM/DD h:mm a"));
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { auth: authUser, profile } = useSelector((state) => state.user);
  const editor = useDraftEditor(editorState, setEditorState);

  const {
    sendRequest,
    data: categoryList,
    isLoading,
    error,
  } = useHttp(getAllCategories, true);

  useEffect(() => {
    sendRequest("category");
  }, [sendRequest]);

  const handleInsertImage = async (file) => {
    if (!authUser?.uid || !file) return;

    const src = await uploadImage(authUser.uid, file);
    editor.insertImage(src);
  };

  const handleSubmit = async () => {
    const payload = buildPostPayload({
      editorState,
      title,
      category,
      authUser,
      profile,
    });

    await addDoc(collection(db, "posts"), payload);
    navigate("/home/all");
  };

  if (error) {
    return <div className="center">{error}</div>;
  }

  return (
    <div className="Createpost-box">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="Createpost-background" />
          <div className="Createpost-content-box">
            <div className="Createpost-content-container">
              <PostForm
                category={category}
                setCategory={setCategory}
                categoryList={categoryList}
                title={title}
                setTitle={setTitle}
                profile={profile}
                time={now}
                editorState={editorState}
                setEditorState={setEditorState}
                editor={editor}
                onInsertImage={handleInsertImage}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Createpost;

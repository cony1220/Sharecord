import React, { useState, useEffect } from "react";
import {
  useNavigate, useParams, Navigate,
} from "react-router-dom";
import { EditorState, convertFromRaw } from "draft-js";
import { useSelector } from "react-redux";
import moment from "moment";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAllCategories, getDocumentData } from "../lib/api";
import { buildPostPayload } from "../lib/post-utils";
import uploadImage from "../lib/uploadImage";
import useHttp from "../hooks/use-http";
import useDraftEditor from "../hooks/useDraftEditor";
import Loading from "../components/UI/Loading";
import PostForm from "../components/Editor/PostForm";
import "../Styles/Createpost.css";
import "draft-js/dist/Draft.css";

function Edit() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({ id: "", name: "" });
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const { auth: authUser, profile } = useSelector((state) => state.user);
  const editor = useDraftEditor(editorState, setEditorState);

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
    if (!post) return;

    setCategory({ id: post.categoryId, name: post.categoryName });
    setTitle(post.title);

    if (post.stateContent) {
      const content = convertFromRaw(JSON.parse(post.stateContent));
      setEditorState(EditorState.createWithContent(content));
    }
  }, [post]);

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
      isEdit: true,
    });

    await updateDoc(doc(db, `posts/${postId}`), payload);
    navigate("/home/all");
  };

  if (categoryListError) {
    return <div className="center">{categoryListError}</div>;
  }

  if (postError) {
    return <div className="center">{postError}</div>;
  }

  if (post && authUser && post.author.uid !== authUser.uid) {
    return <Navigate to="/" replace />;
  }

  const isLoading = LoadCategory || LoadPost;

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
                categoryList={categoryList}
                category={category}
                setCategory={setCategory}
                title={title}
                setTitle={setTitle}
                profile={post?.author}
                time={
                  post?.createTime
                    ? moment(post.createTime).format("YYYY/MM/DD h:mm a")
                    : ""
                }
                editorState={editorState}
                setEditorState={setEditorState}
                editor={editor}
                onInsertImage={handleInsertImage}
                onSubmit={handleSubmit}
                submitText="更新"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Edit;

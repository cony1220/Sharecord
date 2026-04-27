import React from "react";
import { Link } from "react-router-dom";
import { Editor } from "draft-js";
import ToolBar from "./ToolBar";
import mediaBlockRenderer from "./mediaBlockRenderer";
import defaultAvatar from "../../assets/icons/default-avatar.png";

function PostForm({
  category,
  setCategory,
  categoryList,
  title,
  setTitle,
  profile,
  time,
  editorState,
  setEditorState,
  editor,
  onInsertImage,
  onSubmit,
  submitText = "下一步",
}) {
  return (
    <>
      {/* 類別 */}
      <div className="Createpost-category-select-container item">
        <select
          className="Createpost-category-select"
          value={category.id}
          onChange={(e) => {
            const selected = categoryList.find(
              (item) => item.id === e.target.value,
            );
            setCategory({
              id: selected.id,
              name: selected.name,
            });
          }}
        >
          <option value="" disabled hidden>
            選擇類別
          </option>
          {categoryList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* 使用者 */}
      <div className="Createpost-personal-information item">
        <div className="Createpost-avatar-container">
          <img
            className="Createpost-avatar"
            src={profile?.photoURL || defaultAvatar}
            alt="avatar"
          />
        </div>
        <div className="Createpost-information-container">
          <div className="Createpost-name">
            {profile?.displayName || "使用者"}
          </div>
          <div className="Createpost-date">
            {time}
          </div>
        </div>
      </div>

      {/* 標題 */}
      <div className="Createpost-title item">
        <input
          type="text"
          className="Createpost-input-title"
          placeholder="標題"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Editor */}
      <div className="Createpost-text-container item">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={editor.handleKeyCommand}
          blockRendererFn={mediaBlockRenderer}
          placeholder="寫點什麼吧..."
        />
      </div>

      {/* Toolbar + 按鈕 */}
      <div className="Createpost-toolbar-container">
        <ToolBar
          onToggle={editor.toggleInline}
          onInsertImage={onInsertImage}
          onUndo={editor.undo}
        />

        <Link to="/home/all" className="Createpost-cancel">
          取消
        </Link>

        <div onClick={onSubmit} className="Createpost-next">
          {submitText}
        </div>
      </div>
    </>
  );
}

export default PostForm;

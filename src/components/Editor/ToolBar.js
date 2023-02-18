import React, { useRef } from "react";

import PropTypes from "prop-types";
import classes from "./ToolBar.module.css";

function ToolBar({ handleTogggleClick, handleInsertImage, undoHandler }) {
  const imageInput = useRef();

  const onClickInsertImage = () => {
    imageInput.current.click();
  };

  const InputImageChange = () => {
    const files = imageInput.current.files || [];
    if (files.length > 0) {
      const file = files[0];
      handleInsertImage(file);
    }
  };

  return (
    <div className={classes.toolbar}>
      <div
        onMouseDown={(e) => handleTogggleClick(e, "BOLD")}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src="https://cdn-icons-png.flaticon.com/512/5099/5099193.png"
          alt=""
        />
      </div>
      <div
        onMouseDown={(e) => handleTogggleClick(e, "ITALIC")}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src="https://cdn-icons-png.flaticon.com/128/5099/5099214.png"
          alt=""
        />
      </div>
      <div
        onMouseDown={(e) => handleTogggleClick(e, "UNDERLINE")}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src="https://cdn-icons-png.flaticon.com/512/5099/5099204.png"
          alt=""
        />
      </div>
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          onClickInsertImage();
        }}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src="https://cdn-icons-png.flaticon.com/512/739/739249.png"
          alt=""
        />
      </div>
      <input
        accept="image/*"
        type="file"
        ref={imageInput}
        onChange={InputImageChange}
        style={{ display: "none" }}
      />
      <div
        onMouseDown={undoHandler}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src="https://cdn-icons-png.flaticon.com/512/44/44426.png"
          alt=""
        />
      </div>
    </div>
  );
}

ToolBar.propTypes = {
  handleTogggleClick: PropTypes.func.isRequired,
  handleInsertImage: PropTypes.func.isRequired,
  undoHandler: PropTypes.func.isRequired,
};

export default ToolBar;

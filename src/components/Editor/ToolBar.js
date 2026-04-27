import React, { useRef } from "react";
import PropTypes from "prop-types";
import classes from "./ToolBar.module.css";
import boldIcon from "../../assets/icons/bold.png";
import italicIcon from "../../assets/icons/italic.png";
import underlineIcon from "../../assets/icons/underline.png";
import imageIcon from "../../assets/icons/image.png";
import undoIcon from "../../assets/icons/undo.png";

function ToolBar({ onToggle, onInsertImage, onUndo }) {
  const imageInput = useRef();

  const handleImageClick = () => {
    imageInput.current.click();
  };

  const handleImageChange = () => {
    const file = imageInput.current.files?.[0];
    if (file) {
      onInsertImage(file);
    }
  };

  return (
    <div className={classes.toolbar}>
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          onToggle("BOLD");
        }}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src={boldIcon}
          alt="bold"
        />
      </div>
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          onToggle("ITALIC");
        }}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src={italicIcon}
          alt="italic"
        />
      </div>
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          onToggle("UNDERLINE");
        }}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src={underlineIcon}
          alt="underline"
        />
      </div>
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          handleImageClick();
        }}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src={imageIcon}
          alt=""
        />
      </div>
      <input
        accept="image/*"
        type="file"
        ref={imageInput}
        onChange={handleImageChange}
        hidden
      />
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          onUndo();
        }}
        className={classes["toolbar-box"]}
      >
        <img
          className={classes["toolbar-img"]}
          src={undoIcon}
          alt="undo"
        />
      </div>
    </div>
  );
}

ToolBar.propTypes = {
  onToggle: PropTypes.func.isRequired,
  onInsertImage: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
};

export default ToolBar;

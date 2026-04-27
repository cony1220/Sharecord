import React from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import classes from "./Modal.module.css";
import Card from "./Card";
import Button from "./Button";
import successIcon from "../../assets/icons/success.png";
import errorIcon from "../../assets/icons/error.png";

function Backdrop({ onConfirm }) {
  return <div className={classes.backdrop} onClick={onConfirm} />;
}

function ModalOverlay({ onConfirm, message, type }) {
  const icon = type === "success" ? successIcon : errorIcon;

  return (
    <Card className={classes.modal}>
      <img
        src={icon}
        alt={type}
        className={classes.icon}
      />
      <p>{message}</p>
      <footer className={classes.actions}>
        <Button onClick={onConfirm}>Okay</Button>
      </footer>
    </Card>
  );
}

function Modal({ onConfirm, message, type }) {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={onConfirm} />,
        document.getElementById("backdrop-root"),
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          message={message}
          onConfirm={onConfirm}
          type={type}
        />,
        document.getElementById("overlay-root"),
      )}
    </>
  );
}

Modal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
};

Backdrop.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};

ModalOverlay.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
};

export default Modal;

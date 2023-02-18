import React from "react";
import ReactDOM from "react-dom";

import PropTypes from "prop-types";
import classes from "./Modal.module.css";
import Card from "./Card";
import Button from "./Button";

function Backdrop({ onConfirm }) {
  return <div className={classes.backdrop} onClick={onConfirm} />;
}

function ModaltOverlay({ onConfirm, message }) {
  return (
    <Card className={classes.modal}>
      <img src="https://thumbs.gfycat.com/ShyCautiousAfricanpiedkingfisher-max-1mb.gif" alt="finished" />
      <p>{message}</p>
      <footer className={classes.actions}>
        <Button onClick={onConfirm}>Okay</Button>
      </footer>
    </Card>
  );
}

function Modal({ onConfirm, message }) {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={onConfirm} />,
        document.getElementById("backdrop-root"),
      )}
      {ReactDOM.createPortal(
        <ModaltOverlay
          message={message}
          onConfirm={onConfirm}
        />,
        document.getElementById("overlay-root"),
      )}
    </>
  );
}

Modal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

Backdrop.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};

ModaltOverlay.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default Modal;

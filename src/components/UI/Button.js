import React from "react";

import PropTypes from "prop-types";
import classes from "./Button.module.css";

function Button({ onClick, children }) {
  return (
    <button
      className={classes.button}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;

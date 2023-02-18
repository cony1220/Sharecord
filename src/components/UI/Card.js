import React from "react";

import PropTypes from "prop-types";
import classes from "./Card.module.css";

function Card({ children, className }) {
  return (
    <div className={`${classes.card} ${className}`}>{children}</div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

export default Card;

import React from "react";

import PropTypes from "prop-types";
import { CompositeDecorator } from "draft-js";

function findImageEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null
      && contentState.getEntity(entityKey).getType().toLowerCase() === "image"
    );
  }, callback);
}

function Image({ contentState, entityKey }) {
  const { src } = contentState.getEntity(entityKey).getData();
  return <img src={src} alt="" />;
}

const decorator = new CompositeDecorator([
  {
    strategy: findImageEntities,
    component: Image,
  },
]);

Image.propTypes = {
  contentState: PropTypes.oneOfType([PropTypes.object]).isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default decorator;

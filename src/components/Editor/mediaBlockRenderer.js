import React from "react";

import PropTypes from "prop-types";

function Image({ src }) {
  return (
    <img src={src} alt={src} />
  );
}

function Media({ block, contentState }) {
  if (!block.getEntityAt(0)) {
    return null;
  }
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();
  let media;

  if (type === "image") {
    media = <Image src={src} />;
  }

  return media;
}

const mediaBlockRenderer = (block) => {
  if (block.getType() === "atomic") {
    return {
      component: Media,
      editable: false,
    };
  }

  return null;
};

Media.propTypes = {
  block: PropTypes.oneOfType([PropTypes.object]).isRequired,
  contentState: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
};

export default mediaBlockRenderer;

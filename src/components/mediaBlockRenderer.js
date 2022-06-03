import React from "react";

function Image(props) {
  return (
    <img src={props.src} alt={props.src} role="presentation" />
  );
}
function Media(props) {
  if (!props.block.getEntityAt(0)) return null;
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
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
export default mediaBlockRenderer;

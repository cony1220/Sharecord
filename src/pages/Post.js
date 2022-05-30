import React from "react";
import { useParams } from "react-router-dom";

function Post() {
  const { postId } = useParams();
  return (
    <div className="Home-box">
      <div className="Home-background">{postId}</div>
    </div>
  );
}
export default Post;

import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";
import likeIcon from "../../assets/icons/like.png";
import commentIcon from "../../assets/icons/comment.png";
import defaultAvatar from "../../assets/icons/default-avatar.png";

function PostItem({ item }) {
  const {
    id,
    title = "",
    pureText = "",
    categoryName = "",
    createTime,
    firstPicture,
    likeby = [],
    commentsCount = 0,
    author = {},
  } = item || {};

  const avatar = author.photoURL || defaultAvatar;

  return (
    <Link to={`/post/${id}`}>
      <div className="Home-post-box">
        <div className="Home-post-information item">
          <div className="Home-post-avatar-container">
            <img className="Home-post-avatar" src={avatar} alt="avatar" />
          </div>
          <div className="Home-post-time">
            {categoryName}
            ・
            {createTime
              ? moment(createTime).format("YYYY/MM/DD h:mm a")
              : ""}
          </div>
        </div>

        {/* content */}
        <div className="Home-post-content-container">
          <div className="Home-post-title">{title}</div>
          <div className="Home-post-text">{pureText}</div>

          {/* like / comment */}
          <div className="Home-post-like-message-container">
            <div className="Home-post-like-container">
              <img className="Home-post-like" src={likeIcon} alt="讚" />
            </div>
            <div>{likeby.length}</div>
            <div className="Home-post-message-container">
              <img className="Home-post-message" src={commentIcon} alt="留言" />
            </div>
            <div>{commentsCount}</div>
          </div>

          {/* preview image */}
          {firstPicture && (
          <div className="Home-post-photo-container">
            <img className="Home-post-photo" src={firstPicture} alt="post" />
          </div>
          )}
        </div>
      </div>
    </Link>
  );
}

PostItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default PostItem;

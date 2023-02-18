import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

function PostItem({ item }) {
  return (
    <Link to={`/post/${item.id}`} key={item.id}>
      <div className="Home-post-box">
        <div className="Home-post-information item">
          <div className="Home-post-avatar-container">
            <img className="Home-post-avatar" src={item.author.photoURL} alt="" />
          </div>
          <div className="Home-post-time">
            {item.categoryName}
            ・
            {moment(Date.parse(item.createTime)).format("YYYY/MM/DD h:mm a")}
          </div>
        </div>
        <div className="Home-post-content-container">
          <div className="Home-post-title">{item.title}</div>
          <div className="Home-post-text">{item.pureText}</div>
          <div className="Home-post-like-message-container">
            <div className="Home-post-like-container">
              <img className="Home-post-like" src="https://cdn-icons-png.flaticon.com/128/1029/1029132.png" alt="讚" />
            </div>
            <div>{item.likeby.length}</div>
            <div className="Home-post-message-container">
              <img className="Home-post-message" src="https://cdn-icons-png.flaticon.com/512/2190/2190552.png" alt="留言" />
            </div>
            <div>{item.commentsCount || 0}</div>
          </div>
          {item.firstPicture && (
          <div className="Home-post-photo-container">
            <img className="Home-post-photo" src={item.firstPicture} alt="" />
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

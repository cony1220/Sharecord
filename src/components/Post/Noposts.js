import React from "react";
import emptyIcon from "../../assets/icons/empty.png";

function Noposts() {
  return (
    <div className="Personal-no-post-container">
      <div>
        <div className="Personal-no-post-icon-container">
          <img className="Personal-no-post-icon" src={emptyIcon} alt="no-post" />
        </div>
        <div>No posts here</div>
      </div>
    </div>
  );
}
export default Noposts;

import React from "react";
import loading from "../../assets/images/loading.gif";
import "../../Styles/Loading.css";

function Loading() {
  return (
    <div className="Loading-container">
      <img className="Loading-gif" src={loading} alt="Please wait..." />
    </div>
  );
}
export default Loading;

import React from "react";
import "./Introduce.css";
import { Link, useNavigate } from "react-router-dom";

function Introduce() {
  const navigator = useNavigate();
  return (
    <div className="Introduce-box">
      <div className="Introduce-content-box">
        <div className="Introduce-slogan-container">
          <div className="Introduce-slogan-title">Sharecord</div>
          <div className="Introduce-slogan-item">
            <div>撰寫你的故事</div>
            <div>閱讀別人的分享</div>
          </div>
          <div className="Introduce-slogan-item-plus">Share what you see, record what you live.</div>
          <Link to="/login" className="Introduce-start-button-container">
            <div className="Introduce-start-button">開始使用</div>
          </Link>
        </div>
        <div>閱讀</div>
        <div>收藏</div>
        <div>撰寫</div>
      </div>
    </div>
  );
}
export default Introduce;

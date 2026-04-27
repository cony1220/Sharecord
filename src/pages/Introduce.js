import React from "react";
import "../Styles/Introduce.css";
import { Link } from "react-router-dom";
import readIcon from "../assets/icons/read.png";
import collectIcon from "../assets/icons/collect.png";
import writeIcon from "../assets/icons/write.png";
import heartIcon from "../assets/icons/heart.svg";
import example from "../assets/images/example.jpg";
import penIcon from "../assets/icons/write-icon.png";

function Introduce() {
  return (
    <div className="Introduce-box">
      <div className="Introduce-slogan-container-background">
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
      </div>
      <div className="Introduce-flow-section">
        <div className="Introduce-connect-text">
          <h2>Stories connect us</h2>
          <p>每個故事，都能找到懂得欣賞的人</p>
        </div>

        <div className="divider">
          <img className="divider-heart" src={heartIcon} alt="heart" />
        </div>

        <div className="Introduce-flow-content">
          <div className="Introduce-flow-item left" />
          <div className="Introduce-flow-example">
            <img src={example} alt="example" />
          </div>
          <div className="Introduce-flow-item right">
            <img src={penIcon} alt="write" />
          </div>
        </div>
      </div>

      {/* 三功能 */}
      <div className="Introduce-feature-section">
        <div className="Introduce-feature-item">
          <div className="Introduce-feature-circle blue">
            <img src={readIcon} alt="read" />
          </div>
          <div className="Introduce-feature-title">閱讀</div>
          <div className="Introduce-feature-desc">
            探索其他使用者的文章與分享
          </div>
        </div>

        <div className="Introduce-feature-item">
          <div className="Introduce-feature-circle yellow">
            <img src={collectIcon} alt="collect" />
          </div>
          <div className="Introduce-feature-title">收藏</div>
          <div className="Introduce-feature-desc">
            保存喜歡的內容，建立你的清單
          </div>
        </div>

        <div className="Introduce-feature-item">
          <div className="Introduce-feature-circle green">
            <img src={writeIcon} alt="write" />
          </div>
          <div className="Introduce-feature-title">撰寫</div>
          <div className="Introduce-feature-desc">
            分享你的故事，留下你的觀點
          </div>
        </div>
      </div>
    </div>
  );
}
export default Introduce;

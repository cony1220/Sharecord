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
        <div className="Introduce-read-container">
          <div className="Introduce-read-image-container">
            <img className="Introduce-read-image" src="https://firebasestorage.googleapis.com/v0/b/sharecord-399bf.appspot.com/o/backgroundImage%2Fread.png?alt=media&token=ee0ffa5a-3c6b-45b7-bbd5-a336e35d6f81" alt="read" />
          </div>
          <div className="Introduce-read-word-container">
            <div className="Introduce-read-word">
              <div className="Introduce-read-word-title">閱讀</div>
              <div>查看其他使用者撰寫的文章, 點擊你有興趣的文章進行閱讀</div>
            </div>
            <div className="Introduce-read-icon-container">
              <img className="Introduce-read-icon" src="https://cdn-icons-png.flaticon.com/512/3534/3534031.png" alt="read" />
            </div>
          </div>
        </div>
        <div className="Introduce-arrow-icon-container">
          <img className="Introduce-arrow-icon" src="https://cdn-icons-png.flaticon.com/512/64/64628.png" alt="arrow" />
        </div>
        <div className="Introduce-collect-container">
          <div className="Introduce-collect-word-container">
            <div className="Introduce-read-word">
              <div className="Introduce-read-word-title">收藏</div>
              <div>與其他使用者進行互動, 點擊愛心, 寫下你的留言並收藏文章</div>
            </div>
            <div className="Introduce-read-icon-container">
              <img className="Introduce-read-icon" src="https://cdn-icons-png.flaticon.com/512/7660/7660366.png" alt="collect" />
            </div>
          </div>
          <div className="Introduce-collect-image-container">
            <img className="Introduce-collect-image" src="https://firebasestorage.googleapis.com/v0/b/sharecord-399bf.appspot.com/o/backgroundImage%2Fcollect.png?alt=media&token=9e288372-7ff4-44b7-bd03-8336f249259e" alt="collect" />
          </div>
        </div>
        <div className="Introduce-arrow-icon-container">
          <img className="Introduce-arrow-icon" src="https://cdn-icons-png.flaticon.com/512/64/64628.png" alt="arrow" />
        </div>
        <div className="Introduce-write-container">
          <div className="Introduce-write-image-container">
            <img className="Introduce-write-image" src="https://firebasestorage.googleapis.com/v0/b/sharecord-399bf.appspot.com/o/backgroundImage%2Fwrite.png?alt=media&token=6fa82efb-7892-4024-8210-9e17838f783e" alt="write" />
          </div>
          <div className="Introduce-write-word-container">
            <div className="Introduce-read-word">
              <div className="Introduce-read-word-title">撰寫</div>
              <div>與其他使用者分享你的故事, 紀錄經歷, 留存回憶</div>
            </div>
            <div className="Introduce-read-icon-container">
              <img className="Introduce-read-icon" src="https://cdn-icons-png.flaticon.com/512/4024/4024379.png" alt="write" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Introduce;

import React from "react";
import "../Styles/Introduce.css";
import { Link } from "react-router-dom";

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
      <div className="Introduce-example-container">
        <div className="Introduce-example-box">
          <div className="Introduce-example-word-container">
            <div className="Introduce-example-image-container">
              <img className="Introduce-example-image" src="https://firebasestorage.googleapis.com/v0/b/sharecord-399bf.appspot.com/o/backgroundImage%2F3630156.jpg?alt=media&token=7b602604-2620-492e-94fa-c6ab00a517a7" alt="read" />
            </div>
            <div className="Introduce-example-word">Connecting people who are interested in covering your story</div>
          </div>
          <div className="Introduce-example-gif-container">
            <img className="Introduce-example-gif" src="https://firebasestorage.googleapis.com/v0/b/sharecord-399bf.appspot.com/o/backgroundImage%2F20220613_234935.gif?alt=media&token=3b1024db-1b9d-4596-b055-d4fd12a5843e" alt="example" />
          </div>
        </div>
      </div>
      <div className="Introduce-connect-arrow-container">
        <div className="Introduce-connect-word">你可以</div>
        <img className="Introduce-connect-arrow" src="https://cdn-icons-png.flaticon.com/512/64/64818.png" alt="arrow" />
      </div>
      <div className="Introduce-content-container">
        <div className="Introduce-content-item1">
          <div className="Introduce-read-word-container">
            <div className="Introduce-read-word">
              <div className="Introduce-read-word-title">閱讀</div>
              <div>查看其他使用者撰寫的文章, 點擊你有興趣的文章進行閱讀</div>
            </div>
            <div className="Introduce-read-icon-container">
              <img className="Introduce-read-icon" src="https://cdn-icons-png.flaticon.com/512/3534/3534031.png" alt="read" />
            </div>
          </div>
          <div className="Introduce-collect-word-container">
            <div className="Introduce-read-word">
              <div className="Introduce-read-word-title">收藏</div>
              <div>與其他使用者進行互動, 點擊愛心, 寫下你的留言並收藏文章</div>
            </div>
            <div className="Introduce-read-icon-container">
              <img className="Introduce-read-icon" src="https://cdn-icons-png.flaticon.com/512/7660/7660366.png" alt="collect" />
            </div>
          </div>
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
      <div className="Introduce-footer-container">
        <div className="Introduce-footer-slogan">
          <img className="Introduce-logo" src="https://cdn-icons-png.flaticon.com/512/95/95893.png" alt="logo" />
          <div className="Introduce-slogan">Sharecord</div>
          <div>share and record</div>
        </div>
        <div className="Introduce-link-container">
          <a href="#">
            <img className="Introduce-logo" src="https://cdn-icons-png.flaticon.com/512/2111/2111432.png" alt="github" />
          </a>
          <a href="#">
            <img className="Introduce-logo" src="https://cdn-icons-png.flaticon.com/512/1384/1384017.png" alt="twitter" />
          </a>
          <a href="#">
            <img className="Introduce-logo" src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png" alt="facebook" />
          </a>
        </div>
      </div>
    </div>
  );
}
export default Introduce;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection, getDocs,
}
  from "firebase/firestore";
import moment from "moment";
import { db, auth } from "../firebaseConfig";

function Home() {
  const [currentUser, setCurrentUser] = useState({});
  const [postList, setPostList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
  useEffect(() => {
    const getCategory = async () => {
      const categorys = await getDocs(collection(db, "category"));
      setCategoryList(categorys.docs.map((category) => ({ ...category.data(), id: category.id })));
    };
    getCategory();
  }, []);
  useEffect(() => {
    const getPostList = async () => {
      const posts = await getDocs(collection(db, "posts"));
      setPostList(posts.docs.map((post) => ({ ...post.data(), id: post.id })));
    };
    getPostList();
  }, []);
  return (
    <div className="Home-box">
      <div className="Home-background">
        <div className="Home-background-slogan">
          <div className="Home-slogan-line1">Share what you see,</div>
          <div className="Home-slogan-line2">record what you live.</div>
        </div>
      </div>
      <div className="Home-content-box">
        <div className="Home-personal-label-container">
          <div className="Home-label-box">
            <div className="Home-label-container">
              <div className="Home-label-image-container">
                <img className="Home-label-image" src="https://cdn-icons-png.flaticon.com/128/617/617418.png" alt="Label" />
              </div>
              <div>分類</div>
            </div>
            {categoryList.map((item) => (
              <div className="Home-category-container item" key={`${item.id}`}>
                <div className="Home-category-image-container">
                  <img className="Home-category" src={item.imgurl} alt={item.name} />
                </div>
                <div>{item.name}</div>
              </div>
            ))}
          </div>
          {currentUser && (
            <div className="Home-personal-container">
              <div className="Home-label-container">
                <div className="Home-label-image-container">
                  <img className="Home-label-image" src="https://cdn-icons-png.flaticon.com/128/617/617418.png" alt="Label" />
                </div>
                <div>個人</div>
              </div>
              <Link to="/createpost">
                <div className="Home-category-container item">
                  <div className="Home-category-image-container">
                    <img className="Home-category" src="https://cdn-icons-png.flaticon.com/512/258/258332.png" alt="撰寫文章" />
                  </div>
                  <div>撰寫文章</div>
                </div>
              </Link>
              <Link to={`/personal/${currentUser ? currentUser.uid : ""}`}>
                <div className="Home-category-container item">
                  <div className="Home-category-image-container">
                    <img className="Home-category" src="https://cdn-icons-png.flaticon.com/512/609/609803.png" alt="我的主頁" />
                  </div>
                  <div>我的主頁</div>
                </div>
              </Link>
            </div>
          )}
        </div>
        <div className="Home-post-container">
          {postList.length > 0 ? postList.map((item) => (
            <Link to={`/post/${item.id}`} key={item.id}>
              <div className="Home-post-box">
                <div className="Home-post-information item">
                  <div className="Home-post-avatar-container">
                    <img className="Home-post-avatar" src={item.author.photoURL} alt="" />
                  </div>
                  <div className="Home-post-time">
                    {item.categoryName}
                    ・
                    {moment(item.createTime.toDate()).format("YYYY/MM/DD h:mm a")}
                  </div>
                </div>
                <div className="Home-post-content-container">
                  <div className="Home-post-title">{item.title}</div>
                  <div className="Home-post-text">{item.pureText}</div>
                  <div className="Home-post-like-message-container">
                    <div className="Home-post-like-container">
                      <img className="Home-post-like" src="https://cdn-icons-png.flaticon.com/512/1077/1077035.png" alt="讚" />
                    </div>
                    <div>0</div>
                    <div className="Home-post-message-container">
                      <img className="Home-post-message" src="https://cdn-icons-png.flaticon.com/128/2462/2462719.png" alt="留言" />
                    </div>
                    <div>0</div>
                  </div>
                  {item.firstPicture && (
                    <div className="Home-post-photo-container">
                      <img className="Home-post-photo" src={item.firstPicture} alt="" />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )) : (
            <div className="Personal-no-post-container">
              <div>
                <div className="Personal-no-post-icon-container">
                  <img className="Personal-no-post-icon" src="https://cdn-icons-png.flaticon.com/512/817/817864.png" alt="" />
                </div>
                <div>No posts here</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Home;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import {
  collection, getDocs, where, query, orderBy,
}
  from "firebase/firestore";
import moment from "moment";
import { db, auth } from "../firebaseConfig";

function Home() {
  const [postList, setPostList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const getCategory = async () => {
      const categorys = await getDocs(collection(db, "category"));
      setCategoryList(categorys.docs.map((category) => ({ ...category.data(), id: category.id })));
    };
    getCategory();
  }, []);
  useEffect(() => {
    const getPostList = async () => {
      const ref = collection(db, "posts");
      const q = query(ref, orderBy("createTime", "desc"));
      const posts = await getDocs(q);
      setPostList(posts.docs.map((post) => ({ ...post.data(), id: post.id })));
    };
    getPostList();
  }, []);
  const handleSearchCategory = (categoryName) => {
    const getPostList = async () => {
      const ref = collection(db, "posts");
      const q = query(ref, where("categoryName", "==", `${categoryName}`), orderBy("createTime", "desc"));
      const posts = await getDocs(q);
      setPostList(posts.docs.map((post) => ({ ...post.data(), id: post.id })));
    };
    getPostList();
  };
  const handleSearchAll = () => {
    const getPostList = async () => {
      const ref = collection(db, "posts");
      const q = query(ref, orderBy("createTime", "desc"));
      const posts = await getDocs(q);
      setPostList(posts.docs.map((post) => ({ ...post.data(), id: post.id })));
    };
    getPostList();
  };
  const handleKeywordSearch = () => {
    const getPostList = async () => {
      const ref = collection(db, "posts");
      const q = query(ref, where("keywords", "array-contains", search));
      const posts = await getDocs(q);
      setPostList(posts.docs.map((post) => ({ ...post.data(), id: post.id })));
    };
    getPostList();
    setSearch("");
  };
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
            <div onClick={handleSearchAll} className="Home-category-container item">
              <div className="Home-category-image-container">
                <img className="Home-category" src="https://cdn-icons-png.flaticon.com/512/4712/4712846.png" alt="全部" />
              </div>
              <div>全部</div>
            </div>
            {categoryList.map((item) => (
              <div onClick={() => handleSearchCategory(item.name)} className="Home-category-container item" key={`${item.id}`}>
                <div className="Home-category-image-container">
                  <img className="Home-category" src={item.imgurl} alt={item.name} />
                </div>
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="Home-post-container">
          <div className="Home-post-search-container">
            <div className="Home-menu-icon-container">
              <img src="https://cdn-icons-png.flaticon.com/512/56/56763.png" alt="菜單" />
            </div>
            <div className="Home-post-search-box">
              <input
                type="text"
                className="Home-post-search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div onClick={handleKeywordSearch} className="Home-post-search-image-container">
                <img className="Home-post-search-image" src="https://cdn-icons-png.flaticon.com/128/151/151773.png" alt="搜尋" />
              </div>
            </div>
          </div>
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

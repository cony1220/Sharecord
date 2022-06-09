import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Personal.css";
import {
  collection, getDoc, getDocs, query, where, doc, orderBy,
}
  from "firebase/firestore";
import moment from "moment";
import { db, auth } from "../firebaseConfig";

function Personal() {
  const [pageOwner, setPageOwner] = useState({});
  const [postList, setPostList] = useState([]);
  const { userId } = useParams();
  useEffect(() => {
    const getPageOwner = async () => {
      const docSnap = await getDoc(doc(db, `users/${userId}`));
      setPageOwner(docSnap.data());
    };
    const getPostList = async () => {
      const ref = collection(db, "posts");
      const q = query(ref, where("author.uid", "==", `${userId}`), orderBy("createTime", "desc"));
      const posts = await getDocs(q);
      setPostList(posts.docs.map((post) => ({ ...post.data(), id: post.id })));
    };
    getPageOwner();
    getPostList();
  }, []);
  return (
    <div className="Personal-box">
      <div className="Personal-background" />
      <div className="Personal-content-box">
        <div className="Personal-information-container">
          <div className="Personal-avatar-container">
            <img className="Personal-avatar" src={pageOwner && pageOwner.photoURL} alt="" />
          </div>
          <div className="Personal-name">{pageOwner && pageOwner.name}</div>
          <div className="Personal-post-count">{`${postList.length}篇文章`}</div>
        </div>
        <div className="Personal-bar" />
        <div className="Personal-post-container">
          {postList.length > 0 ? postList.map((item) => (
            <Link to={`/post/${item.id}`} key={item.id}>
              <div className="Personal-post-box">
                <div className="Personal-post-information item">
                  <div className="Personal-post-avatar-container">
                    <img className="Personal-post-avatar" src={item.author.photoURL} alt="" />
                  </div>
                  <div className="Personal-post-time">
                    {item.categoryName}
                    ・
                    {moment(item.createTime.toDate()).format("YYYY/MM/DD h:mm a")}
                  </div>
                </div>
                <div className="Personal-post-content-container">
                  <div className="Personal-post-title">{item.title}</div>
                  <div className="Personal-post-text">{item.pureText}</div>
                  <div className="Personal-post-like-message-container">
                    <div className="Personal-post-like-container">
                      <img className="Personal-post-like" src="https://cdn-icons-png.flaticon.com/128/1029/1029132.png" alt="讚" />
                    </div>
                    <div>{item.likeby.length}</div>
                    <div className="Personal-post-message-container">
                      <img className="Personal-post-message" src="https://cdn-icons-png.flaticon.com/512/2190/2190552.png" alt="留言" />
                    </div>
                    <div>{item.commentsCount || 0}</div>
                  </div>
                  {item.firstPicture && (
                    <div className="Personal-post-photo-container">
                      <img className="Personal-post-photo" src={item.firstPicture} alt="" />
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
export default Personal;

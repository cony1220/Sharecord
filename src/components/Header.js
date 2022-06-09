import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Header({ user }) {
  const navigator = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      navigator("/");
    });
  };
  return (
    <div className="Header">
      <div className="Header-container">
        <Link to="/home" className="Header-icon">Sharecord</Link>
        {user ? (
          <>
            <Link to="/createpost" className="Header-createpost-link">
              <div className="Header-write-icon-container">
                <img src="https://cdn-icons-png.flaticon.com/128/1828/1828911.png" alt="撰寫文章" />
              </div>
            </Link>
            <Link to={`/personal/${auth.currentUser.uid}`} className="Header-my-link">
              <div className="Header-member-icon-container">
                <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="會員專區" />
              </div>
            </Link>
            <div onClick={logOut} className="Header-signin-up">登出</div>
          </>
        )
          : <Link to="/login" className="Header-signin-up">登入/註冊</Link>}
      </div>
    </div>
  );
}
export default Header;

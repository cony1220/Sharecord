import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Header({ isAuth }) {
  const navigator = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      navigator(0);
    });
  };
  return (
    <div className="Header">
      <div className="Header-container">
        <Link to="/" className="Header-icon">Sharecord</Link>
        {!isAuth ? <Link to="/login" className="Header-signin-up">登入/註冊</Link> : <div onClick={logOut} className="Header-signin-up">登出</div>}
      </div>
    </div>
  );
}
export default Header;

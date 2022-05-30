import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Header() {
  const navigator = useNavigate();
  const [user, setUser] = useState({});
  const logOut = () => {
    signOut(auth).then(() => {
      navigator("/");
    });
  };
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);
  return (
    <div className="Header">
      <div className="Header-container">
        <Link to="/" className="Header-icon">Sharecord</Link>
        {!user ? <Link to="/login" className="Header-signin-up">登入/註冊</Link> : <div onClick={logOut} className="Header-signin-up">登出</div>}
      </div>
    </div>
  );
}
export default Header;

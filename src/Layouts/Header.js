import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { auth } from "../firebaseConfig";
import editIcon from "../assets/icons/edit.png";
import userIcon from "../assets/icons/user.png";

function Header() {
  const isLoggedIn = !!useSelector((state) => state.user.auth?.uid);

  const logOut = () => {
    signOut(auth);
  };

  const navIcons = [
    {
      to: "/createpost",
      icon: editIcon,
      alt: "撰寫文章",
      className: "Header-createpost-link",
    },
    {
      to: "/my",
      icon: userIcon,
      alt: "會員專區",
      className: "Header-my-link",
    },
  ];

  return (
    <div className="Header">
      <div className="Header-container">
        {/* logo */}
        <Link to="/home/all" className="Header-logo">
          Sharecord
        </Link>

        {/* right side */}
        {isLoggedIn ? (
          <>
            {navIcons.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`Header-icon-button ${item.className}`}
              >
                <img className="Header-icon" src={item.icon} alt={item.alt} />
              </Link>
            ))}
            <button
              type="button"
              onClick={logOut}
              className="Header-auth-button"
            >
              登出
            </button>
          </>
        ) : (
          <Link to="/login" className="Header-auth-button">
            登入/註冊
          </Link>
        )}
      </div>
    </div>
  );
}
export default Header;

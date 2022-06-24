import React, { useState } from "react";
import "../Styles/Login.css";
import { useAuth } from "../hooks/useAuth";

function Loginbox() {
  const { signInWithGoogle, onSubmit } = useAuth();
  const [action, setAction] = useState("login");
  const [email, setEmail] = useState("email@gmail.com");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setPaswwordShow] = useState(false);
  const handleSignInStatus = () => {
    if (action === "register") {
      setAction("login");
      setErrorMessage("");
    }
  };
  const handleSignUpStatus = () => {
    if (action === "login") {
      setAction("register");
      setErrorMessage("");
    }
  };
  const handlePasswordShow = () => {
    setPaswwordShow((pre) => !pre);
  };
  return (
    <div className="signin-up-container">
      <div className="signin-up-option-container">
        <span onClick={handleSignInStatus} className="signin">Sign in</span>
        <span onClick={handleSignUpStatus} className="create-account">Create account</span>
        <div className={action === "login" ? "signin-bar" : "signup-bar"} />
      </div>
      <div className="signin-status-content-container">
        <form onSubmit={(e) => onSubmit(e, action, email, password, setErrorMessage)}>
          <label htmlFor="email" className="email-container">
            <div className="email item">Email</div>
            <input
              type="text"
              id="email"
              className="email-input item"
              placeholder="輸入信箱"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
          <label htmlFor="password" className="password-container">
            <div className="password item">Password</div>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="password-input item"
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <img
                onClick={handlePasswordShow}
                role="presentation"
                className="password-show"
                src={showPassword
                  ? "https://cdn-icons-png.flaticon.com/512/565/565654.png"
                  : "https://cdn-icons-png.flaticon.com/512/565/565655.png"}
                alt=""
              />
            </div>
          </label>
          <button type="submit" className="signin-button item">{action === "login" ? "登入" : "註冊"}</button>
        </form>
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        {action === "login" && (
          <>
            <div className="bar item">
              <span className="word">OR</span>
            </div>
            <div onClick={signInWithGoogle} role="presentation" className="other-signin-methods">
              <img className="signin-with-google-icon" src="https://cdn-icons-png.flaticon.com/128/281/281764.png" alt="" />
              <span className="signin-with-google-word">使用 Google 登入</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Loginbox;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

function Login({ isAuth }) {
  const navigator = useNavigate();
  const [action, setAction] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    if (isAuth) {
      navigator("/");
    }
  }, []);
  const handleSignInStatus = () => {
    if (action === "register") {
      setAction("login");
    }
  };
  const handleSignUpStatus = () => {
    if (action === "login") {
      setAction("register");
    }
  };
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      navigator("/");
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (action === "login") {
      try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        console.log(user);
        navigator("/");
      } catch (error) {
        console.log(error.message);
      }
    } else if (action === "register") {
      try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        console.log(user);
        navigator("/");
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <div className="signin-up-background">
      <div className="content-container">
        <div className="title">Record the time, enjoy the life.</div>
        <div className="text">
          When tomorrow turns in today, yesterday,
          and someday that no more important in your memory,
          we suddenly realize that we are pushed forward by time.
          This is not a train in still in which you may feel forward when another train goes by.
          It is the truth that we’ve all grown up. And we become different.
        </div>
        <div className="signin-up-container">
          <div className="signin-up-option-container">
            <span onClick={handleSignInStatus} className="signin">Sign in</span>
            <span onClick={handleSignUpStatus} className="create-account">Create account</span>
            <div className={action === "login" ? "signin-bar" : "signup-bar"} />
          </div>
          <div className="signin-status-content-container">
            <form onSubmit={onSubmit} className="signin-status-form-container">
              <label htmlFor="email" className="email-container">
                <div className="email item">Email</div>
                <input
                  type="text"
                  id="email"
                  className="email-input item"
                  placeholder="輸入信箱"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </label>
              <label htmlFor="password" className="password-container">
                <div className="password item">Password</div>
                <input
                  type="password"
                  id="password"
                  className="password-input item"
                  placeholder="輸入密碼"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </label>
              <button type="submit" className="signin-button item">{action === "login" ? "登入" : "註冊"}</button>
            </form>
            {action === "login"
              && (
                <>
                  <div className="bar item">
                    <span className="word">OR</span>
                  </div>
                  <div className="other-signin-methods">
                    <img onClick={signInWithGoogle} role="presentation" className="signin-with-google" src="https://cdn-icons-png.flaticon.com/512/2111/2111450.png" alt="" />
                    <img className="signin-with-fb" src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="" />
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;

import React, { useState } from "react";

import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/user-slice";
import { db, auth, provider } from "../../firebaseConfig";
import "../../Styles/Login.css";
import eyeOpenIcon from "../../assets/icons/eye-open.png";
import eyeCloseIcon from "../../assets/icons/eye-close.png";
import googleIcon from "../../assets/icons/google.png";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

function Loginbox() {
  const [action, setAction] = useState("login");
  const [email, setEmail] = useState("email@gmail.com");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const buildUserData = (user) => ({
    name: user.displayName || "使用者",
    photoURL: user.photoURL || DEFAULT_AVATAR,
    email: user.email,
  });

  const syncUser = async (user) => {
    const data = buildUserData(user);

    // 更新 Firestore
    await setDoc(
      doc(db, `users/${user.uid}`),
      {
        ...data,
      },
      { merge: true },
    );

    // 更新 Redux
    dispatch(userActions.setProfile({
      ...data,
    }));
  };

  const toggleMode = (mode) => {
    setAction(mode);
    setErrorMessage("");
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Google login
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      await syncUser(res.user);
    } catch (err) {
      setErrorMessage("Google 登入失敗");
    }
  };

  const handleError = (code) => {
    switch (code) {
      case "auth/user-not-found":
        setErrorMessage("*信箱不存在*");
        break;
      case "auth/wrong-password":
        setErrorMessage("*密碼錯誤*");
        break;
      case "auth/email-already-in-use":
        setErrorMessage("*信箱已存在*");
        break;
      case "auth/invalid-email":
        setErrorMessage("*信箱格式不正確*");
        break;
      case "auth/weak-password":
        setErrorMessage("*密碼強度不足*");
        break;
      default:
        setErrorMessage("發生錯誤");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      if (action === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const res = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await syncUser(res.user);
      }
    } catch (error) {
      handleError(error.code);
    }
  };

  return (
    <div className="signin-up-container">
      {/* tab */}
      <div className="signin-up-option-container">
        <span onClick={() => toggleMode("login")} className="signin">
          Sign in
        </span>
        <span onClick={() => toggleMode("register")} className="create-account">
          Create account
        </span>
        <div className={action === "login" ? "signin-bar" : "signup-bar"} />
      </div>

      {/* form */}
      <div className="signin-status-content-container">
        <form onSubmit={onSubmit}>
          {/* email */}
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
          {/* password */}
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
                onClick={togglePassword}
                role="presentation"
                className="password-show"
                src={showPassword ? eyeOpenIcon : eyeCloseIcon}
                alt="toggle password"
              />
            </div>
          </label>
          <button type="submit" className="signin-button item">
            {action === "login" ? "登入" : "註冊"}
          </button>
        </form>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Google */}
        {action === "login" && (
          <>
            <div className="bar item">
              <span className="word">OR</span>
            </div>
            <div
              onClick={signInWithGoogle}
              role="presentation"
              className="other-signin-methods"
            >
              <img
                className="signin-with-google-icon"
                src={googleIcon}
                alt="google"
              />
              <span className="signin-with-google-word">使用 Google 登入</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Loginbox;

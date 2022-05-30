import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  collection, getDocs, doc, setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth, provider } from "../firebaseConfig";

function Login() {
  const navigator = useNavigate();
  const [action, setAction] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setPaswwordShow] = useState(false);
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigator("/");
      }
    });
  }, []);
  useEffect(() => {
    const getUserList = async () => {
      const users = await getDocs(collection(db, "users"));
      setUserList(users.docs.map((user) => (user.id)));
    };
    getUserList();
  }, []);
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
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((user) => {
      if (!userList.includes(user.user.uid)) {
        setDoc(doc(db, `users/${user.user.uid}`), {
          email: user.user.email,
          name: user.user.displayName || "使用者",
          photoURL: user.user.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        });
      }
      navigator("/");
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (action === "login") {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigator("/");
      } catch (error) {
        switch (error.code) {
          case "auth/user-not-found":
            setErrorMessage("*信箱不存在*");
            break;
          case "auth/invalid-email":
            setErrorMessage("*信箱格式不正確*");
            break;
          case "auth/wrong-password":
            setErrorMessage("*密碼錯誤*");
            break;
          default:
        }
      }
    } else if (action === "register") {
      try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, `users/${user.user.uid}`), {
          email: user.user.email,
          name: user.user.displayName || "使用者",
          photoURL: user.user.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        });
        navigator("/");
      } catch (error) {
        switch (error.code) {
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
        }
      }
    }
  };
  return (
    <div className="box">
      <div className="signin-up-background">
        <div className="content-container">
          <div className="word-container">
            <div className="title">Record the time, enjoy the life.</div>
            <div className="text">
              When tomorrow turns in today, yesterday,
              and someday that no more important in your memory,
              we suddenly realize that we are pushed forward by time.
              This is not a train in still in which you may feel forward when another train goes by.
              It is the truth that we’ve all grown up. And we become different.
            </div>
          </div>
          <div className="signin-up-container">
            <div className="signin-up-option-container">
              <span onClick={handleSignInStatus} className="signin">Sign in</span>
              <span onClick={handleSignUpStatus} className="create-account">Create account</span>
              <div className={action === "login" ? "signin-bar" : "signup-bar"} />
            </div>
            <div className="signin-status-content-container">
              <form onSubmit={onSubmit}>
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
                <label htmlFor="password" className="password-contaer">
                  <div className="password item">Password</div>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="password-input item"
                      placeholder="輸入密碼"
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
        </div>
      </div>
    </div>
  );
}
export default Login;

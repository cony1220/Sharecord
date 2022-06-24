import React, {
  useState, useEffect, useContext, createContext,
} from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import {
  collection, getDocs, doc, setDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import PropTypes from "prop-types";
import { db, auth, provider } from "../firebaseConfig";

function useProvideAuth() {
  const [currentUser, setCurrentUser] = useState({});
  const [userList, setUserList] = useState([]);
  const navigator = useNavigate();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);
  useEffect(() => {
    const getUserList = async () => {
      const users = await getDocs(collection(db, "users"));
      setUserList(users.docs.map((user) => (user.id)));
    };
    getUserList();
  }, []);
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((user) => {
      if (!userList.includes(user.user.uid)) {
        setDoc(doc(db, `users/${user.user.uid}`), {
          email: user.user.email,
          name: user.user.displayName || "使用者",
          photoURL: user.user.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
        });
      }
      navigator("/home");
    });
  };
  const onSubmit = async (e, action, email, password, setErrorMessage) => {
    e.preventDefault();
    if (action === "login") {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigator("/home");
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
        navigator("/home");
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
  return {
    currentUser, signInWithGoogle, onSubmit,
  };
}

const authContext = createContext();
export const useAuth = () => useContext(authContext);

export function ProvideAuth({ children }) {
  const value = useProvideAuth();
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
}
ProvideAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

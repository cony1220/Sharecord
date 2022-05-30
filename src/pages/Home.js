import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

function Home() {
  const [user, setUser] = useState({});
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);
  return (
    <div className="Home-box">
      <div className="Home-background">
        <span>Share what you see, record what you live.</span>
      </div>
      <div className="test">
        <Link to="/createpost">
          <button type="button">Createpost Page</button>
        </Link>
        <Link to={`/personal/${user ? user.uid : ""}`}>
          <button type="button">Personal Page</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;

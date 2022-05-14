import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

function App() {
  const [isAuth, setIsAuth] = useState({});
  onAuthStateChanged(auth, (currentUser) => {
    setIsAuth(currentUser);
  });
  return (
    <Router>
      <Header isAuth={isAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login isAuth={isAuth}/>} />
      </Routes>
    </Router>
  );
}

export default App;

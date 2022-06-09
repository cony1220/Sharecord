import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router, Routes, Route, Navigate,
}
  from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Createpost from "./pages/Createpost";
import Post from "./pages/Post";
import Personal from "./pages/Personal";
import NoMatch from "./pages/NoMatch";
import Introduce from "./pages/Introduce";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);
  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Introduce />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route path="/createpost" element={user ? <Createpost /> : <Navigate to="/" />} />
        <Route path="/post/:postId" element={user ? <Post user={user} /> : <Navigate to="/" />} />
        <Route path="personal/:userId" element={user ? <Personal /> : <Navigate to="/" />} />
        <Route path="*" element={<NoMatch status={404} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

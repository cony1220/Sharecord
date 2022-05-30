import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebaseConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Createpost from "./pages/Createpost";
import Post from "./pages/Post";
import Personal from "./pages/Personal";
import NoMatch from "./pages/NoMatch";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createpost" element={<Createpost />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="personal/:userId" element={<Personal />} />
        <Route path="*" element={<NoMatch status={404} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

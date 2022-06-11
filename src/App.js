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
import ProtectedRoute from "./pages/ProtectedRoute";
import Edit from "./pages/Edit";
import Setup from "./pages/Setup";
import My from "./pages/My";

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
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/createpost" element={<Createpost />} />
          <Route path="/post/:postId" element={<Post user={user} />} />
          <Route path="personal/:userId" element={<Personal />} />
          <Route path="edit/:postId" element={<Edit />} />
          <Route path="setup/:userId" element={<Setup />} />
          <Route path="my/:userId" element={<My />} />
        </Route>
        <Route path="*" element={<NoMatch status={404} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

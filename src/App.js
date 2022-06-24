import React from "react";
import {
  BrowserRouter as Router, Routes, Route, Navigate,
}
  from "react-router-dom";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Createpost from "./pages/Createpost";
import Post from "./pages/Post";
import Personal from "./pages/Personal";
import NoMatch from "./pages/NoMatch";
import Introduce from "./pages/Introduce";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import Edit from "./pages/Edit";
import Setup from "./pages/Setup";
import My from "./pages/My";
import PostList from "./components/Post/PostList";
import { ProvideAuth } from "./hooks/useAuth";

function App() {
  return (
    <Router>
      <ProvideAuth>
        <Header />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Introduce />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="home" element={<Home />}>
              <Route path="/home" element={<Navigate to="all" replace />} />
              <Route path=":categoryPage" element={<PostList />} />
            </Route>
            <Route path="createpost" element={<Createpost />} />
            <Route path="post/:postId" element={<Post />} />
            <Route path="personal/:userId" element={<Personal />} />
            <Route path="edit/:postId" element={<Edit />} />
            <Route path="setup" element={<Setup />} />
            <Route path="my" element={<My />} />
          </Route>
          <Route path="*" element={<NoMatch status={404} />} />
        </Routes>
        <Footer />
      </ProvideAuth>
    </Router>
  );
}

export default App;

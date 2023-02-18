import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user-slice";
import { auth } from "./firebaseConfig";
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
import Profile from "./pages/Profile";
import My from "./pages/My";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userActions.user({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
        }));
      } else {
        dispatch(userActions.user(null));
      }
    });
    return unsub;
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Introduce />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="home/:categoryPage" element={<Home />} />
          <Route path="createpost" element={<Createpost />} />
          <Route path="post/:postId" element={<Post />} />
          <Route path="personal/:userId" element={<Personal />} />
          <Route path="edit/:postId" element={<Edit />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my" element={<My />} />
        </Route>
        <Route path="*" element={<NoMatch status={404} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

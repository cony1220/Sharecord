import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user-slice";
import { auth } from "./firebaseConfig";
import Header from "./Layouts/Header";
import Footer from "./Layouts/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Personal from "./pages/Personal";
import NoMatch from "./pages/NoMatch";
import Introduce from "./pages/Introduce";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import Profile from "./pages/Profile";
import My from "./pages/My";
import Loading from "./components/UI/Loading";

const Createpost = React.lazy(
  () => import(
    /* webpackChunkName: "createpost" */
    /* webpackPrefetch: true */
    "./pages/Createpost"
  ),
);

const Post = React.lazy(
  () => import(
    /* webpackChunkName: "post" */
    /* webpackPrefetch: true */
    "./pages/Post"
  ),
);

const Edit = React.lazy(
  () => import(
    /* webpackChunkName: "edit" */
    /* webpackPrefetch: true */
    "./pages/Edit"
  ),
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          userActions.user({
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
          }),
        );
      } else {
        dispatch(userActions.user(null));
      }
    });
    return unsub;
  }, []);

  return (
    <Router>
      <Header />
      <Suspense fallback={<Loading />}>
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
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;

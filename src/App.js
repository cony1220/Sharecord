import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userActions } from "./store/user-slice";
import { auth } from "./firebaseConfig";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Personal from "./pages/Personal";
import NoMatch from "./pages/NoMatch";
import Introduce from "./pages/Introduce";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";
import EditProfile from "./pages/EditProfile";
import My from "./pages/My";
import MainLayout from "./Layouts/MainLayout";
import { getDocumentData } from "./lib/api";

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
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(userActions.clearUser());
        return;
      }

      // auth（登入資訊）
      dispatch(
        userActions.setAuth({
          uid: user.uid,
          email: user.email,
        }),
      );

      try {
        // profile（Firestore）
        const profile = await getDocumentData(`users/${user.uid}`);

        dispatch(userActions.setProfile({ ...profile }));
      } catch (err) {
        console.error("fetch profile error", err);
      }

      dispatch(userActions.setAuthReady(true));
    });
    return unsub;
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Introduce />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="home/:categoryPage" element={<Home />} />
            <Route path="createpost" element={<Createpost />} />
            <Route path="post/:postId" element={<Post />} />
            <Route path="personal/:userId" element={<Personal />} />
            <Route path="edit/:postId" element={<Edit />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="my" element={<My />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NoMatch status={404} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

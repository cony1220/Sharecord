import React from "react";
import Noposts from "../components/Post/Noposts";
import Loading from "../components/UI/Loading";
import PostItem from "../components/Post/PostItem";

function ProfileLayout({
  user,
  postList,
  isLoading,
  error,
  headerExtra,
  postMenu,
}) {
  if (error) return <div className="center">{error}</div>;

  return (
    <div className="Personal-box">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="Personal-background" />
          <div className="Personal-content-box">
            <div className="Personal-information-container">
              <div className="Personal-avatar-container">
                <img className="Personal-avatar" src={user?.photoURL} alt="avatar" />
              </div>

              <div className="Personal-name-container">
                {headerExtra}
                <div className="Personal-name">
                  {user?.name}
                </div>
              </div>

              <div className="Personal-post-count">
                {`${postList?.length}篇文章`}
              </div>
            </div>

            <div className="Personal-bar" />

            <div className="Personal-post-container">
              {postMenu}

              {postList?.length > 0 ? (
                postList.map((item) => <PostItem key={item.id} item={item} />)
              ) : (
                <Noposts />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default ProfileLayout;

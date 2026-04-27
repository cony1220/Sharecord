import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import "../Styles/Personal.css";
import useHttp from "../hooks/use-http";
import { getDocumentData, getPersonalPosts } from "../lib/api";
import ProfileLayout from "../Layouts/ProfileLayout";

function Personal() {
  const { userId } = useParams();

  const {
    sendRequest: fetchUser,
    isLoading: isLoadingUser,
    data: user,
    error: userError,
  } = useHttp(getDocumentData, true);

  const {
    sendRequest: fetchPosts,
    isLoading: isLoadingPosts,
    data: posts,
    error: postsError,
  } = useHttp(getPersonalPosts, true, []);

  useEffect(() => {
    if (!userId) return;

    fetchUser(`users/${userId}`);
    fetchPosts({
      col: "posts", name: "author.uid", condition: "==", value: `${userId}`,
    });
  }, [fetchUser, fetchPosts, userId]);

  const isLoading = isLoadingUser || isLoadingPosts;
  const error = userError || postsError;

  return (
    <ProfileLayout
      user={user}
      postList={posts}
      isLoading={isLoading}
      error={error}
    />
  );
}
export default Personal;

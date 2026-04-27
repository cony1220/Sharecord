import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/UI/Loading";

function PublicRoute() {
  const { auth: authUser, isAuthReady } = useSelector((state) => state.user);

  if (!isAuthReady) {
    return <Loading />;
  }

  return authUser?.uid ? <Navigate to="/home/all" replace /> : <Outlet />;
}
export default PublicRoute;

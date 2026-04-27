import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/UI/Loading";

function ProtectedRoute() {
  const { auth: authUser, isAuthReady } = useSelector((state) => state.user);

  if (!isAuthReady) {
    return <Loading />;
  }

  return authUser?.uid ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;

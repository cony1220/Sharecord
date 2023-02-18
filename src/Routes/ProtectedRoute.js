import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
  const currentUser = useSelector((state) => state.user.user);
  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;

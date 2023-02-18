import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicRoute() {
  const currentUser = useSelector((state) => state.user.user);
  return currentUser ? <Navigate to="/home/all" replace /> : <Outlet />;
}
export default PublicRoute;

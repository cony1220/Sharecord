import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PublicRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/home" replace /> : <Outlet />;
}
export default PublicRoute;

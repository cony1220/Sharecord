import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./useAuth";

function ProtectedRoute() {
  const currentUser = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
export default ProtectedRoute;

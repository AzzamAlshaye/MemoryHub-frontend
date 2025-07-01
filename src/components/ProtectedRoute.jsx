// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ requiredRole = null }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.userType !== requiredRole) {
    // Wrong role
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

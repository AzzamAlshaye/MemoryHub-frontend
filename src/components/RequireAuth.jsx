// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children, requiredRole = null }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"
          style={{ borderTopColor: "#fd8950" }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/SignInPage" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

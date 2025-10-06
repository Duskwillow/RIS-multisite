/*
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../services/authStore";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
*/

// ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../services/authStore";

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, validateToken, logout } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        const isValid = validateToken();
        if (!isValid) {
          logout();
        }
      }
      setIsValidating(false);
    };

    checkAuth();

    // Set up periodic token validation (every minute)
    const interval = setInterval(() => {
      if (isAuthenticated) {
        const isValid = validateToken();
        if (!isValid) {
          logout();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, validateToken, logout]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Vérification de l'authentification...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

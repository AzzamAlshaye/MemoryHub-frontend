// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { authService } from "../service/authService";
import { userService } from "../service/userService";

const AuthContext = createContext({
  /* … */
});

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const setAxiosToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { exp } = jwtDecode(token);
          if (exp * 1000 <= Date.now()) throw new Error("expired");
          setAxiosToken(token);

          // ← use userService here:
          const me = await userService.getCurrentUser();
          setUser(me);
        } catch {
          setAxiosToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (creds) => {
    setLoading(true);
    try {
      const { token } = await authService.signin(creds);
      setAxiosToken(token);

      // ← and here:
      const me = await userService.getCurrentUser();
      setUser(me);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const { token } = await authService.signup(data);
      setAxiosToken(token);
      const me = await userService.getCurrentUser();
      setUser(me);
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAxiosToken(null);
    setUser(null);
    navigate("/SignInPage", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

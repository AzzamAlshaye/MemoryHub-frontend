// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { authService } from "../service/authService";

const AuthContext = createContext({
  user: undefined,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFromStorage() {
      const raw = localStorage.getItem("token");
      if (!raw || !raw.startsWith("Bearer ")) {
        setLoading(false);
        return;
      }

      const token = raw.split(" ")[1];
      let payload;
      try {
        payload = jwtDecode(token);
      } catch (e) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      if (payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const me = await authService.getCurrentUser();
        setUser(me);
        setAuthenticated(true);
        if (me.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setAuthenticated(false);
        setUser(undefined);
      }

      setLoading(false);
    }

    loadFromStorage();

    const interceptorId = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setAuthenticated(false);
          setUser(undefined);
          toast.info("You are not logged in. Please sign in.");
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  async function login({ email, password }) {
    const { token } = await authService.signin({ email, password });
    localStorage.setItem("token", `Bearer ${token}`);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const me = await authService.getCurrentUser();
    setUser(me);
    setAuthenticated(true);
    toast.success("Logged in successfully");

    if (me.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  async function register({ email, password, role }) {
    const { token } = await authService.signup({ email, password, role });
    localStorage.setItem("token", `Bearer ${token}`);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const me = await authService.getCurrentUser();
    setUser(me);
    setAuthenticated(true);
    toast.success("Account created successfully");

    if (me.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setAuthenticated(false);
    setUser(undefined);
    toast.info("Signed out");
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
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

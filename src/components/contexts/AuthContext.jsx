// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
// import axios from "axios";
// import jwtDecode from "jwt-decode";
// import { authService } from "../services/authService";

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const [isAuthenticated, setAuthenticated] = useState(false);
//   const [isLoading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState();

//   // On mount, check token and redirect based on role
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         if (decoded.exp * 1000 > Date.now()) {
//           setAuthenticated(true);
//           setUserRole(decoded.role);
//           axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//           // Redirect based on role
//           if (decoded.role === "admin") {
//             navigate("/admin");
//           } else {
//             navigate("/dashboard");
//           }
//         } else {
//           localStorage.removeItem("token");
//         }
//       } catch {
//         localStorage.removeItem("token");
//       }
//     }
//     setLoading(false);

//     const interceptorId = axios.interceptors.response.use(
//       (response) => response,
//       (error) => {
//         if (error.response?.status === 401) {
//           localStorage.removeItem("token");
//           setAuthenticated(false);
//           setUserRole(undefined);
//           toast.info("Session expired. Please log in again.");
//           navigate("/login");
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.response.eject(interceptorId);
//     };
//   }, [navigate]);

//   const login = async ({ email, password }) => {
//     try {
//       const { token } = await authService.signin({ email, password });
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       const decoded = jwtDecode(token);
//       setUserRole(decoded.role);
//       setAuthenticated(true);
//       toast.success("Logged in successfully");
//       // Redirect based on role
//       if (decoded.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Login failed");
//       throw err;
//     }
//   };

//   const register = async ({ email, password, role }) => {
//     try {
//       const { token } = await authService.signup({ email, password, role });
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       const decoded = jwtDecode(token);
//       setUserRole(decoded.role);
//       setAuthenticated(true);
//       toast.success("Account created successfully");
//       // Redirect based on role
//       if (decoded.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Registration failed");
//       throw err;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     delete axios.defaults.headers.common["Authorization"];
//     setAuthenticated(false);
//     setUserRole(undefined);
//     toast.info("Signed out");
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ login, register, logout, isAuthenticated, isLoading, userRole }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

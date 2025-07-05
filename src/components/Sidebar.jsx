// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  FaHome,
  FaMapMarkedAlt,
  FaUsers,
  FaTicketAlt,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Parse JWT Token
function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userData = token ? parseJWT(token) : null;

  const user = userData
    ? {
        name: userData.name || "User",
        avatar:
          userData.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
        isLoggedIn: true,
      }
    : {
        name: "Guest",
        avatar:
          "https://www.wpar.net/wp-content/uploads/2021/05/gravater-icon.jpg",
        isLoggedIn: false,
      };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/SignInPage");
  };

  const menuItems = [
    { to: "/", icon: <FaHome size={20} />, label: "Home" },
    { to: "/mapPage", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
    { to: "/CommunitiesList", icon: <FaUsers size={20} />, label: "Communities" },
    { to: "/Mytickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
  ];

  return (
    <motion.aside
      initial={{ width: 60 }}
      whileHover={{ width: 240 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="hidden lg:flex flex-col h-screen sticky top-0 z-20 bg-white shadow-lg overflow-y-auto"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 px-3 py-6">
        <img
          src="/logo.webp"
          alt="Logo"
          className="w-10 h-auto object-contain"
        />
        <motion.span
          initial={{ opacity: 1 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-xl font-bold text-sky-700 whitespace-nowrap"
        >
          MapHub
        </motion.span>
      </Link>

      {/* Menu */}
      <nav className="flex-1 px-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-6 px-3 py-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-sky-100 text-sky-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <motion.div
                initial={{ opacity: 1 }}
                whileHover={{ x: 5, opacity: 1 }}
                className="flex-shrink-0"
              >
                {item.icon}
              </motion.div>
              <motion.span
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 1 }}
                transition={{ delay: 0 }}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="px-3 py-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-semibold text-gray-800 text-sm">
              {user.name}
            </span>
            {user.isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-xs text-sky-600 hover:underline flex items-center gap-1"
              >
                <FaSignOutAlt size={12} />
                View Profile
              </button>
            ) : (
              <Link
                to="/SignInPage"
                className="text-xs text-sky-600 hover:underline flex items-center gap-1"
              >
                <FaSignInAlt size={12} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

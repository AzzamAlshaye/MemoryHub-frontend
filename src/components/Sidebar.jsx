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
  FaUserEdit,
} from "react-icons/fa";
import { IoIosStats } from "react-icons/io";

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);

  const baseMenu = [
    { to: "/", icon: <FaHome size={20} />, label: "Home" },
    { to: "/mapPage", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
    { to: "/GroupList", icon: <FaUsers size={20} />, label: "Group List" },
    { to: "/Mytickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
  ];

  const adminMenu = [
    {
      to: "/admin/dashboard",
      icon: <IoIosStats size={20} />,
      label: "Admin Dashboard",
    },
    { to: "/admin/crud", icon: <FaUsers size={20} />, label: "Manage Users" },
    {
      to: "/admin/tickets",
      icon: <FaTicketAlt size={20} />,
      label: "All Tickets",
    },
  ];

  const menuItems =
    isLoggedIn && user.role === "admin"
      ? [
          // for admins only Home & Map from base, then admin links
          ...baseMenu.filter(
            (item) => item.to === "/" || item.to === "/mapPage"
          ),
          ...adminMenu,
        ]
      : baseMenu;

  return (
    <motion.aside
      initial={{ width: 60 }}
      whileHover={{ width: 240 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="hidden lg:flex flex-col h-screen sticky top-0 z-20 bg-white shadow-lg overflow-y-auto hide-scrollbar"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 px-3 py-6">
        <img
          src="/m-logo.webp"
          className="w-8 h-auto object-contain"
          alt="Logo"
        />
        <span className="text-xl font-bold text-neutral-800 whitespace-nowrap">
          MemoryHub
        </span>
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
                  ? "bg-[#f4e9e4] text-main-theme"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile / Auth */}
      <div className="px-3 py-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "/default-avatar.jpg"}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">
              {user?.name || "Guest"}
            </p>
            {isLoggedIn ? (
              <div className="flex items-center justify-between mt-2">
                <Link
                  to="/Profile"
                  className="flex items-center gap-1 text-xs text-main-theme hover:underline"
                >
                  <FaUserEdit size={12} />
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/SignInPage", { replace: true });
                  }}
                  className="p-1 rounded-full hover:bg-red-100 text-main-theme hover:text-red-600 transition"
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/SignInPage"
                className="flex items-center gap-1 mt-2 text-xs text-main-theme hover:underline"
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

export default Sidebar;

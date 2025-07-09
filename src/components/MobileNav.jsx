// src/components/MobileNav.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaMapMarkedAlt,
  FaUsers,
  FaTicketAlt,
  FaUserEdit,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();

  const baseMobile = [
    { to: "/", icon: <FaHome size={20} />, label: "Home" },
    { to: "/mapPage", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
    { to: "/GroupList", icon: <FaUsers size={20} />, label: "Communities" },
    { to: "/MyTickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
  ];

  const adminMobile = [
    {
      to: "/admin/dashboard",
      icon: <FaUsers size={20} />,
      label: "Admin Dashboard",
    },
    { to: "/admin/crud", icon: <FaUsers size={20} />, label: "Manage Users" },
    {
      to: "/admin/tickets",
      icon: <FaTicketAlt size={20} />,
      label: "All Tickets",
    },
  ];

  const menuItemsMobile =
    isLoggedIn && user.role === "admin"
      ? [
          ...baseMobile.filter(
            (item) => item.to === "/" || item.to === "/mapPage"
          ),
          ...adminMobile,
        ]
      : baseMobile;

  const handleLogout = () => {
    logout();
    navigate("/SignInPage", { replace: true });
    setIsOpen(false);
  };

  return (
    <header className="lg:hidden">
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <img src="/m-logo.webp" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-black text-lg">MemoryHub</span>
        </Link>
        <button onClick={() => setIsOpen(true)}>
          <FaBars className="text-main-theme" size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            className="fixed inset-0 z-50 flex"
          >
            {/* Backdrop */}
            <motion.div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <div className="relative bg-white w-64 h-full shadow-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img src="/m-logo.webp" alt="Logo" className="w-8 h-8" />
                  <span className="font-bold text-black">MemoryHub</span>
                </Link>
                <button onClick={() => setIsOpen(false)}>
                  <FaTimes className="text-main-theme" size={24} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto hide-scrollbar">
                <ul className="space-y-6">
                  {menuItemsMobile.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-gray-700 hover:text-sky-700 transition-colors"
                      >
                        {item.icon}
                        <span className="text-base">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Profile / Auth */}
              <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user?.avatar || "/default-avatar.jpg"}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">
                      {user?.name || "Guest"}
                    </p>
                    {isLoggedIn ? (
                      <Link
                        to="/Profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1 text-xs text-main-theme hover:underline"
                      >
                        <FaUserEdit size={12} /> View Profile
                      </Link>
                    ) : (
                      <Link
                        to="/SignInPage"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1 text-xs text-main-theme hover:underline"
                      >
                        <FaSignInAlt size={12} /> Sign In
                      </Link>
                    )}
                  </div>
                  {isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="p-1 rounded-full hover:bg-red-100 text-main-theme hover:text-red-600 transition"
                      title="Logout"
                    >
                      <FaSignOutAlt size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}

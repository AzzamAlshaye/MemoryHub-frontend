// src/components/MobileNav.jsx
import React, { useState, useEffect } from "react";
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
import { userService } from "../service/userService";

const menuItemsMobile = [
  { to: "/", icon: <FaHome size={20} />, label: "Home" },
  { to: "/mapPage", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
  { to: "/GroupList", icon: <FaUsers size={20} />, label: "Communities" },
  { to: "/MyTickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Guest",
    avatar: "https://www.wpar.net/wp-content/uploads/2021/05/gravater-icon.jpg",
    isLoggedIn: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    userService
      .getCurrentUser()
      .then((data) => {
        setUser({
          name: data.name || "User",
          avatar:
            data.avatar ||
            "https://randomuser.me/api/portraits/men/32.jpg",
          isLoggedIn: true,
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({ name: "Guest", avatar: user.avatar, isLoggedIn: false });
    navigate("/SignInPage");
    setIsOpen(false);
  };

  return (
    <header className="lg:hidden">
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/public/logoupdata.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="font-bold text-black text-lg">MapHub</span>
        </Link>
        <button onClick={() => setIsOpen(true)}>
          <FaBars className="text-[#fb8951]" size={24} />
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
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src="/public/logoupdata.png"
                    alt="Logo"
                    className="w-8 h-8"
                  />
                  <span className="font-bold text-black">MapHub</span>
                </Link>
                <button onClick={() => setIsOpen(false)}>
                  <FaTimes className="text-[#fb8951]" size={24} />
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
                    src={user.avatar}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold">
                      {user.name}
                    </p>
                    {user.isLoggedIn ? (
                      <Link
                        to="/Profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1 text-xs text-[#fb8951] hover:underline"
                      >
                        <FaUserEdit size={12} /> View Profile
                      </Link>
                    ) : (
                      <Link
                        to="/SignInPage"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-1 text-xs text-[#fb8951] hover:underline"
                      >
                        <FaSignInAlt size={12} /> Sign In
                      </Link>
                    )}
                  </div>
                  {user.isLoggedIn && (
                    <button
                      onClick={handleLogout}
                      className="p-1 rounded-full hover:bg-red-100 text-[#fb8951] hover:text-red-600 transition"
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

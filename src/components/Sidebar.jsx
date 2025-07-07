import React, { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import { userService } from "../service/userService";
import { div } from "framer-motion/client";

function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Guest",
    avatar: "https://www.wpar.net/wp-content/uploads/2021/05/gravater-icon.jpg",
    isLoggedIn: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    userService
      .getCurrentUser()
      .then((data) => {
        setUser({
          name: data.name || "User",
          avatar: data.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
          isLoggedIn: true,
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/SignInPage");
  };

  const menuItems = [
    { to: "/", icon: <FaHome size={20} />, label: "Home" },
    { to: "/mapPage", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
    { to: "/GroupList", icon: <FaUsers size={20} />, label: "Group List" },
    { to: "/Mytickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
  ];

  return (
    <motion.aside
      initial={{ width: 60 }}
      whileHover={{ width: 240 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="hidden lg:flex flex-col h-screen sticky top-0 z-20 bg-white shadow-lg overflow-y-auto no-scrollbar"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-4 px-3 py-6">
        <img
          src="/public/logoupdata.png"
          className="w-8 h-auto object-contain"
          alt="Logo"
        />
        <motion.span className="text-xl font-bold text-black whitespace-nowrap">
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
                  ? "bg-[#f4e9e4] text-[#fb8951]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <motion.div className="flex-shrink-0">{item.icon}</motion.div>
              <motion.span className="whitespace-nowrap">
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="px-3 py-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex justify-between items-start w-full">
            {/* الاسم و View Profile */}
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-800 text-sm px-1">
                {user.name}
              </p>

              {user.isLoggedIn ? (
                <Link
                  to="/Profile"
                  className="flex items-center gap-1 text-xs text-[#fb8951] hover:underline"
                >
                  <FaUserEdit size={12} />
                  View Profile
                </Link>
              ) : null}
            </div>

            {/* Logout أو Sign In */}
            <div className="">
              {user.isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full hover:bg-red-100 text-[#fb8951] hover:text-red-600 transition"
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                </button>
              ) : (
                <Link
                  to="/SignInPage"
                  className="text-xs text-[#fb8951] hover:underline flex items-center gap-1 mt-1"
                >
                  <FaSignInAlt size={12} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;

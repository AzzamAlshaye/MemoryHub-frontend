// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router";
import { FaHome, FaMapMarkedAlt, FaUsers, FaTicketAlt } from "react-icons/fa";

export default function Sidebar() {
  const menuItems = [
    {
      to: "/",
      icon: <FaHome className="text-sky-700" size={20} />,
      label: "Home",
    },
    {
      to: "/map",
      icon: <FaMapMarkedAlt className="text-sky-700" size={20} />,
      label: "Map",
    },
    {
      to: "/communities1",
      icon: <FaUsers className="text-sky-700" size={20} />,
      label: "Communities",
    },
    {
      to: "/Mytickets",
      icon: <FaTicketAlt className="text-sky-700" size={20} />,
      label: "My Tickets",
    },
  ];

  return (
    <aside
      className="
        hidden lg:flex flex-col
        w-20 h-screen
        bg-white border-r border-gray-200 p-4
        rounded-tr-lg rounded-br-lg
        sticky top-0 z-10
        transition-all duration-300 overflow-hidden
        group hover:w-64
      "
    >
      {/* Logo */}
      <Link to="/" className="flex items-center mb-8">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span
          className="
            ml-2 font-bold text-sky-700 whitespace-nowrap
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
        >
          Map Memory
        </span>
      </Link>

      {/* Menu */}
      <nav className="flex-1">
        <ul className="space-y-6 ml-1.5">
          {menuItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="flex items-center">
                {item.icon}
                <span
                  className="
                    ml-3 whitespace-nowrap
                    opacity-0 transition-opacity duration-300
                    group-hover:opacity-100
                  "
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Profile */}
      <div className="mt-auto flex items-center gap-3 pt-8 border-t border-gray-200">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="User avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="font-semibold">John Doe</p>
          <Link to="/dashboard" className="text-xs text-sky-700">
            View Profile
          </Link>
        </div>
      </div>
    </aside>
  );
}

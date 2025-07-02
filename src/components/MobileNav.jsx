// src/components/MobileNav.jsx
import React, { useState } from "react";
import { Link } from "react-router";
import { FaBars, FaTimes } from "react-icons/fa";
import { FaHome, FaMapMarkedAlt, FaUsers, FaTicketAlt } from "react-icons/fa";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { to: "/", icon: <FaHome size={20} />, label: "Home" },
    { to: "/map", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
    { to: "/communities", icon: <FaUsers size={20} />, label: "Communities" },
    { to: "/MyTickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
  ];

  return (
    <>
      <header className="flex items-center justify-between bg-white p-4 border-b border-gray-200 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-sky-700 text-lg">Map Memory</span>
        </Link>
        <button onClick={() => setIsOpen(true)}>
          <FaBars className="text-sky-700" size={24} />
        </button>
      </header>

      {/* Slide-in menu */}
      <aside
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transform \
          ${isOpen ? "translate-x-0" : "-translate-x-full"} \
          transition-transform duration-300 lg:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className="w-64 bg-white h-full p-6 border-r border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-sky-700">Map Memory</span>
            </Link>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes className="text-sky-700" size={24} />
            </button>
          </div>

          <ul className="space-y-6">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex items-center gap-3 text-gray-700 hover:text-sky-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

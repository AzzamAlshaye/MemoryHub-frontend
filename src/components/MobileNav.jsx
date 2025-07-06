// src/components/MobileNav.jsx
import React, { useState } from "react";
import { Link } from "react-router";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaMapMarkedAlt,
  FaUsers,
  FaTicketAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const menuItemsMobile = [
  { to: "/", icon: <FaHome size={20} />, label: "Home" },
  { to: "/mapPage", icon: <FaMapMarkedAlt size={20} />, label: "Map" },
  { to: "/CommunitiesList", icon: <FaUsers size={20} />, label: "Communities" },
  { to: "/MyTickets", icon: <FaTicketAlt size={20} />, label: "My Tickets" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="lg:hidden">
      <div className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.webp" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-sky-700 text-lg">Map Memory</span>
        </Link>
        <button onClick={() => setIsOpen(true)}>
          <FaBars className="text-sky-700" size={24} />
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
                <Link to="/" className="flex items-center gap-2">
                  <img src="/logo.webp" alt="Logo" className="w-8 h-8" />
                  <span className="font-bold text-sky-700">Map Memory</span>
                </Link>
                <button onClick={() => setIsOpen(false)}>
                  <FaTimes className="text-sky-700" size={24} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto">
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

              <div className="mt-auto pt-6 border-t border-gray-200">
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold text-gray-600 hover:text-sky-600"
                >
                  Profile
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}

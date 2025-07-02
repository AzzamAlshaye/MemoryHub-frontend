// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router";
import { FaHome, FaMapMarkedAlt, FaUsers, FaTicketAlt } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-full md:w-64 bg-white border-r p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 text-sky-600 font-bold text-lg mb-10">
          <FaMapMarkedAlt className="text-xl" /> Map Memory
        </div>
        <ul className="space-y-4">
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-sky-600"
            >
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link
              to="/map"
              className="flex items-center gap-2 text-gray-700 font-semibold hover:text-sky-600"
            >
              <FaMapMarkedAlt /> Map
            </Link>
          </li>
          <li>
            <Link
              to="/communities1"
              className="flex items-center gap-2 text-gray-700 hover:text-sky-600"
            >
              <FaUsers /> Communities
            </Link>
          </li>
          <li>
            <Link
              to="/tickets"
              className="flex items-center gap-2 text-gray-700 hover:text-sky-600"
            >
              <FaTicketAlt /> My Tickets
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-10 flex items-center gap-3">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          className="w-10 h-10 rounded-full object-cover"
          alt="User avatar"
        />
        <div>
          <p className="text-sm font-semibold">John Doe</p>
          <Link to="/dashboard" className="text-xs text-sky-500">
            View Profile
          </Link>
        </div>
      </div>
    </aside>
  );
}

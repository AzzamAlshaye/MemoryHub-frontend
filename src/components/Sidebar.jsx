import React from "react";
import { FaHome, FaMapMarkedAlt, FaUsers, FaTicketAlt } from "react-icons/fa";
export default function Sidebar() {
  return (
    <>
      <aside className="w-full md:w-64 bg-white border-r p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg mb-10">
            <FaMapMarkedAlt className="text-xl" /> Map Memory
          </div>
          <ul className="space-y-4">
            <li>
              <a
                href="/"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <FaHome /> Home
              </a>
            </li>
            <li>
              <a
                href="/map"
                className="flex items-center gap-2 text-gray-700 font-semibold"
              >
                <FaMapMarkedAlt /> Map
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <FaUsers /> Communities
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <FaTicketAlt /> My Tickets
              </a>
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
            <a href="#" className="text-xs text-blue-500">
              View Profile
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

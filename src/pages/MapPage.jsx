import React, { useState } from "react";
import { FaHome, FaMapMarkedAlt, FaUsers, FaTicketAlt } from "react-icons/fa";
import Footer from "../components/Footer";
import PinsMap from "../components/PinsMap";

export default function MapPage() {
  const [filter, setFilter] = useState("public");

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
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

        <main className="flex-1 p-6">
          <div className="bg-white p-6 rounded shadow mb-6">
            <h1 className="text-xl font-semibold mb-1">Welcome back, John!</h1>
            <p className="text-gray-500 text-sm">Ready to map your memories?</p>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <input
              type="text"
              placeholder="Search locations or memories..."
              className="w-full sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <div className="flex items-center space-x-2">
              <label className="font-medium text-sm">Privacy:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <h2 className="font-semibold text-lg mb-2">Your Memory Map</h2>
              <div className="w-full h-[450px] rounded shadow overflow-hidden">
                <PinsMap filter={filter} />
              </div>
            </div>

            {/* Memories */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg mb-4">My Memories</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3 items-start">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold">Sunset at Malibu Beach</p>
                    <p className="text-gray-500 text-sm">
                      A beautiful sunset over the ocean.
                    </p>
                    <span className="text-xs text-yellow-600">Public</span> ·{" "}
                    <span className="text-gray-400">June 15, 2023</span>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <img
                    src="https://randomuser.me/api/portraits/men/45.jpg"
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold">Camping in Yosemite</p>
                    <p className="text-gray-500 text-sm">
                      A night under the stars.
                    </p>
                    <span className="text-xs text-green-600">Group</span> ·{" "}
                    <span className="text-gray-400">July 10, 2023</span>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <img
                    src="https://randomuser.me/api/portraits/lego/3.jpg"
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                  />
                  <div>
                    <p className="font-semibold">Road Trip to Vegas</p>
                    <p className="text-gray-500 text-sm">
                      An unforgettable adventure.
                    </p>
                    <span className="text-xs text-blue-600">Personal</span> ·{" "}
                    <span className="text-gray-400">August 5, 2023</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

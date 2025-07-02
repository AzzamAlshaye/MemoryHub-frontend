import React, { useState } from "react";
import PinsMap from "../../components/PinsMap";

export default function MapPage() {
  const [filter, setFilter] = useState("public");
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 to-white">
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Greeting Card */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back, John!
          </h2>
          <p className="text-gray-500">Ready to map your memories?</p>
        </div>

        {/* Controls & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 flex flex-col space-y-6">
            {/* Search & Filter */}
            <div className="flex bg-white flex-col justify-center sm:flex-row items-center gap-4 p-4 rounded-2xl shadow-md">
              <input
                type="text"
                placeholder="Search locations or memories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 shadow-sm"
              />
              <div className="flex items-center gap-2">
                <label
                  htmlFor="privacy"
                  className="text-gray-700 font-medium"
                ></label>
                <select
                  id="privacy"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="group">Group</option>
                </select>
              </div>
            </div>

            {/* Map Section */}
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Your Memory Map
              </h3>
              <div className="w-full h-[70vh] md:h-[80vh] rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <PinsMap filter={filter} search={search} />
              </div>
            </div>
          </div>

          {/* Memories List */}
          <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3 border-neutral-100">
              My Memories
            </h3>
            <ul className="space-y-4 flex flex-col gap-4 overflow-y-auto">
              {/* Example items; replace with dynamic data */}
              <li className="flex space-x-4 border-b pb-3 border-neutral-100">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Memory"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-md font-medium text-gray-900 ">
                    Sunset at Malibu Beach
                  </h4>

                  <div className="mt-1 flex items-center text-xs">
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                      Public
                    </span>
                    <span className="mx-2 text-gray-300">·</span>
                    <time className="text-gray-400">June 15, 2023</time>
                  </div>
                </div>
              </li>
              <li className="flex space-x-4 border-b pb-3 border-neutral-100">
                <img
                  src="https://randomuser.me/api/portraits/men/45.jpg"
                  alt="Memory"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-md font-medium text-gray-900">
                    Camping in Yosemite
                  </h4>

                  <div className="mt-1 flex items-center text-xs">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      Group
                    </span>
                    <span className="mx-2 text-gray-300">·</span>
                    <time className="text-gray-400">July 10, 2023</time>
                  </div>
                </div>
              </li>
              <li className="flex space-x-4 border-b pb-3 border-neutral-100">
                <img
                  src="https://randomuser.me/api/portraits/lego/3.jpg"
                  alt="Memory"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-md font-medium text-gray-900">
                    Road Trip to Vegas
                  </h4>
                  <p className="text-gray-500 text-sm"></p>
                  <div className="mt-1 flex items-center text-xs">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      Personal
                    </span>
                    <span className="mx-2 text-gray-300">·</span>
                    <time className="text-gray-400">August 5, 2023</time>
                  </div>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}
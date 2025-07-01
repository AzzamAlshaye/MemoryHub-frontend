import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import {
  FaHome,
  FaUsers,
  FaTicketAlt,
  FaSearch,
  FaMapMarkedAlt,
  FaPlus,
  FaSignInAlt,
  FaBars,
} from "react-icons/fa";

const MySwal = withReactContent(Swal);

function CommunitiesList1() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const data = [
    {
      title: "Travel Enthusiasts",
      description: "Share travel memories and tips.",
      activity: "2h ago",
      members: "42",
      img: "/Travel.png",
      unread: 3,
    },
    {
      title: "City Explorers",
      description: "Discover hidden city gems.",
      activity: "5h ago",
      members: "88",
      img: "/City.png",
      unread: 0,
    },
    {
      title: "Photography Club",
      description: "Join photo walks and share shots.",
      activity: "1d ago",
      members: "125",
      img: "/Photography.png",
      unread: 5,
    },
    {
      title: "Hiking Buddies",
      description: "Plan group hikes and trail tips.",
      activity: "3d ago",
      members: "64",
      img: "/Hiking.png",
      unread: 0,
    },
    {
      title: "Foodie Adventures",
      description: "Culinary experiences and tours.",
      activity: "12h ago",
      members: "102",
      img: "/Foodie.png",
      unread: 2,
    },
    {
      title: "Historical Sites",
      description: "Landmarks and history shared.",
      activity: "2d ago",
      members: "57",
      img: "/History.png",
      unread: 0,
    },
    {
      title: "Beach Lovers",
      description: "Sun, surf, and seafood spots.",
      activity: "7h ago",
      members: "77",
      img: "/Beach.png",
      unread: 1,
    },
    {
      title: "Cultural Exchange",
      description: "International traditions and languages.",
      activity: "1h ago",
      members: "93",
      img: "/Culture.png",
      unread: 0,
    },
  ];

  const filtered = data.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    MySwal.fire({
      html: <CreateGroup />,
      showConfirmButton: false,
      background: "#fff",
      customClass: { popup: "shadow-xl rounded-lg" },
    });
  };

  const openJoinModal = () => {
    MySwal.fire({
      html: <JoinGroup />,
      showConfirmButton: false,
      background: "#fff",
      customClass: { popup: "shadow-xl rounded-lg" },
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Toggle on Mobile */}
      <div className="md:hidden p-4 bg-white shadow">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars className="text-xl text-gray-700" />
        </button>
      </div>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 flex-shrink-0 bg-white border-r shadow-lg md:overflow-auto`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl mb-8">
            <FaMapMarkedAlt className="text-2xl" />
            <span>Map Memory</span>
          </div>
          <nav className="space-y-4">
            {[
              { href: "/", icon: FaHome, label: "Home" },
              { href: "/map", icon: FaMapMarkedAlt, label: "Map" },
              {
                href: "/communities",
                icon: FaUsers,
                label: "Communities",
                active: true,
              },
              { href: "/tickets", icon: FaTicketAlt, label: "My Tickets" },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  item.active
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <item.icon className="text-gray-600" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 flex items-center gap-3 border-t">
          <img
            src="https://randomuser.me/api/portraits/women/45.jpg"
            alt="Sarah Johnson"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">Sarah Johnson</p>
            <a href="#" className="text-xs text-blue-500 hover:underline">
              View Profile
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Communities</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="w-full sm:w-64 py-2 pl-12 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={openCreateModal}
                className="flex-1 sm:flex-none py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Create
              </button>
              <button
                onClick={openJoinModal}
                className="flex-1 sm:flex-none py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium transition flex items-center justify-center"
              >
                <FaSignInAlt className="mr-2" /> Join
              </button>
            </div>
          </div>
        </div>

        {/* Communities List */}
        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
          {filtered.map((c, idx) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition cursor-pointer gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {c.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center sm:flex-col gap-4 sm:gap-1 text-sm text-gray-500">
                <span>{c.activity}</span>
                <span className="font-medium text-blue-400">
                  {c.unread > 0 ? `${c.unread} new` : `${c.members} members`}
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* Load More Button */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition">
            Load More
          </button>
        </div>
      </main>
    </div>
  );
}

export default CommunitiesList1;

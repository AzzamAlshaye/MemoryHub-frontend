import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import { FaSearch, FaPlus, FaSignInAlt } from "react-icons/fa";

const MySwal = withReactContent(Swal);

function CommunitiesList() {
  const [search, setSearch] = useState("");

  const data = [
    {
      title: "Travel Enthusiasts",
      description: "Share travel memories and tips.",
      img: "/Travel.png",
    },
    {
      title: "City Explorers",
      description: "Discover hidden city gems.",
      img: "/City.png",
    },
    {
      title: "Photography Club",
      description: "Join photo walks and share shots.",
      img: "/Photography.png",
    },
    {
      title: "Hiking Buddies",
      description: "Plan group hikes and trail tips.",
      img: "/Hiking.png",
    },
    {
      title: "Foodie Adventures",
      description: "Culinary experiences and tours.",
      img: "/Foodie.png",
    },
    {
      title: "Historical Sites",
      description: "Landmarks and history shared.",
      img: "/History.png",
    },
    {
      title: "Beach Lovers",
      description: "Sun, surf, and seafood spots.",
      img: "/Beach.png",
    },
    {
      title: "Cultural Exchange",
      description: "International traditions and languages.",
      img: "/Culture.png",
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Communities</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
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
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={openCreateModal}
                className="flex-1 sm:flex-none py-2 px-4 bg-green-100 hover:bg-green-200 hover:text-green-800 text-green-700 rounded-full font-medium transition flex items-center justify-center"
              >
                <FaPlus className="mr-2" /> Create
              </button>
              <button
                onClick={openJoinModal}
                className="flex-1 sm:flex-none py-2 px-4 bg-blue-100 hover:bg-blue-200  text-blue-700 rounded-full font-medium transition flex items-center justify-center"
              >
                <FaSignInAlt className="mr-2" /> Join
              </button>
            </div>
          </div>
        </div>

        <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow overflow-hidden">
          {filtered.map((c, idx) => (
            <li
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 hover:bg-gray-50 transition cursor-pointer gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={c.img}
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
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition">
            Load More
          </button>
        </div>
      </main>
    </div>
  );
}

export default CommunitiesList;

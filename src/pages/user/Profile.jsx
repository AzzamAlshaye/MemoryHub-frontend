import React, { useState } from "react";
import {
  FaCamera,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const memories = [
  {
    id: "1",
    title: "Sunset Beach Walk",
    location: "Malibu, California",
    description:
      "Beautiful sunset walk along the beach. The colors were absolutely breathtaking!",
    date: "2023-06-15",
    visibility: "Public",
    image: "/Sunset.png",
  },
  {
    id: "2",
    title: "City Lights",
    location: "New York City, NY",
    description:
      "The city that never sleeps. Amazing view from the rooftop bar!",
    date: "2023-05-28",
    visibility: "Private",
    image: "/City.png",
  },
  {
    id: "3",
    title: "Mountain Trail",
    location: "Rocky Mountains, CO",
    description:
      "Hiking with friends in the Rockies. Such an amazing experience!",
    date: "2023-04-10",
    visibility: "Group",
    image: "/Mountain.png",
  },
];

export default function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6 relative mb-10">
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
              <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                Delete Account
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/45.jpg"
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
            />
            <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white shadow">
              <FaCamera className="text-white" />
            </button>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-800">Sarah Johnson</h2>
            <p className="text-sm text-gray-500">Joined: January 2023</p>
            <div className="flex gap-3 mt-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
                87 Memories
              </span>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                4 Groups
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {[
            { label: "Full Name", value: "Sarah Johnson" },
            { label: "Email Address", value: "sarah.johnson@example.com" },
            { label: "Password", value: "**********" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-gray-800 font-medium">{item.value}</p>
              </div>
              <button className="text-blue-500">
                <FaEdit />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">My Memories</h3>
        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
          {[...memories]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((memory, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 w-[260px]"
              >
                <div className="relative">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition"
                      onClick={() => {
                        localStorage.setItem("editMemory", JSON.stringify(memory));
                        navigate(`/edit/${memory.id}`);
                      }}
                    >
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                  <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {memory.visibility}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-500 transition-colors cursor-pointer">
                    {memory.title}
                  </h4>
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
                    {memory.location}
                  </p>
                  <p className="text-gray-400 text-xs">{memory.date}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
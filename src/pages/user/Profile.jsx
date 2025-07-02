import React from "react";
import {
  FaMapMarkedAlt,
  FaHome,
  FaUsers,
  FaTicketAlt,
  FaBell,
  FaEnvelope,
  FaCamera,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const memories = [
  {
    title: "Sunset Beach Walk",
    location: "Malibu, California",
    description:
      "Beautiful sunset walk along the beach. The colors were absolutely breathtaking!",
    date: "June 15, 2023",
    visibility: "Public",
    image: "/Sunset.png",
  },
  {
    title: "City Lights",
    location: "New York City, NY",
    description:
      "The city that never sleeps. Amazing view from the rooftop bar!",
    date: "May 28, 2023",
    visibility: "Private",
    image: "/City.png",
  },
  {
    title: "Mountain Trail",
    location: "Rocky Mountains, CO",
    description:
      "Hiking with friends in the Rockies. Such an amazing experience!",
    date: "April 10, 2023",
    visibility: "Group",
    image: "/Mountain.png",
  },
];

function Profile() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Profile Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src="https://randomuser.me/api/portraits/women/45.jpg"
                className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white shadow-lg">
                <FaCamera className="text-white" />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Sarah Johnson
              </h2>
              <p className="text-sm text-gray-500">sarah.johnson@example.com</p>
            </div>
            <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition">
              Edit Profile
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Name", placeholder: "sarah Johnson" },
              { label: "Email", placeholder: "Enter your Email" },
              { label: "Password", placeholder: "**********" },
                ].map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Email Address
            </h3>
            <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
              <FaEnvelope className="text-blue-500" size={18} />
              <div>
                <p className="text-gray-800">sarah.johnson@example.com</p>
                <span className="text-xs text-gray-400">1 month ago</span>
              </div>
              <button className="ml-auto text-sm text-blue-500 hover:underline">
                {" "}
                Edit Email
              </button>
            </div>
          </div>
        </section>

        {/* Memories Section */}
        <section className="flex-1 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            My Memories
          </h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.map((memory, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <div className="relative">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
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
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {memory.description}
                  </p>
                  <p className="text-gray-400 text-xs">{memory.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;

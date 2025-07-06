import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import { FaSearch, FaPlus, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

const Card = ({ title, description, img }) => (
  <motion.div
    whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
    className="bg-white rounded-2xl overflow-hidden transform transition-shadow duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md"
  >
    <div className="relative h-48">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-xl sm:text-2xl font-extrabold drop-shadow-lg">
          {title}
        </h3>
      </div>
    </div>
    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      <button className="w-full py-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-600 hover:from-amber-400 hover:to-amber-700 text-white font-semibold transition">
        View Group
      </button>
    </div>
  </motion.div>
);

function GroupList() {
  const [search, setSearch] = useState("");

  const data = [
    {
      title: "Travel Enthusiasts",
      description: "Embark on unforgettable journeys with like-minded travelers...",
      img: "https://th.bing.com/th/id/R.bbb118c427c3255e9385041e5b7e0382?rik=9E3ANGguMBN6ZA&pid=ImgRaw&r=0",
    },
    {
      title: "City Explorers",
      description: "Dive into the heart of the city with guided strolls...",
      img: "https://tse3.mm.bing.net/th/id/OIP.cH0Ft9jXIEPotKyaEQEduQHaFj?w=1200&h=900&pid=ImgDetMain&r=0",
    },
    {
      title: "Photography Club",
      description: "Capture the world through your lens and join photo walks...",
      img: "https://tse3.mm.bing.net/th/id/OIP.wIH4eidy8xc-bYhrg-DKLQHaE8?rs=1&pid=ImgDetMain&r=0",
    },
    {
      title: "Hiking Buddies",
      description: "Plan scenic trail excursions, share gear recommendations...",
      img: "https://via.placeholder.com/400x200.png?text=Hiking+Buddies",
    },
    {
      title: "Foodie Adventures",
      description: "Savor culinary delights, explore hidden gems...",
      img: "https://via.placeholder.com/400x200.png?text=Foodie+Adventures",
    },
    {
      title: "Historical Sites",
      description: "Delve into rich histories, organize heritage visits...",
      img: "https://via.placeholder.com/400x200.png?text=Historical+Sites",
    },
    {
      title: "Beach Lovers",
      description: "Catch the perfect wave, relax on golden sands...",
      img: "https://via.placeholder.com/400x200.png?text=Beach+Lovers",
    },
    {
      title: "Cultural Exchange",
      description: "Celebrate diversity by sharing language lessons...",
      img: "https://via.placeholder.com/400x200.png?text=Cultural+Exchange",
    },
    {
      title: "Tech Innovators",
      description: "Collaborate on cutting-edge projects...",
      img: "https://via.placeholder.com/400x200.png?text=Tech+Innovators",
    },
    {
      title: "Fitness Freaks",
      description: "Join daily workout challenges, exchange nutrition advice...",
      img: "https://via.placeholder.com/400x200.png?text=Fitness+Freaks",
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
      customClass: { popup: "shadow-2xl rounded-3xl" },
    });
  };

  const openJoinModal = () => {
    MySwal.fire({
      html: <JoinGroup />,
      showConfirmButton: false,
      background: "#fff",
      customClass: { popup: "shadow-2xl rounded-3xl" },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-amber-50 to-amber-200 px-4 sm:px-6 lg:px-8">
      <main className="flex-1 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">GroupList</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="w-full py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={openCreateModal}
                className="flex-1 sm:flex-none py-3 px-5 bg-teal-500 hover:bg-teal-600 text-white rounded-full font-semibold transition"
              >
                <FaPlus className="inline-block mr-2" /> Create
              </button>
              <button
                onClick={openJoinModal}
                className="flex-1 sm:flex-none py-3 px-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-semibold transition"
              >
                <FaSignInAlt className="inline-block mr-2" /> Join
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 place-items-center">
          {filtered.length > 0 ? (
            filtered.map((c, i) => <Card key={i} {...c} />)
          ) : (
            <div className="text-center col-span-full text-gray-500 text-lg font-medium mt-10">
              No groups match your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default GroupList;

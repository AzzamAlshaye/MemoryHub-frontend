import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import { FaSearch, FaPlus, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const MySwal = withReactContent(Swal);

// Card component مدمج داخل نفس الملف
const Card = ({ title, description, img }) => (
  <motion.div
    whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
    className="bg-white rounded-2xl overflow-hidden transform transition-shadow duration-300 max-w-sm w-full"
  >
    <div className="relative h-48">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-2xl font-extrabold drop-shadow-lg">
          {title}
        </h3>
      </div>
    </div>
    <div className="p-6 space-y-4">
      <p className="text-gray-700 text-sm leading-relaxed">
        {description}
      </p>
      <button className="w-full py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold shadow-lg transition">
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
      description: "Embark on unforgettable journeys with like-minded travelers, exchanging tips, photos, and stories from every corner of the globe.",
      img: "https://th.bing.com/th/id/R.bbb118c427c3255e9385041e5b7e0382?rik=9E3ANGguMBN6ZA&pid=ImgRaw&r=0",
    },
    {
      title: "City Explorers",
      description: "Dive into the heart of the city with guided strolls, secret spots, cultural insights, and urban adventures that you won't find on any map.",
      img: "https://tse3.mm.bing.net/th/id/OIP.cH0Ft9jXIEPotKyaEQEduQHaFj?w=1200&h=900&pid=ImgDetMain&r=0",
    },
    {
      title: "Photography Club",
      description: "Capture the world through your lens and join weekly photo walks, workshops, and constructive critiques to elevate your photography skills.",
      img: "https://tse3.mm.bing.net/th/id/OIP.wIH4eidy8xc-bYhrg-DKLQHaE8?rs=1&pid=ImgDetMain&r=0",
    },
    {
      title: "Hiking Buddies",
      description: "Plan scenic trail excursions, share gear recommendations, and motivate each other with inspiring hiking stories and safety tips.",
      img: "https://via.placeholder.com/400x200.png?text=Hiking+Buddies",
    },
    {
      title: "Foodie Adventures",
      description: "Savor culinary delights, explore hidden gem restaurants, share recipes, and organize tasting tours to discover flavors around town.",
      img: "https://via.placeholder.com/400x200.png?text=Foodie+Adventures",
    },
    {
      title: "Historical Sites",
      description: "Delve into rich histories, organize heritage site visits, share archival photos, and discuss fascinating stories from the past.",
      img: "https://via.placeholder.com/400x200.png?text=Historical+Sites",
    },
    {
      title: "Beach Lovers",
      description: "Catch the perfect wave, relax on golden sands, find the best surf spots, and share seaside adventures with fellow beach enthusiasts.",
      img: "https://via.placeholder.com/400x200.png?text=Beach+Lovers",
    },
    {
      title: "Cultural Exchange",
      description: "Celebrate diversity by sharing language lessons, traditional recipes, cultural events, and build friendships that span continents.",
      img: "https://via.placeholder.com/400x200.png?text=Cultural+Exchange",
    },
    {
      title: "Tech Innovators",
      description: "Collaborate on cutting-edge projects, discuss the latest tech trends, share resources, and inspire each other to innovate for the future.",
      img: "https://via.placeholder.com/400x200.png?text=Tech+Innovators",
    },
    {
      title: "Fitness Freaks",
      description: "Join daily workout challenges, exchange health and nutrition advice, track progress, and stay motivated with this supportive fitness community.",
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
      html: <CreateGroup />, showConfirmButton: false, background: "#fff", customClass: { popup: "shadow-2xl rounded-3xl" }
    });
  };

  const openJoinModal = () => {
    MySwal.fire({
      html: <JoinGroup />, showConfirmButton: false, background: "#fff", customClass: { popup: "shadow-2xl rounded-3xl" }
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-800">GroupList</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search communities..."
                className="w-full sm:w-72 py-3 pl-12 pr-4 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={openCreateModal}
                className="flex-1 sm:flex-none py-3 px-5 bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 hover:from-yellow-300 hover:via-orange-500 hover:to-red-600 text-white rounded-full font-semibold transition shadow"
              >
                <FaPlus className="inline-block mr-2" /> Create
              </button>
              <button
                onClick={openJoinModal}
                className="flex-1 sm:flex-none py-3 px-5 bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 hover:from-yellow-300 hover:via-orange-500 hover:to-red-600 text-white rounded-full font-semibold transition shadow"
              >
                <FaSignInAlt className="inline-block mr-2" /> Join
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
          {filtered.map((c, i) => (
            <Card key={i} {...c} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default GroupList;

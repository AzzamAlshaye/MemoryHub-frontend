// src/pages/user/GroupPage.jsx
import React, { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FaSort } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { motion } from "framer-motion";

function GroupPage() {
  const initialCommunities = [
    {
      title: "Travel Enthusiasts",
      description:
        "A community for sharing travel memories, tips, and planning group adventures around the world.",
            date: "June 15 2023",

      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },
    {
      title: "City Explorers",
      description:
        "Discover hidden gems in your city with fellow urban adventurers. Weekly meetups and photo challenges.",
         date: "July 15 2023",
      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },
    {
      title: "Photography Club",
      description:
        "Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.",
      date: "oct 15 2023",
      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },

    {
      title: "Photography Club",
      description:
        "Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.",
      date: "oct 15 2023",
      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },

    {
      title: "Photography Club",
      description:
        "Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.",
      date: "oct 15 2023",
      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },

    {
      title: "Photography Club",
      description:
        "Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.",
      date: "oct 15 2023",
      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },

    {
      title: "Photography Club",
      description:
        "Share your best shots, learn techniques, and join photo walks with fellow photography enthusiasts.",
      date: "oct 15 2023",
      img: "/magical-golden-glittering-wave-in-abstract-sparkling-background-for-festive-design-photo.jpg",
    },
  ];

  const [communities, setCommunities] = useState(initialCommunities);
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  // Sort function
  const sortPosts = (data, criterion) => {
    const sorted = [...data];
    if (criterion === "recent") {
      sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (criterion === "alphabetical") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criterion === "members") {
      sorted.sort((a, b) => b.members - a.members);
    }
    return sorted;
  };

  // Apply sort + search
  const displayed = sortPosts(
    communities.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    sortBy
  );

  useEffect(() => {
    setCommunities((prev) => sortPosts(prev, sortBy));
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-900">
            Travel Buddies Group
          </h1>
          <p className="text-gray-600 text-sm">
            Share your travel memories with your friends
          </p>
        </div>
      
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaSort className="text-gray-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="recent">Recently Active</option>
            <option value="alphabetical">A – Z</option>
            <option value="members">Most Members</option>
          </select>
        </div>
      </div>

      {/* Memory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden cursor-pointer transition"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {item.date}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {item.description}
              </p>
              
              <div className="mt-3 flex items-center justify-between">
               
               
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 flex justify-center">
       
      </div>
    </div>
  );
}
export default GroupPage
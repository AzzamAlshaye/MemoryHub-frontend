// src/pages/groups/GroupList.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSearch, FaPlus, FaSignInAlt, FaUsers } from "react-icons/fa";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import { groupService } from "../../service/groupService";

const MySwal = withReactContent(Swal);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120 } },
  hover: { scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
};

export default function GroupList() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    groupService
      .list()
      .then((data) => {
        if (typeof data === "string" && data.trim().startsWith("<")) {
          throw new Error("Invalid server response");
        }
        const list = Array.isArray(data) ? data : data.groups ?? [];
        setGroups(list);
      })
      .catch((err) => setError(err.message || "Failed to load groups"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      groups.filter((g) =>
        [g.name, g.description].join(" ").toLowerCase().includes(search.toLowerCase())
      ),
    [groups, search]
  );

  const openCreate = () =>
    MySwal.fire({
      html: <CreateGroup />,
      showConfirmButton: false,
      background: "transparent",
      customClass: { popup: "rounded-3xl backdrop-blur-lg bg-white/30 p-0 shadow-2xl" },
    });

  const openJoin = () =>
    MySwal.fire({
      html: <JoinGroup />,
      showConfirmButton: false,
      background: "transparent",
      customClass: { popup: "rounded-3xl backdrop-blur-lg bg-white/30 p-0 shadow-2xl" },
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white text-gray-800">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">
            <FaUsers className="inline-block mr-2" />
            Groups
          </h1>
          <div className="flex flex-auto md:flex-none items-center gap-4">
            <div className="relative flex-1 md:flex-[0_0_320px]">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups..."
                className="w-full py-3 pl-12 pr-4 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-amber-300 transition"
              />
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white rounded-full shadow-lg hover:opacity-95 transition"
            >
              <FaPlus /> Create
            </button>
            <button
              onClick={openJoin}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full shadow-lg hover:opacity-95 transition"
            >
              <FaSignInAlt /> Join
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-white rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500 mt-12">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            No groups match your search.
          </p>
        ) : (
          <motion.ul
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((g, idx) => (
              <motion.li
                key={g.id}
                custom={idx}
                variants={cardVariants}
                whileHover="hover"
                className="cursor-pointer"
                onClick={() => navigate(`/group/${g.id}`)}
              >
                <div className="rounded-2xl overflow-hidden backdrop-blur-sm bg-white/40 border border-white/20">
                  <div className="relative h-48">
                    <img
                      src={g.avatar || "/placeholder.png"}
                      alt={g.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold drop-shadow-xl">
                      {g.name}
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-gray-700 text-sm leading-relaxed h-16 overflow-hidden">
                      {g.description}
                    </p>
                    <span className="inline-block px-4 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      {g.membersCount ?? 0} members
                    </span>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </main>
    </div>
  );
}

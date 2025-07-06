import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import { FaSearch, FaPlus, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { groupService } from "../../service/groupService";

const MySwal = withReactContent(Swal);

const Card = ({ title, description, avatar, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
    className="cursor-pointer bg-white rounded-2xl overflow-hidden transform transition-shadow duration-300 w-full max-w-xs sm:max-w-sm md:max-w-md"
  >
    <div className="relative h-48">
      <img
        src={avatar || "https://via.placeholder.com/400x200.png?text=No+Image"}
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
      <button className="w-full py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300">
        View Group
      </button>
    </div>
  </motion.div>
);

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
        // Detect HTML fallback
        if (
          typeof data === "string" &&
          data.trim().startsWith("<!DOCTYPE html>")
        ) {
          console.error(
            "API returned HTML: likely wrong endpoint or missing proxy"
          );
          throw new Error(
            "Unexpected HTML response from server. Check API URL or proxy config."
          );
        }
        let list = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (data.groups && Array.isArray(data.groups)) {
          list = data.groups;
        } else {
          console.warn("Unexpected groups list format", data);
        }
        setGroups(list);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load groups");
      })
      .finally(() => setLoading(false));
  }, []);

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

  const filtered = Array.isArray(groups)
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          (g.description || "").toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF7F0] px-4 sm:px-6 lg:px-8">
      <main className="flex-1 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Groups
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search groups..."
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

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 place-items-center">
            {filtered.length > 0 ? (
              filtered.map((group) => (
                <Card
                  key={group.id}
                  title={group.name}
                  description={group.description}
                  avatar={group.avatar}
                  onClick={() => navigate(`/group/${group.id}`)}
                />
              ))
            ) : (
              <div className="text-center col-span-full text-gray-500 text-lg font-medium mt-10">
                No groups match your search.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
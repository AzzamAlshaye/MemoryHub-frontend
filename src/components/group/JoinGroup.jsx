import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { groupService } from "../../service/groupService";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// parse “/group/:id?token=…” links
const parseInvite = (url) => {
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/");
    const id = segments[2] || null;
    const token = u.searchParams.get("token");
    return { id, token };
  } catch {
    return { id: null, token: null };
  }
};

export default function JoinGroup({ onJoined }) {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteLink.trim()) {
      toast.error("Please enter a valid invitation link");
      return;
    }
    const { id, token } = parseInvite(inviteLink.trim());
    if (!id || !token) {
      Swal.fire(
        "Invalid link",
        "Please paste a full invitation link including ?token=…",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const joinedGroup = await groupService.join(id, token);
      toast.success("Joined group successfully!");
      onJoined?.(joinedGroup);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to join the group"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto text-center"
    >
      {/* Close button */}
      <FaTimes
        size={20}
        className="absolute top-4 right-4 cursor-pointer text-main-theme hover:opacity-80"
        onClick={() => Swal.close()}
      />

      <motion.h1
        variants={itemVariants}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Join a Group
      </motion.h1>

      <motion.label
        variants={itemVariants}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Invitation Link
      </motion.label>
      <motion.input
        variants={itemVariants}
        type="text"
        value={inviteLink}
        onChange={(e) => setInviteLink(e.target.value)}
        placeholder="Paste invitation link here"
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        disabled={loading}
      />

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {loading ? "Joining…" : "Join"}
        </button>
        <button
          onClick={() => Swal.close()}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}

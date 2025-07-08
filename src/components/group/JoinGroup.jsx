// src/components/group/JoinGroup.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { groupService } from "../../service/groupService";

const MySwal = withReactContent(Swal);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Utility to parse invite link and extract group ID and token
const parseInvite = (url) => {
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/");
    const id = segments[2] || null; // expects "/group/:id"
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
      MySwal.fire(
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
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to join the group";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    MySwal.close();
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-md p-8 rounded-2xl text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Join a Group
      </motion.h1>

      <motion.label
        variants={itemVariants}
        className="block text-sm font-medium text-gray-700 mb-2 text-center"
      >
        Invitation Link
      </motion.label>
      <motion.input
        variants={itemVariants}
        type="text"
        value={inviteLink}
        onChange={(e) => setInviteLink(e.target.value)}
        placeholder="Paste invitation link here"
        className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-lg bg-gray-50 placeholder-gray-400 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
      />

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg text-sm font-semibold shadow-lg transition disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join"}
        </button>
        <button
          onClick={handleCancel}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg text-sm font-semibold transition"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}

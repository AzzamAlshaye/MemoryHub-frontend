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

export default function JoinGroup() {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteLink.trim()) {
      toast.error("Please enter a valid invitation link");
      return;
    }
    setLoading(true);
    try {
      await groupService.join(inviteLink.trim());
      toast.success("Joined the group successfully!");
      MySwal.close();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to join the group");
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
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
    >
      <motion.h1
        variants={itemVariants}
        className="text-2xl font-bold text-gray-800 text-center mb-6"
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
      />

      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
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

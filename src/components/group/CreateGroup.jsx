import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { groupService } from "../../service/groupService";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function CreateGroup({ onCreated }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a group title.");
      return;
    }

    setLoading(true);
    try {
      const newGroup = await groupService.create({ name: title, description });
      if (file) await groupService.uploadAvatar(newGroup.id, file);
      alert("Group created successfully!");
      onCreated?.(newGroup);
    } catch (err) {
      console.error(err);
      alert("Failed to create the group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-white rounded-3xl p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto"
    >
      {/* Close button */}
      <FaTimes
        size={20}
        className="absolute top-4 right-4 cursor-pointer text-main-theme hover:opacity-80"
        onClick={() => Swal.close()}
      />

      <motion.h2
        variants={itemVariants}
        className="text-2xl font-semibold text-gray-900 text-center mb-5"
      >
        Create New Group
      </motion.h2>

      <motion.div
        variants={itemVariants}
        onClick={() => fileInputRef.current.click()}
        className="w-24 h-24 mx-auto mb-3 sm:mb-5 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <FaCamera size={24} className="text-amber-500" />
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="text-center text-sm text-gray-500 mb-6"
      >
        Click to upload a group image
      </motion.p>

      <motion.div variants={itemVariants} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring focus:ring-amber-300 transition"
          disabled={loading}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm h-28 resize-none focus:outline-none focus:ring focus:ring-amber-300 transition"
          disabled={loading}
        />
      </motion.div>

      <motion.button
        variants={itemVariants}
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white font-semibold rounded-full transition-colors ${
          loading
            ? "bg-amber-300 cursor-not-allowed"
            : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {loading ? "Creating…" : "Create Group"}
      </motion.button>
    </motion.form>
  );
}

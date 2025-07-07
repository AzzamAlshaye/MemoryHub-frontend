// src/components/CreateGroup.jsx
import React, { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { groupService } from "../../service/groupService";

export default function CreateGroup() {
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
      alert("Please enter a group title");
      return;
    }

    setLoading(true);
    try {
      // 1) Create the group (name & description)
      const newGroup = await groupService.create({
        name: title,
        description,
      });

      // 2) If an image was selected, upload it
      if (file) {
        await groupService.uploadAvatar(newGroup.id, file);
      }

      // 3) Reset form / notify success
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      alert("Group created successfully!");
    } catch (err) {
      console.error("Failed to create group:", err);
      alert("There was an error creating your group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg p-6 w-full max-w-md mx-auto bg-white"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Create New Group
      </h2>

      <div
        className="w-28 h-28 mx-auto mb-4 rounded-2xl flex items-center justify-center cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-full"
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
      </div>

      <p className="text-center text-sm text-gray-500 mb-6">
        Tap the circle to upload a group image
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Group Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Enter group title"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
          placeholder="Enter group description"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${
          loading ? "bg-amber-300" : "bg-amber-500 hover:bg-amber-600"
        } text-white text-sm font-semibold py-2 rounded-lg transition`}
      >
        {loading ? "Creating…" : "Create Group"}
      </button>
    </form>
  );
}

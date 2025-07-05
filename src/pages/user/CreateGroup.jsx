import React, { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa";

function CreateGroup() {
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-lg p-6 w-full max-w-md mx-auto bg-white">
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
            className="w-full h-full object-cover rounded-full"
            alt="Preview"
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

      <button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold py-2 rounded-lg transition">
        Create Group
      </button>
    </div>
  );
}

export default CreateGroup;

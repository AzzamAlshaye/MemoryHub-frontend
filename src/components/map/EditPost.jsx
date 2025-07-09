// src/pages/user/EditPost.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  FaCloudUploadAlt,
  FaMapPin,
  FaTrash,
  FaLock,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";
import { pinService } from "../../service/pinService";

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [groupId, setGroupId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Media state
  const [existingImages, setExistingImages] = useState([]); // URLs
  const [newImages, setNewImages] = useState([]); // File[]
  const [videoFile, setVideoFile] = useState(null); // File|null

  // 1) Load the pin
  useEffect(() => {
    pinService
      .get(postId)
      .then((pin) => {
        setTitle(pin.title);
        setDescription(pin.description || "");
        setPrivacy(pin.privacy);
        setGroupId(pin.groupId?._id || "");
        setLatitude(pin.location.lat.toString());
        setLongitude(pin.location.lng.toString());
        setExistingImages(pin.media.images || []);
      })
      .catch(() => {
        toast.error("Memory not found");
        navigate(-1);
      });
  }, [postId, navigate]);

  // 2) Handlers
  const handleAddImages = (e) => {
    setNewImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };
  const handleAddVideo = (e) => {
    setVideoFile(e.target.files[0]);
  };
  const removeExistingImage = (idx) => {
    setExistingImages((imgs) => imgs.filter((_, i) => i !== idx));
  };

  // 3) Save via updateWithMedia
  const saveEdit = async () => {
    if (!title.trim()) {
      toast.warning("Title is required");
      return;
    }

    // Build the fields payload
    const fields = {
      title,
      description,
      privacy,
      latitude,
      longitude,
      ...(privacy === "group" ? { groupId } : {}),
    };

    try {
      await pinService.updateWithMedia(postId, fields, newImages, videoFile);
      Swal.fire({
        icon: "success",
        title: "Memory updated!",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
        >
          ×
        </button>
        <ToastContainer position="top-center" autoClose={3000} />

        <h2 className="text-2xl font-bold text-center mb-4">Edit Memory</h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block font-semibold">
            Title<span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-24"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Location */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Latitude</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold">Longitude</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Privacy</label>
          <div className="flex gap-3">
            {[
              { label: "Private", value: "private", icon: <FaLock /> },
              { label: "Public", value: "public", icon: <FaGlobe /> },
              { label: "Group", value: "group", icon: <FaUsers /> },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-1 border px-3 py-2 rounded cursor-pointer ${
                  privacy === opt.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value={opt.value}
                  checked={privacy === opt.value}
                  onChange={() => setPrivacy(opt.value)}
                  className="hidden"
                />
                {opt.icon}
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Group ID if needed */}
        {privacy === "group" && (
          <div className="mb-4">
            <label className="block font-semibold">Group ID</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
          </div>
        )}

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Current Images</h4>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`img-${i}`}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Media */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Add Images & Video</label>
          <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center">
            <FaCloudUploadAlt className="text-2xl mx-auto mb-2" />
            <p className="text-gray-600">Drag & drop or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
              className="hidden"
              id="newImages"
            />
            <label
              htmlFor="newImages"
              className="mt-2 inline-block text-blue-600 cursor-pointer"
            >
              Browse Images…
            </label>
            <div className="mt-3">
              <input
                type="file"
                accept="video/*"
                onChange={handleAddVideo}
                className="block mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="text-center">
          <button
            onClick={saveEdit}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
          >
            <FaMapPin /> Update Memory
          </button>
        </div>
      </div>
    </div>
  );
}

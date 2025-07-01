import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaMapPin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function CreatePost({ onSubmit }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleMediaUpload = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Title",
        text: "Please enter a title for your memory!",
      });
    }

    onSubmit({ title, description, selectedPrivacy, mediaFiles });
    Swal.fire({
      icon: "success",
      title: "Memory Pinned!",
      text: "Your memory has been successfully pinned.",
    });

    setTitle("");
    setDescription("");
    setSelectedPrivacy("");
    setMediaFiles([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Pin a New Memory</h2>
        <p className="text-gray-500 mt-1">
          Share your special moment with the world
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your memory a title"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your memory details..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-y focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Media
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
            <FaCloudUploadAlt className="mx-auto text-4xl text-blue-400 mb-3" />
            <p className="text-gray-500 mb-2">Drag & drop or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              id="mediaUpload"
            />
            <label
              htmlFor="mediaUpload"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
            >
              Choose Files
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Privacy
          </label>
          <div className="flex flex-wrap gap-4">
            {["Private", "Public", "Group"].map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="privacy"
                  value={opt}
                  checked={selectedPrivacy === opt}
                  onChange={() => setSelectedPrivacy(opt)}
                  className="h-5 w-5 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        {(title || description || mediaFiles.length > 0) && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-3">Preview</h3>

            {/* Media Thumbnails */}
            {mediaFiles.length > 0 && (
              <div
                className="
                  grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4
                  overflow-auto scrollbar-hide
                "
                style={{ maxHeight: 200 }}
              >
                {mediaFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={idx}
                      className="w-full aspect-square rounded-lg overflow-hidden border"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={url}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <video controls className="object-cover w-full h-full">
                          <source src={url} type={file.type} />
                        </video>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Details */}
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <FaLocationDot className="text-blue-400" />
              <span>Location auto-filled</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
            {description && <p className="text-gray-700">{description}</p>}
            {selectedPrivacy && (
              <span className="inline-block mt-3 text-xs font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {selectedPrivacy}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
        >
          <FaMapPin className="text-lg" />
          Pin Memory
        </button>
      </div>
    </div>
  );
}

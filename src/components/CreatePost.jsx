import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaMapPin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

/**
 * Props:
 * - onSubmit: function({ title, description, selectedPrivacy, mediaFiles })
 */
export default function CreatePost({ onSubmit }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
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
    <div className="w-full p-4">
      <div className="max-h-[70vh] overflow-y-auto space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your memory a title"
            className="w-full text-sm border rounded px-3 py-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Share your memory details..."
            className="w-full text-sm border rounded px-3 py-2 h-24 resize-y focus:ring-blue-300 focus:outline-none"
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Upload Media
          </label>
          <div className="border border-dashed rounded p-3 text-center">
            <FaCloudUploadAlt className="mx-auto text-xl mb-1 text-blue-400" />
            <p className="text-xs text-gray-500">
              Drag &amp; drop or click to browse
            </p>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="mt-2 text-xs cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy */}
        <div>
          <label className="block text-sm font-semibold mb-1">Privacy</label>
          <div className="flex gap-4">
            {["Private", "Public", "Community"].map((opt) => (
              <label key={opt} className="flex items-center text-sm">
                <input
                  type="radio"
                  name="privacy"
                  value={opt}
                  checked={selectedPrivacy === opt}
                  onChange={() => setSelectedPrivacy(opt)}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Preview */}
        {(title || description || mediaFiles.length > 0) && (
          <div className="border rounded p-2 bg-gray-50">
            {mediaFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {mediaFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={idx}
                      className="w-20 h-20 overflow-hidden rounded border"
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

            <div className="flex items-center gap-2 mb-1">
              <div className="text-blue-400">
                <FaLocationDot />
              </div>
              <p className="text-xs text-gray-600">Location auto-filled</p>
            </div>

            <h3 className="text-sm font-semibold">{title}</h3>
            {description && (
              <p className="text-xs text-gray-600">{description}</p>
            )}

            {selectedPrivacy && (
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded">
                {selectedPrivacy}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-4 text-right">
        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:outline-none"
        >
          <FaMapPin /> Pin Memory
        </button>
      </div>
    </div>
  );
}

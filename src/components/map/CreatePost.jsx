import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaMapPin } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaTrash, FaLock, FaGlobe, FaUsers, FaArrowRight } from "react-icons/fa";

export default function CreatePost({ onSubmit }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1); // Step 1: form, Step 2: preview

  const handleMediaUpload = (e) => {
    setMediaFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleNext = () => {
    if (!title.trim()) {
      toast.warning("Please enter a title for your memory!");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    onSubmit({ title, description, selectedPrivacy, mediaFiles });
    Swal.fire({
      icon: "success",
      title: "Memory Pinned!",
      text: "Your memory has been successfully pinned.",
      timer: 2000,
      showConfirmButton: false,
    });
    setTitle("");
    setDescription("");
    setSelectedPrivacy("");
    setMediaFiles([]);
    setStep(1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* === Step 1: Form === */}
      {step === 1 && (
        <>
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Pin a New Memory</h2>
            <p className="text-gray-500 mt-1">Share your special moment with the world</p>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title
                  <span className="text-red-500 mr-1"> *</span>
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
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your memory details..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-y focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
              />
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Upload Media</label>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition relative">
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
                  className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200 transition font-medium"
                >
                  Browse Files
                </label>
              </div>

              {/* Uploaded Files Preview */}
              {mediaFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {mediaFiles.map((file, index) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div key={index} className="relative group rounded-lg overflow-hidden border">
                          {file.type.startsWith("image/") ? (
                            <img src={url} alt={`media-${index}`} className="object-cover w-full h-24" />
                          ) : (
                            <video className="object-cover w-full h-24">
                              <source src={url} type={file.type} />
                            </video>
                          )}
                          <button
                            onClick={() =>
                              setMediaFiles((prev) => prev.filter((_, i) => i !== index))
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Privacy Settings</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Private", value: "Private", icon: <FaLock /> },
                  { label: "Public", value: "Public", icon: <FaGlobe /> },
                  { label: "Group", value: "Group", icon: <FaUsers /> },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 border px-4 py-2 rounded-xl shadow-sm cursor-pointer ${
                      selectedPrivacy === opt.value ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={opt.value}
                      checked={selectedPrivacy === opt.value}
                      onChange={() => setSelectedPrivacy(opt.value)}
                      className="hidden"
                    />
                    {opt.icon}
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
              >
                Next <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* === Step 2: Preview === */}
      {step === 2 && (
        <>
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Preview Your Memory</h2>
            <p className="text-gray-500 mt-1">Review before submitting</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm space-y-4">
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-auto scrollbar-hide" style={{ maxHeight: 200 }}>
                {mediaFiles.map((file, idx) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div
                      key={idx}
                      className="w-full aspect-square rounded-lg overflow-hidden border transition hover:scale-105 duration-200"
                    >
                      {file.type.startsWith("image/") ? (
                        <img src={url} alt={file.name} className="object-cover w-full h-full" />
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

            <div className="flex items-center gap-2 text-gray-600">
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

          {/* Back + Submit Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
            >
              <FaMapPin className="text-lg" />
              Pin Memory
            </button>
          </div>
        </>
      )}
    </div>
  );
}

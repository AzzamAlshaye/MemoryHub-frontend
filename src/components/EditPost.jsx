import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FaCloudUploadAlt, FaMapPin, FaTrash, FaLock, FaGlobe, FaUsers } from "react-icons/fa";
import { useParams, useNavigate } from "react-router";

export default function EditPost({ getPostById, onUpdate }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // useEffect(() => {
  //   const post = getPostById(postId);
  //   if (post) {
  //     setTitle(post.title);
  //     setDescription(post.description);
  //     setSelectedPrivacy(post.selectedPrivacy);
  //     setMediaFiles(post.mediaFiles || []);
  //   } else {
  //     toast.error("Post not found");
  //     navigate(-1);
  //   }
  // }, [postId]);

  // only for testing (localStorage):
  useEffect(() => {
    const saved = localStorage.getItem("editMemory");
    const post = saved ? JSON.parse(saved) : null;

    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setSelectedPrivacy(post.visibility || "Public");
      setMediaFiles(post.mediaFiles || []);
    } else {
      toast.error("Post not found");
      navigate(-1);
    }
  }, []);

  const handleMediaUpload = (e) => {
    setMediaFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleUpdate = () => {
    if (!title.trim()) {
      toast.warning("Title is required!");
      return;
    }

    onUpdate(postId, { title, description, selectedPrivacy, mediaFiles });

    Swal.fire({
      icon: "success",
      title: "Post Updated!",
      text: "Your memory has been updated successfully.",
      timer: 2000,
      showConfirmButton: false,
    });

    localStorage.removeItem("editMemory");
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
        >
          ×
        </button>

        <ToastContainer position="top-center" autoClose={3000} />

        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Memory</h2>
          <p className="text-gray-500 mt-1">Modify your shared moment</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Edit title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Edit memory details..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-y focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            />
          </div>

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

            {mediaFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Files</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mediaFiles.map((file, index) => {
                    const url = typeof file === "string" ? file : URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative group rounded-lg overflow-hidden border">
                        {file.type?.startsWith("image/") || file.includes(".jpg") || file.includes(".png") ? (
                          <img src={url} alt={`media-${index}`} className="object-cover w-full h-24" />
                        ) : (
                          <video className="object-cover w-full h-24">
                            <source src={url} type={file.type || "video/mp4"} />
                          </video>
                        )}
                        <button
                          onClick={() => setMediaFiles((prev) => prev.filter((_, i) => i !== index))}
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

          <div className="mt-8 text-center">
            <button
              onClick={handleUpdate}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
            >
              <FaMapPin className="text-lg" /> Update Memory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

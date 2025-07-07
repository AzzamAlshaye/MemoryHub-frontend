// src/components/CreatePost.jsx

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaTrash,
  FaLock,
  FaGlobe,
  FaUsers,
  FaArrowRight,
  FaMapPin,
} from "react-icons/fa";
import { groupService } from "../../service/groupService";

export default function CreatePost({ onSubmit, onCancel, initialLocation }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedPrivacy, setSelectedPrivacy] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // Fetch user's groups (API returns { id, name, … })
  useEffect(() => {
    groupService
      .list()
      .then((apiGroups) => {
        console.log("groups from API:", apiGroups);
        setGroups(apiGroups);
      })
      .catch((err) => {
        console.error("Failed to load groups:", err);
        toast.error("Failed to load groups");
      });
  }, []);

  const handleMediaUpload = (e) =>
    setMediaFiles((prev) => [...prev, ...Array.from(e.target.files)]);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const validateStep1 = () => {
    if (!title.trim()) {
      toast.warning("Please enter a title for your memory!");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!selectedPrivacy) {
      toast.warning("Please choose a privacy setting!");
      return false;
    }
    if (selectedPrivacy === "group" && !selectedGroupId) {
      toast.warning("Please select one of your groups!");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const { lat, lng } = initialLocation;
    const payload = {
      title,
      description,
      privacy: selectedPrivacy,
      latitude: lat,
      longitude: lng,
      ...(selectedPrivacy === "group" && selectedGroupId
        ? { groupId: selectedGroupId }
        : {}),
    };

    console.group("CreatePost ▶ payload");
    console.log(payload);
    console.groupEnd();

    const form = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null) form.append(k, String(v));
    });
    mediaFiles.forEach((file) => form.append("images", file));

    onSubmit(form);
  };

  // Preview Group Name
  const groupName =
    selectedPrivacy === "group"
      ? groups.find((g) => g.id === selectedGroupId)?.name || "(none)"
      : null;

  return (
    <div className="relative w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {step === 1
            ? "Step 1 of 3: Title & Description"
            : step === 2
            ? "Step 2 of 3: Media & Privacy"
            : "Step 3 of 3: Preview"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-800"
            title="Cancel"
          >
            ✕
          </button>
        )}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your memory details..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 resize-y focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
          <div className="text-center">
            <button
              onClick={() => validateStep1() && next()}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Media Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Upload Media
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition relative">
              <FaCloudUploadAlt className="mx-auto text-4xl text-blue-400 mb-2" />
              <p className="text-gray-500 mb-2">
                Drag & drop or click to browse
              </p>
              <input
                id="mediaUpload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <label
                htmlFor="mediaUpload"
                className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Browse Files
              </label>
            </div>
            {mediaFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-gray-700 font-semibold mb-2">
                  Uploaded Files
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaFiles.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden border group relative"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={url}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <video
                            controls
                            className="object-cover w-full h-full"
                          >
                            <source src={url} type={file.type} />
                          </video>
                        )}
                        <button
                          onClick={() =>
                            setMediaFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <FaTrash size={12} />
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
            <label className="block text-gray-700 font-semibold mb-1">
              Privacy Settings <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Private", value: "private", icon: <FaLock /> },
                { label: "Public", value: "public", icon: <FaGlobe /> },
                { label: "Group", value: "group", icon: <FaUsers /> },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer ${
                    selectedPrivacy === opt.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="privacy"
                    value={opt.value}
                    checked={selectedPrivacy === opt.value}
                    onChange={() => {
                      setSelectedPrivacy(opt.value);
                      if (opt.value !== "group") setSelectedGroupId("");
                    }}
                    className="hidden"
                  />
                  {opt.icon}
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Group selector */}
          {selectedPrivacy === "group" && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Select Group <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              >
                <option value="">-- choose your group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={back} className="px-4 py-2 bg-gray-200 rounded-lg">
              Back
            </button>
            <button
              onClick={() => validateStep2() && next()}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {mediaFiles.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="aspect-square rounded-lg overflow-hidden border"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={url}
                      alt=""
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

          <h4 className="text-lg font-semibold">{title}</h4>
          {description && <p>{description}</p>}

          {selectedPrivacy && (
            <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
              {selectedPrivacy !== "group"
                ? selectedPrivacy
                : `Group: ${groupName}`}
            </span>
          )}

          <div className="flex justify-between pt-4">
            <button onClick={back} className="px-4 py-2 bg-gray-200 rounded-lg">
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              <FaMapPin /> Pin Memory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

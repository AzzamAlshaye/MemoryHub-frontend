// src/pages/user/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaCamera,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userService } from "../../service/userService";
import { pinService } from "../../service/pinService";
import ViewPin from "../../components/map/ViewPin.jsx";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [memories, setMemories] = useState([]);
  const fileInputRef = useRef(null);

  const [editingPin, setEditingPin] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    privacy: "",
  });
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

  // fetch user + pins
  useEffect(() => {
    let currentUserId = null;
    userService
      .getCurrentUser()
      .then((u) => {
        setUser(u);
        setName(u.name || "");
        setEmail(u.email || "");
        currentUserId = u.id || u._id;
        return pinService.listMyPins();
      })
      .then((pins) => {
        if (Array.isArray(pins)) {
          setMemories(pins);
          const stored = localStorage.getItem("newPin");
          if (stored) {
            const newPin = JSON.parse(stored);
            if (String(newPin.owner?._id || newPin.owner) === currentUserId) {
              setMemories((prev) => [...prev, newPin]);
            }
            localStorage.removeItem("newPin");
          }
        } else {
          console.error("Expected array of pins, got", pins);
        }
      })
      .catch((err) => console.error("Error fetching user or pins:", err));
  }, []);

  // fetch a single pin for viewing
  useEffect(() => {
    if (!selectedPinId) {
      setSelectedPin(null);
      return;
    }
    pinService
      .get(selectedPinId)
      .then(setSelectedPin)
      .catch((err) => console.error("Error fetching pin:", err));
  }, [selectedPinId]);

  const handleSaveProfile = () => {
    const data = { name, email };
    if (password.trim()) data.password = password;
    userService
      .updateSelf(data)
      .then((res) => {
        setUser(res);
        setPassword("");
        toast.success("Profile updated successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating profile");
      });
  };

  // trigger file selector when clicking avatar area
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // preview locally & upload to /users/me/avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // immediate preview
    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);

    // upload to self-avatar endpoint
    try {
      const updatedUser = await userService.uploadSelfAvatar(file);
      setUser(updatedUser);
      toast.success("Avatar updated successfully");
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Failed to update avatar");
    }
  };

  const openEdit = (pin) => {
    setEditingPin(pin);
    setEditForm({
      title: pin.title,
      description: pin.description,
      privacy: pin.privacy,
    });
  };

  const saveEdit = () => {
    pinService
      .update(editingPin._id || editingPin.id, editForm)
      .then((updated) => {
        setMemories((m) =>
          m.map((p) =>
            p._id === updated._id || p.id === updated.id ? updated : p
          )
        );
        setEditingPin(null);
        toast.success("Memory updated");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating memory");
      });
  };

  const handleDeletePin = (id) => {
    if (!window.confirm("Delete this memory?")) return;
    pinService
      .remove(id)
      .then(() => {
        setMemories((prev) => prev.filter((p) => p._id !== id && p.id !== id));
        toast.success("Memory deleted");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error deleting memory");
      });
  };

  return (
    <div className="min-h-screen bg-[#FEFCFB] px-4 sm:px-8 py-8">
      <ToastContainer position="top-center" />
      <motion.main
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Profile Header */}
        <motion.section
          variants={item}
          className="bg-white backdrop-blur-sm bg-opacity-80 rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            <div
              className="relative cursor-pointer flex-shrink-0"
              onClick={triggerFileSelect}
            >
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-amber-300 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full shadow-lg">
                <FaCamera className="text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user?.name}
              </h2>
              <p className="text-gray-600 mt-1">
                <FaEnvelope className="inline mr-1" /> {user?.email}
              </p>
            </div>
            <button
              onClick={handleSaveProfile}
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md transition"
            >
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </motion.div>
            <motion.div variants={item} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.div
              variants={item}
              className="space-y-1 relative md:col-span-2"
            >
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-300 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Memories Grid */}
        <motion.section variants={item}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            My Memories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.length === 0 && (
              <p className="text-gray-500">No memories to display.</p>
            )}
            {memories.map((m, i) => {
              const images = m.media?.images || [];
              const firstImage = images[0] || null;
              const video = m.media?.video;
              const videoSrc =
                video?.trim() ||
                (firstImage?.includes(".mp4") ? firstImage : null);
              const isVideo = !!videoSrc;

              return (
                <motion.div
                  key={m._id || m.id || i}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                >
                  {isVideo ? (
                    <video
                      src={videoSrc}
                      controls
                      className="w-full h-48 object-cover"
                    />
                  ) : firstImage ? (
                    <img
                      src={firstImage}
                      alt={m.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src="/default-image.png"
                      alt="default"
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-4 space-y-2">
                    <h4 className="font-bold text-gray-900">{m.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {m.description}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className="
                      absolute top-4 right-4 flex gap-2
                      opacity-100
                      lg:opacity-0
                      lg:group-hover:opacity-100
                      transition
                    "
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(m);
                      }}
                      className="p-2 bg-white rounded-full shadow"
                    >
                      <FaEdit className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePin(m._id || m.id);
                      }}
                      className="p-2 bg-white rounded-full shadow"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPinId(m._id || m.id);
                      }}
                      className="p-2 bg-white rounded-full shadow"
                    >
                      <FaEye className="text-blue-500" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Edit Modal */}
        {editingPin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-11/12 max-w-lg"
            >
              <h4 className="text-lg font-semibold mb-4">Edit Memory</h4>
              <div className="space-y-4">
                <motion.input
                  variants={item}
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-amber-300"
                  placeholder="Title"
                />
                <motion.textarea
                  variants={item}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-amber-300 h-32"
                  placeholder="Description"
                />
                <motion.select
                  variants={item}
                  value={editForm.privacy}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, privacy: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-amber-300"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </motion.select>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={() => setEditingPin(null)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-500 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* View Pin Modal */}
        {selectedPin && (
          <ViewPin
            pinId={selectedPinId}
            onClose={() => setSelectedPinId(null)}
            pin={selectedPin}
          />
        )}
      </motion.main>
    </div>
  );
}

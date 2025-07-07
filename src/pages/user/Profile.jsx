// src/pages/user/Profile.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaCamera,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { userService } from "../../service/userService";
import { pinService } from "../../service/pinService";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [memories, setMemories] = useState([]);
  const [editingPin, setEditingPin] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", privacy: "" });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    let userId;
    userService.getCurrentUser().then((u) => {
      setUser(u);
      setName(u.name);
      setEmail(u.email);
      userId = u.id;
      pinService.list("", "").then((pins) => {
        setMemories(pins.filter((p) => String(p.owner?._id || p.owner) === String(userId)));
      });
    });
  }, []);

  const handleSaveProfile = () => {
    const update = { name, email };
    if (password) update.password = password;
    userService.updateSelf(update).then((u) => {
      setUser(u);
      setPassword("");
      alert("Profile updated!");
    });
  };

  const handleAvatar = (e) => {
    const f = e.target.files[0];
    if (f) {
      setAvatarFile(f);
      const reader = new FileReader();
      reader.onload = () => setUser((prev) => ({ ...prev, avatar: reader.result }));
      reader.readAsDataURL(f);
    }
  };

  const openEdit = (pin) => {
    setEditingPin(pin);
    setEditForm({ title: pin.title, description: pin.description, privacy: pin.privacy });
  };
  const saveEdit = () => {
    pinService.update(editingPin.id, editForm).then((updated) => {
      setMemories((m) => m.map((p) => (p.id === updated.id ? updated : p)));
      setEditingPin(null);
    });
  };
  const deletePin = (id) => {
    if (confirm("Delete this memory?")) {
      pinService.remove(id).then(() => setMemories((m) => m.filter((p) => p.id !== id)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white p-8">
      <motion.main
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-12"
      >
        {/* Profile Header */}
        <motion.section variants={item} className="bg-white backdrop-blur-sm bg-opacity-80 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-24 h-24 rounded-full border-4 border-amber-300 object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-amber-500 p-2 rounded-full shadow-lg cursor-pointer">
                <FaCamera className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600"><FaEnvelope className="inline mr-1" /> {user.email}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={item} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </motion.div>
            <motion.div variants={item} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            <motion.div variants={item} className="space-y-1 relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
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
            <motion.div variants={item} className="flex items-end">
              <button
                onClick={handleSaveProfile}
                className="ml-auto bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg shadow-md transition"
              >
                Save Changes
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Memories Grid */}
        <motion.section variants={item}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">My Memories</h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.map((m, i) => (
              <motion.div
                key={m.id || i}
                variants={item}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group relative"
              >
                <img src={m.image} alt={m.title} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-gray-900">{m.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2">{m.description}</p>
                  <p className="text-gray-400 text-xs">{new Date(m.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition flex gap-2">
                  <button onClick={() => openEdit(m)} className="p-2 bg-white rounded-full shadow">
                    <FaEdit className="text-gray-700" />
                  </button>
                  <button onClick={() => deletePin(m.id)} className="p-2 bg-white rounded-full shadow">
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
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
              className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-lg"
            >
              <h4 className="text-lg font-semibold mb-4">Edit Memory</h4>
              <div className="space-y-4">
                <motion.input
                  variants={item}
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-amber-300"
                  placeholder="Title"
                />
                <motion.textarea
                  variants={item}
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-amber-300 h-32"
                  placeholder="Description"
                />
                <motion.select
                  variants={item}
                  value={editForm.privacy}
                  onChange={(e) => setEditForm((f) => ({ ...f, privacy: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-amber-300"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </motion.select>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setEditingPin(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button onClick={saveEdit} className="px-4 py-2 bg-amber-500 text-white rounded-lg">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

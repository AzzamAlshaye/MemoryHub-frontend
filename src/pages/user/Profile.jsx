
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
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [memories, setMemories] = useState([]);


  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

useEffect(() => {
  let currentUserId = null;
  userService.getCurrentUser()
    .then((data) => {
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
      currentUserId = data._id || data.id;

      return pinService.listMyPins(); 
    })
    .then((pins) => {
      console.log("My Pins fetched from /pins/me:", pins);
      if (!Array.isArray(pins)) {
        console.error("Response is not an array:", pins);
        return;
      }

      setMemories(pins);

      const stored = localStorage.getItem("newPin");
      if (stored) {
        const newPin = JSON.parse(stored);
        if (String(newPin.owner?._id || newPin.owner) === currentUserId) {
          setMemories((prev) => [...prev, newPin]);
        }
        localStorage.removeItem("newPin");
      }
    })
    .catch((err) => console.error("Error in fetching user pins:", err));
}, []);


  const handleSave = () => {
    const data = { name, email };
    if (password.trim()) data.password = password;

    userService.updateSelf(data)
      .then(res => {
        setUser(res);
        setPassword("");
        toast.success("Profile updated successfully");
      })
      .catch(err => {
        console.error(err);
        toast.error("Error updating profile");
      });
  };

  const handleDeletePin = id => {
    if (!window.confirm("Delete this memory?")) return;

    pinService.remove(id)
      .then(() => {
        setMemories(prev => prev.filter(p => p._id !== id));
        toast.success("Memory deleted");
      })
      .catch(err => {
        console.error(err);
        toast.error("Error deleting memory");
      });
  };

  const handleEditPin = pin => {
    setSelectedPinId(pin._id);
  };

  useEffect(() => {
    if (!selectedPinId) return setSelectedPin(null);
    pinService.get(selectedPinId)
      .then(setSelectedPin)
      .catch(console.error);
  }, [selectedPinId]);

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUser(prev => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <ToastContainer position="top-center" />
      <main className="flex-1 p-8">

        <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={user?.avatar || "https://randomuser.me/api/portraits/women/45.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"

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
        </section>
{/* memories setions */}
        <section className="flex-1 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">My Memories</h3>
  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.length === 0 && (
              <p className="text-gray-500">No memories to display.</p>
            )}
            {Array.isArray(memories) && memories.map(memory => (
              <div key={memory._id}
                onClick={() => handleEditPin(memory)}
                className="group bg-white rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition cursor-pointer">
                <div className="relative">
                  {(memory.video || memory.image?.startsWith("data:video")) ? (
                    <video src={memory.video || memory.image} controls className="w-full h-48 object-cover" />
                  ) : (
                    <img src={memory.image} alt={memory.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); handleEditPin(memory); }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDeletePin(memory._id); }}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                  <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {memory.privacy}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{memory.title}</h4>
                  {memory.location?.lat && memory.location?.lng && (
                    <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
                      {`${memory.location.lat.toFixed(4)}, ${memory.location.lng.toFixed(4)}`}
                    </p>
                  )}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{memory.description}</p>
                  <p className="text-gray-400 text-xs">
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </p>
                </div>
          </div>
))}
          </div>
        </section>

        {selectedPin && (
          <ViewPin pinId={selectedPinId} onClose={() => setSelectedPinId(null)} />
        )}
      </main>

    </div>
  );
}

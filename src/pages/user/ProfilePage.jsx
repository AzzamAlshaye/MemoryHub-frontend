import React, { useEffect, useState } from "react";
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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editingPin, setEditingPin] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    privacy: "",
  });
  const [memories, setMemories] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);

  // هذا احتياط لحد يحذفه
  // useEffect(() => {
  //   userService.getCurrentUser().then((data) => {
  //     setUser(data);
  //     setName(data.name || "");
  //     setEmail(data.email || "");
  //   });

  //   pinService.list().then((data) => {
  //     setMemories(data || []);
  //   });
  // }, []);
  useEffect(() => {
    let currentUserId = null;

    userService
      .getCurrentUser()
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        currentUserId = data.id;

        pinService
          .list("", "")
          .then((pins) => {
            const filteredPins = (pins || []).filter(
              (pin) =>
                String(pin.owner?._id || pin.owner) === String(currentUserId)
            );
            setMemories(filteredPins);

            const storedNewPin = localStorage.getItem("newPin");
            if (storedNewPin) {
              const newPin = JSON.parse(storedNewPin);
              if (
                String(newPin.owner?._id || newPin.owner) ===
                String(currentUserId)
              ) {
                setMemories((prev) => [...prev, newPin]);
              }
              localStorage.removeItem("newPin");
            }
          })
          .catch((err) => console.error("Failed to fetch memories", err));
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  useEffect(() => {
    let currentUserId = null;

    userService
      .getCurrentUser()
      .then((data) => {
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        currentUserId = data.id;

        pinService
          .list()
          .then((pins) => {
            const filteredPins = (pins || []).filter(
              (pin) => pin.userId === currentUserId
            );
            setMemories(filteredPins);
          })
          .catch((err) => console.error("Failed to fetch memories", err));
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  const handleSave = () => {
    const updateData = { name, email };
    if (password.trim()) {
      updateData.password = password;
    }

    userService
      .updateSelf(updateData)
      .then((res) => {
        setUser(res);
        setPassword("");
        alert("Profile updated successfully.");
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Error updating profile.");
      });
  };

  const handleDeletePin = (pinId) => {
    if (window.confirm("Are you sure you want to delete this pin?")) {
      pinService
        .remove(pinId)
        .then(() => {
          setMemories((prev) => prev.filter((pin) => pin.id !== pinId));
          alert("Pin deleted successfully.");
        })
        .catch((err) => {
          console.error("Failed to delete pin", err);
          alert("Error deleting pin.");
        });
    }
  };

  const handleEditPin = (pin) => {
    setEditingPin(pin);
    setEditForm({
      title: pin.title,
      description: pin.description,
      privacy: pin.privacy,
    });
  };

  const handleSaveEdit = () => {
    pinService
      .update(editingPin.id, editForm)
      .then((updated) => {
        setMemories((prev) =>
          prev.map((pin) => (pin.id === updated.id ? updated : pin))
        );
        setEditingPin(null);
        alert("Pin updated successfully.");
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Error updating pin.");
      });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // will update
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-8 flex flex-col">
        {/* profile */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={
                  user?.avatar ||
                  "https://randomuser.me/api/portraits/women/45.jpg"
                }
                className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"
                alt="Profile"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white shadow-lg cursor-pointer">
                <FaCamera className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user?.name || "Loading..."}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleSave}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow transition"
            >
              Save Changes
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col relative">
              <label className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[38px] right-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </section>

        {/* Memories Section */}
        <section className="flex-1 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            My Memories
          </h3>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {memories.length === 0 && (
              <p className="text-gray-500">No memories to display.</p>
            )}
            {memories.map((memory, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition"
              >
                <div className="relative">
                  <img
                    src={memory.image}
                    alt={memory.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEditPin(memory)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <FaEdit className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeletePin(memory.id)}
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                    >
                      <FaTrash className="text-red-500" />
                    </button>
                  </div>
                  <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {memory.privacy}
                  </span>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {memory.title}
                  </h4>
                  <p className="text-gray-500 text-xs mb-1 uppercase tracking-wide">
                    {JSON.stringify(memory.location)}
                  </p>
                  <p className="text-gray-400 text-xs">{memory.date}</p>
                </div>
              </div>
            ))}
          </div>
          {/* edit pins */}
          {editingPin && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit Memory</h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <select
                  value={editForm.privacy}
                  onChange={(e) =>
                    setEditForm({ ...editForm, privacy: e.target.value })
                  }
                  className="w-full mb-3 px-3 py-2 border rounded"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingPin(null)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

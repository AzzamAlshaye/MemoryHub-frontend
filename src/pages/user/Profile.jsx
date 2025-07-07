// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { FaCamera, FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userService } from "../../service/userService";
import { pinService } from "../../service/pinService";
import ViewPin from "../../components/map/ViewPin.jsx";

export default function Profile() {
  const [user, setUser] = useState(null);
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
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white shadow-lg cursor-pointer">
                <FaCamera className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.name || "Loading..."}</h2>
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
              <label className="text-xs text-gray-500 mb-1 uppercase">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1 uppercase">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2" />
            </div>
            <div className="flex flex-col relative">
              <label className="text-xs text-gray-500 mb-1 uppercase">Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="New password"
                value={password} onChange={e => setPassword(e.target.value)}
                className="border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 pr-10" />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute top-[38px] right-3 text-gray-500">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRegBookmark } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PinsMap from "../../components/map/PinsMap";
import ViewPin from "../../components/map/ViewPin";
import CreatePost from "../../components/map/CreatePost";
import { pinService } from "../../service/pinService";
import { useAuth } from "../../context/AuthContext";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function MapPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("public");
  const [search, setSearch] = useState("");
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPinLocation, setNewPinLocation] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    pinService
      .list(filter, search)
      .then(setPins)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, search]);

  useEffect(() => {
    if (!selectedPinId) {
      setSelectedPin(null);
      return;
    }
    pinService.get(selectedPinId).then(setSelectedPin).catch(console.error);
  }, [selectedPinId]);

  const openPin = (id) => setSelectedPinId(id);
  const handleMapClick = ({ lat, lng }) => setNewPinLocation({ lat, lng });

  const handleUseMyLocation = () => {
    if (!userLocation) {
      toast.error("Unable to determine your location.");
      return;
    }
    setNewPinLocation(userLocation);
  };

  const renderSidebar = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    return pins.map((pin, idx) => (
      <motion.li
        key={pin._id}
        custom={idx}
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        onClick={() => openPin(pin._id)}
        className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer min-w-0"
      >
        <img
          src={pin.owner?.avatar || "/default-avatar.png"}
          alt={pin.owner?.name || "User"}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-300"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800">{pin.title}</h4>
          <p className="text-sm text-gray-500 truncate whitespace-nowrap">
            {pin.description}
          </p>
        </div>
      </motion.li>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFCFB]">
      <ToastContainer position="top-center" autoClose={3000} />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || "there"}!
          </h2>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-lg flex flex-wrap gap-4 items-center"
        >
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:border-amber-300 transition"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:border-amber-300 transition"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </motion.div>

        {/* Map & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 h-[70vh] rounded overflow-hidden shadow relative">
            <PinsMap
              pins={pins}
              onPinClick={openPin}
              onMapClick={handleMapClick}
              userLocation={userLocation}
            />
            {userLocation && (
              <button
                onClick={handleUseMyLocation}
                title="Pin at my current location"
                className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
              >
                <FaLocationDot size={20} className="text-blue-500" />
              </button>
            )}
          </div>

          <aside className="bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[70vh]  min-w-[20rem] hide-scrollbar">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-6"
            >
              <FaRegBookmark className="text-amber-400 text-2xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                My Memories
              </h3>
              <span className="ml-auto bg-amber-100 text-amber-800 text-sm font-medium px-2 py-1 rounded-full">
                {pins.length}
              </span>
            </motion.div>
            <ul className="space-y-4">{renderSidebar()}</ul>
          </aside>
        </div>

        {selectedPin && (
          <ViewPin
            pinId={selectedPinId}
            onClose={() => setSelectedPinId(null)}
          />
        )}

        {newPinLocation && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-auto"
            >
              <CreatePost
                initialLocation={newPinLocation}
                onSubmit={async ({
                  title,
                  description,
                  selectedPrivacy,
                  mediaFiles,
                }) => {
                  const images = mediaFiles.filter((f) =>
                    f.type.startsWith("image/")
                  );
                  const video =
                    mediaFiles.find((f) => f.type.startsWith("video/")) || null;
                  await pinService.createWithMedia(
                    {
                      title,
                      description,
                      privacy: selectedPrivacy,
                      latitude: newPinLocation.lat,
                      longitude: newPinLocation.lng,
                    },
                    images,
                    video
                  );
                  setNewPinLocation(null);
                  setPins(await pinService.list(filter, search));
                }}
                onCancel={() => setNewPinLocation(null)}
              />
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

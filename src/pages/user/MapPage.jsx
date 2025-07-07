// src/pages/user/MapPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaRegBookmark } from "react-icons/fa";
import PinsMap from "../../components/PinsMap";
import ViewPin from "../../components/ViewPin";
import CreatePost from "../../components/CreatePost";
import { pinService } from "../../service/pinService";
import { groupService } from "../../service/groupService";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: delay => ({
    opacity: 1,
    y: 0,
    transition: { delay: delay * 0.15, duration: 0.6, ease: "easeOut" }
  })
};

export default function MapPage() {
  const [filter, setFilter] = useState("public");
  const [search, setSearch] = useState("");
  const [pins, setPins] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPinLocation, setNewPinLocation] = useState(null);

  // Fetch pins when filter/search change
  useEffect(() => {
    setLoading(true);
    pinService
      .list(filter, search)
      .then(setPins)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, search]);

  // Fetch groups once
  useEffect(() => {
    groupService.list().then(setGroups).catch(console.error);
  }, []);

  // Fetch selected pin details
  useEffect(() => {
    if (!selectedPinId) {
      setSelectedPin(null);
    } else {
      pinService
        .get(selectedPinId)
        .then(setSelectedPin)
        .catch(console.error);
    }
  }, [selectedPinId]);

  // Group pins by groupId
  const pinsByGroup = useMemo(() => {
    const map = {};
    pins.forEach(p => {
      if (!p.groupId) return;
      const gid = String(p.groupId);
      map[gid] = map[gid] || [];
      map[gid].push(p);
    });
    return map;
  }, [pins]);

  const openPin = id => setSelectedPinId(id);
  const onMapClick = e =>
    setNewPinLocation({ lat: e.latlng.lat, lng: e.latlng.lng });

  const renderSidebar = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }
    if (filter !== "group") {
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
    }
    return groups.map((g, gi) => (
      <div key={g._id} className="mb-8">
        <motion.h4
          custom={gi + 1}
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-200 pb-1"
        >
          {g.name}
        </motion.h4>
        <ul className="space-y-4">
          {(pinsByGroup[g._id] || []).map((pin, pi) => (
            <motion.li
              key={pin._id}
              custom={gi + pi + 2}
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
                <h5 className="font-medium text-gray-800">{pin.title}</h5>
                <p className="text-sm text-gray-500 truncate whitespace-nowrap">
                  {pin.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF7F0]">
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 space-y-8">
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
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:border-amber-300 transition"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-300 focus:border-amber-300 transition"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="group">Group</option>
          </select>
        </motion.div>

        {/* Map & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* خريطة بنفس التصميم الأصلي */}
          <div className="lg:col-span-3 h-[70vh] rounded overflow-hidden shadow">
            <PinsMap
              pins={pins}
              onPinClick={openPin}
              onMapClick={onMapClick}
            />
          </div>

          {/* Sidebar بمظهر احترافي */}
          <aside className="bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[70vh] hide-scrollbar">
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

        {/* Existing Pin Detail */}
        {selectedPin && (
          <ViewPin pinId={selectedPinId} onClose={() => setSelectedPinId(null)} />
        )}

        {/* Create Post Modal */}
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
                onSubmit={async data => {
                  const images = data.mediaFiles.filter(f => f.type.startsWith("image/"));
                  const video = data.mediaFiles.find(f => f.type.startsWith("video/")) || null;
                  await pinService.createWithMedia(
                    {
                      ...data,
                      latitude: newPinLocation.lat,
                      longitude: newPinLocation.lng
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

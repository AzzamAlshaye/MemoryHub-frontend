// src/pages/user/MapPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import PinsMap from "../../components/PinsMap";
import ViewPin from "../../components/ViewPin";
import CreatePost from "../../components/CreatePost";
import { pinService } from "../../service/pinService";
import { groupService } from "../../service/groupService";

export default function MapPage() {
  const [filter, setFilter] = useState("public");
  const [search, setSearch] = useState("");
  const [pins, setPins] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPinLocation, setNewPinLocation] = useState(null);

  useEffect(() => {
    setLoading(true);
    pinService
      .list(filter, search)
      .then(setPins)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, search]);

  useEffect(() => {
    groupService.list().then(setGroups).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedPinId) {
      setSelectedPin(null);
      return;
    }
    pinService.get(selectedPinId).then(setSelectedPin).catch(console.error);
  }, [selectedPinId]);

  const pinsByGroup = useMemo(() => {
    const map = {};
    pins.forEach((p) => {
      if (!p.groupId) return;
      const gid = p.groupId.toString();
      map[gid] = map[gid] || [];
      map[gid].push(p);
    });
    return map;
  }, [pins]);

  const openPin = (id) => setSelectedPinId(id);
  const handleMapClick = (e) =>
    setNewPinLocation({ lat: e.latlng.lat, lng: e.latlng.lng });

  const renderSidebar = () => {
    if (loading) return <p className="p-4 text-gray-500">Loading…</p>;
    if (filter !== "group") {
      return pins.map((pin) => (
        <li
          key={pin._id}
          className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
          onClick={() => openPin(pin._id)}
        >
          <img
            src={pin.owner?.avatar || "/default-avatar.png"}
            alt={pin.owner?.name || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-medium">{pin.title}</h4>
            <p className="text-sm text-gray-500 truncate">{pin.description}</p>
          </div>
        </li>
      ));
    }
    return groups.map((g) => (
      <div key={g._id} className="mb-6">
        <h4 className="font-semibold mb-2">{g.name}</h4>
        <ul>
          {(pinsByGroup[g._id] || []).map((pin) => (
            <li
              key={pin._id}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
              onClick={() => openPin(pin._id)}
            >
              <img
                src={pin.owner?.avatar || "/default-avatar.png"}
                alt={pin.owner?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h5 className="font-medium">{pin.title}</h5>
                <p className="text-sm text-gray-500 truncate">
                  {pin.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF7F0]">
      <main className="flex-1 max-w-7xl mx-auto p-4">
        {/* Search & Filter */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border rounded p-2"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="group">Group</option>
          </select>
        </div>

        {/* Map & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 h-[70vh] rounded overflow-hidden shadow">
            <PinsMap
              pins={pins}
              onPinClick={openPin}
              onMapClick={handleMapClick}
            />
          </div>
          <aside className="bg-white p-6 rounded shadow overflow-y-auto max-h-[70vh]">
            <h3 className="text-xl font-semibold mb-4">My Memories</h3>
            <ul className="space-y-2">{renderSidebar()}</ul>
          </aside>
        </div>

        {/* Existing Pin Detail */}
        {selectedPin && (
          <ViewPin
            pinId={selectedPinId}
            onClose={() => setSelectedPinId(null)}
          />
        )}

        {/* Create Post Modal */}
        {newPinLocation && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg overflow-auto max-h-full shadow-xl">
              <CreatePost
                initialLocation={newPinLocation}
                onSubmit={({
                  title,
                  description,
                  selectedPrivacy,
                  mediaFiles,
                }) => {
                  // split images vs video
                  const images = mediaFiles.filter((f) =>
                    f.type.startsWith("image/")
                  );
                  const video =
                    mediaFiles.find((f) => f.type.startsWith("video/")) || null;

                  pinService
                    .createWithMedia(
                      {
                        title,
                        description,
                        privacy: selectedPrivacy,
                        latitude: newPinLocation.lat,
                        longitude: newPinLocation.lng,
                        // add groupId here if needed
                      },
                      images,
                      video
                    )
                    .then(() => {
                      setNewPinLocation(null);
                      // refresh pins list
                      return pinService.list(filter, search).then(setPins);
                    })
                    .catch(console.error);
                }}
                onCancel={() => setNewPinLocation(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

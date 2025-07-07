// src/pages/user/MapPage.jsx
import React, { useState, useEffect } from "react";
import PinsMap from "../../components/map/PinsMap";
import ViewPin from "../../components/map/ViewPin";
import CreatePost from "../../components/map/CreatePost";
import { pinService } from "../../service/pinService";
import { FaLocationDot } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MapPage() {
  const [filter, setFilter] = useState("public");
  const [search, setSearch] = useState("");
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPinId, setSelectedPinId] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [newPinLocation, setNewPinLocation] = useState(null);

  // track user location
  const [userLocation, setUserLocation] = useState(null);
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  // fetch pins whenever filter/search change
  useEffect(() => {
    setLoading(true);
    pinService
      .list(filter, search)
      .then(setPins)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, search]);

  // fetch selected pin detail
  useEffect(() => {
    if (!selectedPinId) {
      setSelectedPin(null);
      return;
    }
    pinService.get(selectedPinId).then(setSelectedPin).catch(console.error);
  }, [selectedPinId]);

  const openPin = (id) => setSelectedPinId(id);
  const handleMapClick = ({ lat, lng }) => setNewPinLocation({ lat, lng });

  // use-my-location handler
  const handleUseMyLocation = () => {
    if (!userLocation) {
      toast.error("Unable to determine your location.");
      return;
    }
    setNewPinLocation(userLocation);
  };

  // sidebar now just shows pins
  const renderSidebar = () => {
    if (loading) return <p className="p-4 text-gray-500">Loading…</p>;
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF7F0]">
      <ToastContainer position="top-center" autoClose={3000} />

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
          </select>
        </div>

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

          <aside className="bg-white p-6 rounded shadow overflow-y-auto max-h-[70vh]">
            <h3 className="text-xl font-semibold mb-4">My Memories</h3>
            <ul className="space-y-2">{renderSidebar()}</ul>
          </aside>
        </div>

        {/* View existing pin */}
        {selectedPin && (
          <ViewPin
            pinId={selectedPinId}
            onClose={() => setSelectedPinId(null)}
          />
        )}

        {/* Create new pin */}
        {newPinLocation && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg overflow-auto max-h-full shadow-xl">
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
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

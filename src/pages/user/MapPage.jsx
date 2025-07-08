// src/pages/user/MapPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { FaRegBookmark, FaTimes } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTitle } from "../../hooks/useTitle";
import PinsMap from "../../components/map/PinsMap";
import ViewPin from "../../components/map/ViewPin";
import CreatePost from "../../components/map/CreatePost";
import { pinService } from "../../service/pinService";
import { useAuth } from "../../context/AuthContext";

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
  useTitle("Map | MemoryHub");

  // 1) Get browser geolocation
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) =>
        setUserLocation({ lat: coords.latitude, lng: coords.longitude }),
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  // 2) Normalize pin docs
  const normalizePins = useCallback(
    (list) =>
      list.map((pin) => ({
        ...pin,
        latitude: pin.location.lat,
        longitude: pin.location.lng,
      })),
    []
  );

  // 3) Fetch pins
  const fetchPins = useCallback(async () => {
    setLoading(true);
    try {
      const list = await pinService.list(filter, search);
      setPins(normalizePins(list));
    } catch (err) {
      console.error("Failed to load pins:", err);
      toast.error("Failed to load pins");
    } finally {
      setLoading(false);
    }
  }, [filter, search, normalizePins]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  // 4) Fetch a single pin for the detail modal
  useEffect(() => {
    if (!selectedPinId) {
      setSelectedPin(null);
      return;
    }
    pinService
      .get(selectedPinId)
      .then((pin) =>
        setSelectedPin({
          ...pin,
          latitude: pin.location.lat,
          longitude: pin.location.lng,
        })
      )
      .catch((err) => {
        console.error("Failed to load pin detail:", err);
      });
  }, [selectedPinId]);

  // Handlers
  const openPin = (id) => setSelectedPinId(id);
  const handleMapClick = ({ lat, lng }) => setNewPinLocation({ lat, lng });
  const handleUseMyLocation = () => {
    if (!userLocation) {
      toast.error("Unable to determine your location.");
      return;
    }
    setNewPinLocation(userLocation);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FEFCFB]">
      <ToastContainer position="top-center" autoClose={3000} />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, {user?.name || "there"}!
        </h2>

        {/* Search & Filter */}
        <div className="bg-gray-50 p-6 rounded-2xl flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring- focus:border-lighter-theme transition"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-lighter-theme focus:border-lighter-theme transition"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Map & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map */}
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

          {/* Sidebar */}
          <aside className="bg-white p-6 rounded-xl shadow-lg overflow-y-auto max-h-[70vh] min-w-[20rem] hide-scrollbar">
            <div className="flex items-center mb-6">
              <FaRegBookmark className="text-lighter-theme text-2xl mr-3" />
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                {filter === "public" ? "Public Memories" : "Private Memories"}
              </h3>
              <span className="ml-auto bg-white-theme text-main-theme text-sm font-medium px-2 py-1 rounded-full">
                {pins.length}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-lighter-theme border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ul className="space-y-4">
                {pins.map((pin, idx) => (
                  <li
                    key={pin._id ?? idx}
                    onClick={() => openPin(pin._id)}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <img
                      src={pin.owner?.avatar || "/default-avatar.png"}
                      alt={pin.owner?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-lighter-theme"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800">
                        {pin.title}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {pin.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>

        {/* ViewPin Modal */}
        {selectedPin && (
          <ViewPin
            pinId={selectedPinId}
            onClose={() => setSelectedPinId(null)}
          />
        )}

        {/* CreatePost Modal */}
        {newPinLocation && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setNewPinLocation(null)}
          >
            <div
              className="relative bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setNewPinLocation(null)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              >
                <FaTimes size={20} />
              </button>

              <CreatePost
                initialLocation={newPinLocation}
                onSubmit={async (formData) => {
                  // — Verify exactly what goes out —
                  console.group("MapPage: FormData to submit");
                  for (let [k, v] of formData.entries()) {
                    console.log(`${k}:`, v);
                  }
                  console.groupEnd();

                  try {
                    // Make sure you have implemented createWithFormData()
                    await pinService.createWithFormData(formData);
                    toast.success("🎉 Pin created!");
                    setNewPinLocation(null);
                    await fetchPins();
                  } catch (err) {
                    console.error("Failed to create pin:", err);
                    toast.error("Failed to create pin");
                  }
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

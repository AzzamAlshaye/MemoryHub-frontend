// src/pages/PinsMapDemo.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import CreatePost from "./CreatePost";
import ViewPin from "../components/ViewPin";

// React Icons (if your ViewPin needs them)
import {
  FaHeart,
  FaComment,
  FaShareAlt,
  FaBookmark,
  FaSyncAlt,
} from "react-icons/fa";

// Your pins array
const pins = [
  {
    id: "3",
    title: "Sunrise at Grand Canyon",
    description:
      "Woke up before dawn to catch this incredible sunrise. The colors were unreal!",
    privacy: "Public",
    createdAt: "2025-07-01T05:23:00Z",
    author: {
      name: "Azzam Alshaye",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    tags: ["Travel", "Nature", "Adventure"],
    media: [
      "https://picsum.photos/800/400?image=1050",
      "https://picsum.photos/800/400?image=1049",
    ],
    location: {
      lat: 24.738412570933605,
      lng: 46.718288430746036,
      name: "Grand Canyon National Park",
      address: "Arizona, USA",
      image: "https://picsum.photos/200/100?image=1039",
    },
    likes: 128,
    commentsCount: 14,
    shares: 7,
  },
];

export default function PinsMapDemo() {
  const [newPinPos, setNewPinPos] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);

  function ClickHandler({ onMapClick }) {
    useMapEvents({ click: (e) => onMapClick(e.latlng) });
    return null;
  }
  const handleMapClick = (latlng) => setNewPinPos(latlng);
  const handleCreate = (data) => {
    console.log("Creating pin:", data, "at", newPinPos);
    setNewPinPos(null);
  };

  return (
    <>
      {/* Leaflet Map */}
      <MapContainer
        center={[24.7136, 46.6753]}
        zoom={5}
        className="h-[600px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.location.lat, pin.location.lng]}
            eventHandlers={{ click: () => setSelectedPin(pin) }}
          />
        ))}

        <ClickHandler onMapClick={handleMapClick} />
      </MapContainer>

      {/* New-Pin Overlay */}
      {newPinPos && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl relative">
            <button
              onClick={() => setNewPinPos(null)}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
            <CreatePost onSubmit={handleCreate} />
          </div>
        </div>
      )}

      {/* View-Pin Overlay */}
      {selectedPin && (
        <div className="fixed inset-0 z-[9999]">
          <ViewPin
            pin={selectedPin}
            onClose={() => setSelectedPin(null)}
            currentUser={selectedPin.author}
            icons={{ FaHeart, FaComment, FaShareAlt, FaBookmark, FaSyncAlt }}
          />
        </div>
      )}
    </>
  );
}

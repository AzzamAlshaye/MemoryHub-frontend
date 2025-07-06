// src/components/PinsMap.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function PinsMap({ pins = [], onPinClick, onMapClick }) {
  // Hook into map events and forward clicks
  function ClickHandler() {
    useMapEvents({
      click: (e) => {
        if (onMapClick) {
          onMapClick(e); // forward the Leaflet click event
        }
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[24.7136, 46.6753]}
      zoom={5}
      className="w-full h-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pins.map((pin) => (
        <Marker
          key={pin._id}
          position={[pin.location.lat, pin.location.lng]}
          eventHandlers={{
            click: () => onPinClick(pin._id),
          }}
        />
      ))}

      <ClickHandler />
    </MapContainer>
  );
}
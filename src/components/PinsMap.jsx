import React, { useState, useEffect } from "react";
import api from "../api";
import {
  MapContainer,
  TileLayer,
  Pane,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import CreatePost from "./CreatePost";
import "leaflet/dist/leaflet.css";

export default function PinsMap({ filter }) {
  const [pins, setPins] = useState([]);
  const [newPinPos, setNewPinPos] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/pins", { params: { privacy: filter } });
        setPins(res.data);
      } catch (err) {
        console.error("Error fetching pins:", err);
      }
    })();
  }, [filter]);

  function ClickHandler({ onMapClick }) {
    useMapEvents({ click: (e) => onMapClick(e.latlng) });
    return null;
  }

  const handleMapClick = (latlng) => setNewPinPos(latlng);

  const handleCreate = async (formData) => {
    try {
      await api.post("/pins", {
        title: formData.title,
        description: formData.description,
        privacy: formData.selectedPrivacy.toLowerCase(),
        location: { lat: newPinPos.lat, lng: newPinPos.lng },
      });
      setNewPinPos(null);
      const res = await api.get("/pins", { params: { privacy: filter } });
      setPins(res.data);
    } catch (err) {
      console.error("Error creating pin:", err);
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[24.7136, 46.6753]}
        zoom={13}
        className="h-full w-full"
      >
        <Pane name="customPopupPane" style={{ zIndex: 650 }} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pins.map((pin) => (
          <Marker key={pin._id} position={[pin.location.lat, pin.location.lng]}>
            <Popup
              pane="customPopupPane"
              minWidth={200}
              maxWidth={400}
              keepInView={true}
            >
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{pin.title}</h3>
                <p className="text-sm text-gray-600">{pin.description}</p>
                <span className="text-xs bg-blue-100 text-blue-500 px-2 py-1 rounded">
                  {pin.privacy}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        <ClickHandler onMapClick={handleMapClick} />

        {newPinPos && (
          <Marker position={[newPinPos.lat, newPinPos.lng]}>
            <Popup
              pane="customPopupPane"
              minWidth={240}
              maxWidth={600}
              keepInView={true}
            >
              <div className="overflow-visible">
                <CreatePost onSubmit={handleCreate} />
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

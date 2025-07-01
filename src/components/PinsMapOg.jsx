// import React, { useState, useEffect } from "react";
// import api from "../api";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import CreatePost from "./CreatePost";
// import "leaflet/dist/leaflet.css";

// export default function PinsMap({ filter }) {
//   const [pins, setPins] = useState([]);
//   const [newPinPos, setNewPinPos] = useState(null);

//   // Fetch pins when filter changes
//   useEffect(() => {
//     async function fetchPins() {
//       try {
//         const res = await api.get("/pins", { params: { privacy: filter } });
//         setPins(res.data);
//       } catch (err) {
//         console.error("Error fetching pins:", err);
//       }
//     }
//     fetchPins();
//   }, [filter]);

//   function ClickHandler({ onMapClick }) {
//     useMapEvents({ click: (e) => onMapClick(e.latlng) });
//     return null;
//   }

//   const handleMapClick = (latlng) => setNewPinPos(latlng);

//   // Create a new pin and then re-fetch
//   const handleCreate = async ({ title, description, selectedPrivacy }) => {
//     if (!newPinPos) return;
//     try {
//       await api.post("/pins", {
//         title,
//         description,
//         privacy: selectedPrivacy.toLowerCase(),
//         location: { lat: newPinPos.lat, lng: newPinPos.lng },
//       });
//       setNewPinPos(null);
//       const res = await api.get("/pins", { params: { privacy: filter } });
//       setPins(res.data);
//     } catch (err) {
//       console.error("Error creating pin:", err);
//     }
//   };

//   return (
//     <>
//       <MapContainer
//         center={[24.7136, 46.6753]}
//         zoom={13}
//         className="h-full w-full"
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {pins.map((pin) => (
//           <Marker
//             key={pin._id}
//             position={[pin.location.lat, pin.location.lng]}
//           />
//         ))}

//         <ClickHandler onMapClick={handleMapClick} />
//       </MapContainer>

//       {newPinPos && (
//         <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
//           <div className="bg-white w-full max-w-3xl h-full max-h-[90vh] rounded-lg shadow-lg overflow-auto relative">
//             <button
//               onClick={() => setNewPinPos(null)}
//               className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//             >
//               ✕
//             </button>
//             <CreatePost onSubmit={handleCreate} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// src/components/map/PinsMap.jsx
import React, { useRef, useEffect } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export default function PinsMap({
  pins = [],
  onPinClick,
  onMapClick,
  userLocation,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    const resize = () => {
      const map = mapRef.current;
      if (map) map.resize();
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ latitude: 24.7136, longitude: 46.6753, zoom: 5 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      onLoad={(e) => e.target.resize()}
      onClick={(e) => onMapClick?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })}
    >
      <NavigationControl position="top-left" />

      {pins.map((pin) => (
        <Marker
          key={pin._id}
          longitude={pin.location.lng}
          latitude={pin.location.lat}
          anchor="bottom"
          onClick={(evt) => {
            evt.originalEvent.stopPropagation();
            onPinClick(pin._id);
          }}
        />
      ))}

      {userLocation && (
        <Marker
          longitude={userLocation.lng}
          latitude={userLocation.lat}
          anchor="center"
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
        </Marker>
      )}
    </Map>
  );
}

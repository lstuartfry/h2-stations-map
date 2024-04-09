"use client";

import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

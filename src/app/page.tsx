"use client";

import { useEffect, useRef, useState } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  type MapRef,
  LngLatLike,
} from "react-map-gl";

import { getAvailableH2FuelStations } from "@/actions";
import { createBoundingBox } from "@/utils";
import { FuelStation } from "@/types";

/**
 * Renders an interactive map showing all available hydrogen stations.
 */
export default function Home() {
  // Store a reference to the Map object to enable mapbox-gl api interactions.
  const mapRef = useRef<MapRef>(null);

  // Hold fuel station data in state, to iterate over and to create selectable Marker elements for each station.
  const [stations, setStations] = useState<FuelStation[]>();

  // Fetch the fuel stations to populate the map
  useEffect(() => {
    const fetchStations = async () => {
      const data = await getAvailableH2FuelStations();
      console.log(data.fuel_stations);
      setStations(data.fuel_stations);
    };
    fetchStations();
  }, []);

  // Fit the map bounds around the bounds of the fuel stations
  useEffect(() => {
    if (stations && stations.length > 0) {
      // Create a nested array of coordinates for each fuel station
      const coordinates = stations.map(
        (station) => [station.longitude, station.latitude] as LngLatLike
      );
      // Create a bounding box for the all the stations coordinates
      const stationsBoundingBox = createBoundingBox(coordinates);

      // Update the bounds of the map to fit the stations bounding box
      mapRef.current?.fitBounds(stationsBoundingBox);
    }
  }, [stations]);

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      ref={mapRef}
      initialViewState={{
        longitude: -118.243683,
        latitude: 34.052235,
        zoom: 3,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <NavigationControl />
      <GeolocateControl />
    </Map>
  );
}

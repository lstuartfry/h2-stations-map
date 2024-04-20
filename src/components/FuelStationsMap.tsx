"use client";

import { useEffect, useRef } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  type MapRef,
  LngLatLike,
} from "react-map-gl";

import { createBoundingBox } from "@/utils";
import { FuelStation } from "@/types";

export default function FuelStationsMap({
  fuelStations,
}: {
  fuelStations: FuelStation[];
}) {
  // Store a reference to the Map object to enable mapbox-gl api interactions.
  const mapRef = useRef<MapRef>(null);

  // Fit the map bounds around the bounds of the fuel stations
  useEffect(() => {
    // update the bounds of the map once the Map object has been initialized and there are fuel stations to render.
    if (mapRef?.current && fuelStations?.length > 0) {
      // Create a nested array of coordinates for each fuel station
      const coordinates = fuelStations.map(
        (station) => [station.longitude, station.latitude] as LngLatLike
      );
      // Create a bounding box for the all the stations coordinates
      const stationsBoundingBox = createBoundingBox(coordinates);

      // Update the bounds of the map to fit the stations bounding box
      mapRef.current?.fitBounds(stationsBoundingBox);
    }
  }, [fuelStations]);

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

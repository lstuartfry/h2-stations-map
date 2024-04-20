"use client";

import { useMemo, useRef } from "react";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  type GeolocateEvent,
  type GeolocateResultEvent,
  type LngLatLike,
  type MapRef,
} from "react-map-gl";
import type mapboxgl from "mapbox-gl";

import { createBoundingBox } from "@/utils";
import { FuelStation } from "@/types";

/**
 * Renders an interactive map showing all available hydrogen stations.
 */
export default function FuelStationsMap({
  fuelStations,
}: {
  fuelStations: FuelStation[];
}) {
  // Store a reference to the Map object to enable mapbox-gl api interactions.
  const mapRef = useRef<MapRef>(null);

  // Store a reference to the mapbox geocontrol api
  const geoControlRef = useRef<mapboxgl.GeolocateControl>(null);

  // Once the Map object has loaded, activate the geolocation controls, and update the bounds of the map to fit the bounding box of the fuel stations.
  const handleLoad = () => {
    // Activate geolocation as soon as the control is loaded
    geoControlRef.current?.trigger();
    // Create a nested array of coordinates for each fuel station
    const coordinates = fuelStations.map(
      (station) => [station.longitude, station.latitude] as LngLatLike
    );
    // Create a bounding box for the all the stations coordinates
    const stationsBoundingBox = createBoundingBox(coordinates);

    // Update the bounds of the map to fit the stations bounding box
    mapRef.current?.fitBounds(stationsBoundingBox, { padding: 50 });
  };

  const handleGeolocate = (evt: GeolocateResultEvent) => {
    console.log("geolocate event", evt);
  };

  // Returns an array of Marker components associated with each fuel station.
  const renderMarkers = useMemo(() => {
    return fuelStations.map((station) => (
      <Marker
        key={station.id}
        latitude={station.latitude}
        longitude={station.longitude}
        color="#0391ab"
      />
    ));
  }, [fuelStations]);

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      ref={mapRef}
      initialViewState={{
        longitude: -118.243683,
        latitude: 34.052235,
        zoom: 5,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onLoad={handleLoad}
    >
      {renderMarkers}
      <NavigationControl />
      <GeolocateControl ref={geoControlRef} onGeolocate={handleGeolocate} />
    </Map>
  );
}

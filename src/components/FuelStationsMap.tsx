"use client";

import { useMemo, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  Marker,
  NavigationControl,
  useControl,
  type GeolocateResultEvent,
  type LngLatLike,
  type MapRef,
} from "react-map-gl";
import type mapboxgl from "mapbox-gl";
import { DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { GeoJsonLayer } from "@deck.gl/layers";
import * as turf from "@turf/helpers";
import turfSector from "@turf/sector";
import { type Feature } from "geojson";

import { createBoundingBox } from "@/utils";
import { FuelStation } from "@/types";

// Build a Deck.gl Overlay component to be rendered as a child of the parent Mapbox component
const DeckGLOverlay: React.FC<DeckProps> = (props) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

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

  // Store a reference to the Sector created based on preferred station proximity to the user's current location.
  const [stationSector, setStationSector] = useState<Feature>();

  const layer = new GeoJsonLayer({
    data: stationSector,
    id: "GeoJsonLayer",
    stroked: true,
    filled: true,
    pointType: "circle+text",
    pickable: true,
    getFillColor: [160, 160, 180, 200],
  });

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
    const {
      coords: { latitude, longitude },
    } = evt;
    const centerPoint = turf.point([longitude, latitude]);
    const radius = 5;
    const bearing1 = 0;
    const bearing2 = 360;
    const sector = turfSector(centerPoint, radius, bearing1, bearing2, {
      units: "miles",
    });
    setStationSector(sector);
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
      <DeckGLOverlay layers={[layer]} />
      {renderMarkers}
      <NavigationControl />
      <GeolocateControl ref={geoControlRef} onGeolocate={handleGeolocate} />
    </Map>
  );
}

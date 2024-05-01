"use client";

import { useMemo, useRef, useState } from "react";
import Map, {
  // GeolocateControl,
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
import * as turf from "@turf/helpers";
import turfSector from "@turf/sector";
import { type Feature, type Polygon } from "geojson";

import { createSectorLayer } from "@/layers";
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
  const [sector, setSector] = useState<Feature<Polygon>>();

  // Create a geojson Sector-like layer
  const sectorLayer = useMemo(() => createSectorLayer(sector), [sector]);

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
    const {
      coords: { latitude, longitude },
    } = evt;
    // Create a geojson point for the user's location.
    const centerPoint = turf.point([longitude, latitude]);

    // TODO, enable dynamic configuration for radius.
    const radius = 5;

    // Create a full circle sector.
    const bearing1 = 0;
    const bearing2 = 360;

    const selectedSector = turfSector(centerPoint, radius, bearing1, bearing2, {
      units: "miles",
    });

    setSector(selectedSector);
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
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      ref={mapRef}
      initialViewState={{
        longitude: -118.243683,
        latitude: 34.052235,
        zoom: 5,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onLoad={handleLoad}
    >
      <DeckGLOverlay layers={[sectorLayer]} />
      <NavigationControl />
      {/* <GeolocateControl
        ref={geoControlRef}
        onGeolocate={handleGeolocate}
        fitBoundsOptions={{ maxZoom: 10 }}
      /> */}
      {renderMarkers}
    </Map>
  );
}

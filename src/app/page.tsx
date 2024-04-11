"use client";

import { useEffect, useRef, useState } from "react";
import Map, {
  NavigationControl,
  GeolocateControl,
  type MapRef,
  LngLatLike,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { getAvailableH2FuelStations } from "@/actions";
import { createBoundingBox } from "@/utils";
import { FuelStation } from "@/types";

export default function Home() {
  // store a reference to the Map object to enable mapbox-gl api interactions.
  const mapRef = useRef<MapRef>(null);

  // hold fuel station data in state, to iterate over and to create selectable Marker elements for each station.
  const [stations, setStations] = useState<FuelStation[]>();

  // fetch the fuel stations to populate the map
  useEffect(() => {
    const fetchStations = async () => {
      const data = await getAvailableH2FuelStations();
      console.log(data.fuel_stations);
      setStations(data.fuel_stations);
    };
    fetchStations();
  }, []);

  // fit the map bounds around the bounds of the fuel stations
  useEffect(() => {
    if (stations && stations.length > 0) {
      // create a nested array of coordinates for each fuel station
      const coordinates = stations.map(
        (station) => [station.longitude, station.latitude] as LngLatLike
      );
      // create a bounding box for the all the stations coordinates
      const stationsBoundingBox = createBoundingBox(coordinates);

      // update the bounds of the map to fit the stations bounding box
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

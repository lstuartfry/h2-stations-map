"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  GeolocateControl,
  NavigationControl,
  useControl,
  Popup,
  type GeolocateResultEvent,
  type LngLatLike,
  type MapRef,
} from "react-map-gl";
import type mapboxgl from "mapbox-gl";
import { DeckProps } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as turf from "@turf/helpers";
import { coordAll } from "@turf/meta";
import sector from "@turf/sector";
import { type Feature, type Polygon } from "geojson";

import { createSectorLayer } from "@/layers";
import { createBoundingBox } from "@/utils";
import WelcomeDialog from "@/components/WelcomeDialog";
import ProximitySelect from "@/components/ProximitySelect";
import { FuelStation } from "@/types";
import StationMarker from "./StationMarker";
import StationInfo from "./StationInfo";
import { type GetAddressGeocodingResponseData } from "@/actions";

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
  const [proximitySector, setProximitySector] = useState<Feature<Polygon>>();

  // A user's lat/lon coordinates, stored as a Geojson feature
  const [centerPoint, setCenterPoint] = useState<Feature>();

  // Store a reference to the desired proximity of fuel stations from the user's current location.
  const [selectedProximityRadius, setSelectedProximityRadius] =
    useState<number>(5);

  // trigger to display the Popup which renders metadata about the fuel station.
  const [stationPopupInfo, setStationPopupInfo] = useState<FuelStation | null>(
    null
  );

  const [isSectorVisibile, setIsSectorVisible] = useState<boolean>(true);

  // toggle to trigger the visibility of the sector layer
  const onToggleSectorVisibility = () => setIsSectorVisible((s) => !s);

  // Create a geojson Sector-like layer
  const proximitySectorLayer = useMemo(
    () => createSectorLayer(proximitySector, isSectorVisibile),
    [proximitySector, isSectorVisibile]
  );

  // Once the Map object has loaded, activate the geolocation controls, and update the bounds of the map to fit the bounding box of the fuel stations.
  const handleLoad = () => {
    // Activate geolocation as soon as the control is loaded
    // geoControlRef.current?.trigger();
    // Create a nested array of coordinates for each fuel station
    const coordinates = fuelStations.map(
      (station) => [station.longitude, station.latitude] as LngLatLike
    );
    // Create a bounding box for the all the stations coordinates
    const stationsBoundingBox = createBoundingBox(coordinates);

    // Update the bounds of the map to fit the stations bounding box
    mapRef.current?.fitBounds(stationsBoundingBox, { padding: 50 });
  };

  // callback triggered when a user's location is fetched via the mapbox geolocation API.
  const handleGeolocate = (evt: GeolocateResultEvent) => {
    const {
      coords: { latitude, longitude },
    } = evt;
    // Create a geojson point for the user's location.
    const centerPoint = turf.point([longitude, latitude]);
    setCenterPoint(centerPoint);
  };

  // handler to manually trigger the geolocation API
  const handleGeolocationEnable = () => {
    geoControlRef.current?.trigger();
  };

  // callback triggered when a user manually enters their address.
  const handleAddressSuccess = (data: GetAddressGeocodingResponseData) => {
    const { latitude, longitude } = data.features[0].properties.coordinates;

    // Create a geojson point for the user's address.
    const centerPoint = turf.point([longitude, latitude]);
    setCenterPoint(centerPoint);
  };

  // updates the Proximity sector whenever a user's location or desired fuel station proximity option is updated.
  useEffect(() => {
    if (centerPoint) {
      // Create a full circle sector.
      const bearing1 = 0;
      const bearing2 = 360;

      const selectedProximitySector = sector(
        centerPoint,
        selectedProximityRadius,
        bearing1,
        bearing2,
        {
          units: "miles",
        }
      );

      // update the Sector data in component state.
      setProximitySector(selectedProximitySector);

      // create a bounding box for the sector.
      const sectorCoords = coordAll(
        selectedProximitySector
      ) as unknown as LngLatLike[];
      const sectorBoundingBox = createBoundingBox(sectorCoords);

      // Update the bounds of the map to fit the bounding box of the sector.
      mapRef.current?.fitBounds(sectorBoundingBox, { padding: 50 });
    }
  }, [centerPoint, selectedProximityRadius]);

  // Returns an array of Marker components associated with each fuel station.
  const renderMarkers = useMemo(() => {
    return fuelStations.map((station) => (
      <StationMarker
        key={station.id}
        station={station}
        proximitySector={proximitySector}
        onClick={() => setStationPopupInfo(station)}
      />
    ));
  }, [fuelStations, proximitySector]);

  return (
    <>
      <WelcomeDialog
        loaded={!!proximitySector}
        onGeolocationEnable={handleGeolocationEnable}
        onAddressSuccess={handleAddressSuccess}
      />
      <ProximitySelect
        selectedProximityRadius={selectedProximityRadius}
        onChange={(value: number) => setSelectedProximityRadius(value)}
        onToggleSector={onToggleSectorVisibility}
        checked={isSectorVisibile}
      />
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
        <DeckGLOverlay layers={[proximitySectorLayer]} />
        <NavigationControl />
        <GeolocateControl
          ref={geoControlRef}
          onGeolocate={handleGeolocate}
          fitBoundsOptions={{ maxZoom: 12 }}
        />
        {renderMarkers}
        {stationPopupInfo && (
          <Popup
            latitude={stationPopupInfo.latitude}
            longitude={stationPopupInfo.longitude}
            className="z-20"
            anchor="bottom"
            offset={55}
            onClose={() => setStationPopupInfo(null)}
          >
            <StationInfo station={stationPopupInfo} />
          </Popup>
        )}
      </Map>
    </>
  );
}

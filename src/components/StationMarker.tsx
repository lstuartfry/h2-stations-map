"use client";

import { useMemo } from "react";
import { Marker } from "react-map-gl";
import * as turfHelpers from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import clsx from "clsx";
import { type Feature, type Polygon } from "geojson";

import { type FuelStation } from "@/types";

/**
 * Renders a Marker for each fuel station on the map.
 * When selected, will display information about the specific fuel station.
 */
export default function StationMarker({
  station,
  proximitySector,
  onClick,
}: {
  station: FuelStation;
  proximitySector?: Feature<Polygon>;
  onClick: () => void;
}) {
  // create a GeoJson 'Point' feature using the station's coordintes.
  const point = turfHelpers.point([station.longitude, station.latitude]);

  // boolean to determine if the Point is within the current proximity sector.
  const withinSelectedProximitySector =
    proximitySector && booleanPointInPolygon(point, proximitySector);

  // 'color' and 'sizes' will be adjusted to highlight if the Point is within the current proximity sector.
  const sizes = useMemo(
    () => ({
      width: withinSelectedProximitySector ? 50 : 40,
      height: withinSelectedProximitySector ? 50 : 40,
    }),
    [withinSelectedProximitySector]
  );

  const renderPinSVG = useMemo(() => {
    return (
      <svg {...sizes} viewBox="0 0 64 64">
        <path
          className={clsx(
            "hover:stroke-2 hover:stroke-blue-300 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.7)]",
            withinSelectedProximitySector
              ? "fill-primary-purple"
              : "fill-secondary-green"
          )}
          d="M32 0A24.032 24.032 0 0 0 8 24c0 17.23 22.36 38.81 23.31 39.72a.99.99 0 0 0 1.38 0C33.64 62.81 56 41.23 56 24A24.032 24.032 0 0 0 32 0zm0 35a11 11 0 1 1 11-11 11.007 11.007 0 0 1-11 11z"
        />
      </svg>
    );
  }, [sizes, withinSelectedProximitySector]);

  return (
    <Marker
      anchor="bottom"
      key={station.id}
      latitude={station.latitude}
      longitude={station.longitude}
      onClick={(e) => {
        // If we let the click event propagates to the map, it will immediately close the popup
        // with `closeOnClick: true`
        e.originalEvent.stopPropagation();
        onClick();
      }}
      style={{
        zIndex: 10,
        cursor: "pointer",
      }}
    >
      {renderPinSVG}
    </Marker>
  );
}

"use client";

import { useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { type Feature, type Polygon, type GeoJsonProperties } from "geojson";

/**
 *
 * @param data GeoJson Polygon-like Feature
 * @returns Geojson Polygon Layer / Layer visibility state / Layer visibility toggle
 */
export default function useProximitySector(
  data?: Feature<Polygon, GeoJsonProperties>
) {
  const [isSectorVisibile, setIsSectorVisible] = useState<boolean>(true);

  const onToggleSectorVisibility = () => setIsSectorVisible((s) => !s);

  const sectorLayer = new GeoJsonLayer({
    data,
    id: "GeoJsonLayer",
    filled: true,
    getFillColor: [255, 255, 102, 100],
    visible: isSectorVisibile,
  });

  return { isSectorVisibile, onToggleSectorVisibility, sectorLayer };
}

import { GeoJsonLayer } from "@deck.gl/layers";
import { type Feature, type Polygon, type GeoJsonProperties } from "geojson";

/**
 * Creates a Geojson Polygon 'sector' layer
 */
export const createSectorLayer = (data?: Feature<Polygon, GeoJsonProperties>) =>
  new GeoJsonLayer({
    data,
    id: "GeoJsonLayer",
    filled: true,
    getFillColor: [255, 255, 102, 100],
  });

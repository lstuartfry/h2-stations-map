import { GeoJsonLayer } from "@deck.gl/layers";
import { type Feature } from "geojson";

export const createSectorLayer = (data?: Feature) =>
  new GeoJsonLayer({
    data,
    id: "GeoJsonLayer",
    stroked: true,
    filled: true,
    pointType: "circle+text",
    pickable: true,
    getFillColor: [160, 160, 180, 200],
  });

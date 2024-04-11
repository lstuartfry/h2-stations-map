import * as turf from "@turf/helpers";
import turfBoundingBox from "@turf/bbox";
import { LngLatBoundsLike, LngLatLike } from "mapbox-gl";

/**
 * Creates a geojson Point feature from an array of lat/lon coordinates.
 */
const createPoint = (coordinates: LngLatLike) =>
  turf.point(coordinates as [number, number]);

/**
 * Creates a GeoJson FeatureCollection from an array of values containing lat/lon coordinates.
 */
const createFeatureCollection = (collection: LngLatLike[]) => {
  // create a GeoJson Point for each value in the collection
  const points = collection.map((coordinates) => createPoint(coordinates));
  return turf.featureCollection(points);
};

/**
 * Creates a bounding box around a collection of values containing lat/lon coordintes.
 */
export const createBoundingBox = (
  collection: LngLatLike[]
): LngLatBoundsLike => {
  const featureCollection = createFeatureCollection(collection);
  return turfBoundingBox(featureCollection) as LngLatBoundsLike;
};

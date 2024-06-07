import { type FeatureCollection, Feature } from "geojson";
import type { FuelStation } from "@/types";

interface AddressGeocodingFeature extends Feature {
  properties: {
    coordinates: { latitude: number; longitude: number };
  };
}

export interface GetAddressGeocodingResponseData extends FeatureCollection {
  features: AddressGeocodingFeature[];
}

export interface GetFuelStationsResponseData {
  fuel_stations: FuelStation[];
}

"use server";

import axios from "axios";
import type { FuelStation } from "@/types";
import { type FeatureCollection, Feature } from "geojson";

export interface GetFuelStationsResponseData {
  fuel_stations: FuelStation[];
}

interface GeocodingFeature extends Feature {
  properties: {
    bbox: [number, number, number, number];
  };
}

export interface GetZipCodeGeocodingResponseData extends FeatureCollection {
  features: GeocodingFeature[];
}

/**
 * Fetches all active hydrogen stations from NREL.
 * https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/all/
 */
export async function getAvailableH2FuelStations(): Promise<GetFuelStationsResponseData> {
  const response = await axios.get(
    "https://developer.nrel.gov/api/alt-fuel-stations/v1.json",
    {
      params: {
        api_key: process.env.NREL_API_KEY,
        status: "E", // Available
        fuel_type: "HY", // Hydrogen
        hy_is_retail: true, // Retail hydrgoen stations
        state: "CA", // Restrict results to stations within California
      },
    }
  );
  return response.data;
}

/**
 * Fetches Mapbox Geocoding data for a specific U.S. zip code.
 */
export async function getZipCodeBoundingBox(): Promise<GetZipCodeGeocodingResponseData> {
  const response = await axios.get(
    "https://api.mapbox.com/search/geocode/v6/forward",
    {
      params: {
        access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        q: "90035",
        country: "US", // limit results to U.S.
      },
    }
  );
  return response.data;
}

"use server";

import axios from "axios";
import type { FuelStation } from "@/types";
import { type FeatureCollection, Feature } from "geojson";

export interface GetFuelStationsResponseData {
  fuel_stations: FuelStation[];
}

interface AddressGeocodingFeature extends Feature {
  properties: {
    coordinates: { latitude: number; longitude: number };
  };
}

export interface GetAddressGeocodingResponseData extends FeatureCollection {
  features: AddressGeocodingFeature[];
}

interface GetAddressGeocodingResponse {
  data?: GetAddressGeocodingResponseData;
  message?: string;
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
export async function getAddressGeocode(
  _formState: { message?: string },
  formData: FormData
): Promise<GetAddressGeocodingResponse> {
  try {
    const addressNumber = formData.get("addressNumber");
    const street = formData.get("street");
    const zip = formData.get("zip");

    // validate each field
    if (typeof addressNumber !== "string" || addressNumber.length === 0) {
      return { message: "Please enter a valid street number" };
    }

    if (typeof street !== "string" || street.length === 0) {
      return { message: "Please enter a valid street address" };
    }

    if (typeof zip !== "string" || zip.length !== 5) {
      return { message: "Please enter a valid zip code" };
    }

    const response = await axios.get(
      "https://api.mapbox.com/search/geocode/v6/forward",
      {
        params: {
          access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
          address_number: addressNumber,
          street,
          postCode: zip,
          country: "US", // limit results to U.S.
          limit: "1", // limit the results to the most specific result as determined by the mapbox directions API
        },
      }
    );
    return { data: response.data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      {
        return {
          message: error.message,
        };
      }
    } else {
      return {
        message: "error entering address. Please try again",
      };
    }
  }
}

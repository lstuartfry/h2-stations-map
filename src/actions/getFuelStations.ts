"use server";

import axios from "axios";

import { type GetFuelStationsResponseData } from "./types";
/**
 * Fetches all active hydrogen stations from NREL.
 * https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/all/
 */
export async function getFuelStations(): Promise<GetFuelStationsResponseData> {
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

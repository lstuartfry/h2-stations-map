"use server";

import axios from "axios";
import type { FuelStation } from "@/types";

export interface GetFuelStationsResponseData {
  fuel_stations: FuelStation[];
}
/**
 * fetches all active hydrogen stations from NREL.
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
        state: "CA",
      },
    }
  );
  return response.data;
}

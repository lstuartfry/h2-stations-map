"use server";
import axios from "axios";

interface GetFuelStationsResponseData {
  fuel_stations: Array<{
    latitude: number;
    longitude: number;
  }>;
}

/**
 * fetches all active hydrogen stations from NREL.
 * https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/all/
 */
export async function getStations(): Promise<GetFuelStationsResponseData> {
  const response = await axios.get(
    "https://developer.nrel.gov/api/alt-fuel-stations/v1.json",
    {
      params: {
        api_key: process.env.NEXT_PUBLIC_NREL_API_KEY,
        status: "E", // Available
        fuel_type: "HY", // Hydrogen
        hy_is_retail: true, // Retail hydrgoen stations
      },
    }
  );
  return response.data;
}

import { getAvailableH2FuelStations } from "@/actions";
import FuelStationsMap from "@/components/FuelStationsMap";

/**
 * Renders an interactive map showing all available hydrogen stations.
 */
export default async function Home() {
  // Fetch the fuel stations data
  const data = await getAvailableH2FuelStations();
  return <FuelStationsMap fuelStations={data.fuel_stations} />;
}

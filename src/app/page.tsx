import { getFuelStations } from "@/actions";
import FuelStationsMap from "@/components/FuelStationsMap";

/**
 * Root component that fetches fuel station data and passes it to a child component via props.
 */
export default async function Home() {
  const data = await getFuelStations();
  return <FuelStationsMap fuelStations={data.fuel_stations} />;
}

import Link from "next/link";

import { type FuelStation } from "@/types";

/**
 * Renders metadata about the fuel station.
 */
export default function StationInfo({ station }: { station: FuelStation }) {
  return (
    <div className="mt-3 flex flex-col gap-3">
      <span className="text-sm font-semibold">{station.station_name}</span>
      <div>
        See station&apos;s up-to-date fuel status at{" "}
        <Link
          className="text-blue-300"
          target="_blank"
          href={station.hy_status_link}
        >
          h2fcp.org
        </Link>
      </div>
      <div>
        {station.street_address}, {station.zip}
      </div>
      <span>
        <Link className="text-blue-300" href={`tel:${station.station_phone}`}>
          {station.station_phone}
        </Link>
      </span>
    </div>
  );
}

https://github.com/lstuartfry/h2-stations-map/assets/14063740/5654ede4-b05c-4715-8197-87b780809627

## Overview

This application provides users with a map of all active hydrogen fuel stations in their area. Along with the location of the stations, users can see which stations are closest to their current location. Finally, when focusing on a specific station, users can view up-to-date fuel status of the station by following a link to the stations website via the [hydrogen fuel cell partenrship](https://cafcp.org/stationmap).

## Technologies Used

This project is built using the [Next.js](https://nextjs.org/) framework, and utilizes the [H2 Refuel API](https://developer.hydrogenplatform.com/docs/h2-refuel-api-v1-0) to fetch data on hydrogen fuel stations. Once those stations are fetched, the browser's Geolocation API is used to pinpoint the location of the user. Finally, using the user's location as a center point, a [Deck.gl GeoJson 'Sector' layer](https://deck.gl/docs/api-reference/layers/geojson-layer) is created with a default radius of 5 miles. The radius of this layer is used to highlight which stations on the map are closest to the user's location.

## Local development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

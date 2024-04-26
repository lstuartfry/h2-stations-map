This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Overview (WIP)

(04/25/24) This project is a work in progress! I'm currently building out functionality to allow users to choose between inputting their zip code & desired proximity of fuel stations to that zip code, or enabling more precise geolocation features.

The goal of this project is to provide users with an overview of all active hydrogen fuel stations in their area. This project is built using the [Next.js](https://nextjs.org/) framework, and utilizes the [H2 Refuel API](https://developer.hydrogenplatform.com/docs/h2-refuel-api-v1-0) to fetch data on hydrogen fuel stations. It also integrates the [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding) to convert user inputted zip codes into latitude and longitude coordinates and map-friendly bounding boxes.

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

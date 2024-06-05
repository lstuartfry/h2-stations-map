import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "H2 Stations Map",
  description:
    "An interactive map of all active hydrogen stations in California",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

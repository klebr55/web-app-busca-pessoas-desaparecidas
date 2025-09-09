import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./other-styles.css";
import "leaflet/dist/leaflet.css";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import React from "react";
import RouteTransition from "@/components/RouteTransition";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Projeto Prático",
  description: "App Web que consome API de pessoas desaparecidas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-white text-gray-900 transition-colors duration-300`}
      >
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}

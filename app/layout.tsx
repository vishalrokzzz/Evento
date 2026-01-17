import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "../components/LightRays"
import GooeyNav from '../components/GooeyNav'
import Navbar from '../components/NavBar'
import React from "react";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evento",
  description: "Book your event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // const items = [
    //     { label: "Home", href: "/" },
    //     { label: "Events", href: "/events" },
    //     { label: "Create Event", href: "#" },
    // ];
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <header>
          <Navbar></Navbar>

      </header>
      <div className={"absolute inset-0 top-0 z-[-1] min-h-screen"}>
          <LightRays
              raysOrigin="top-center"
              raysColor="#00ffff"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.5}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="custom-rays"
          />
      </div>
      <main>
          {children}
      </main>

      </body>
    </html>
  );
}

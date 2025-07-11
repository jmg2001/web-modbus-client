"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/fontawesome"; // importa la configuración
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { useEffect, useMemo, useState } from "react";
import { useWebSocketStore } from "./stores/useWebSocketStore";
import { useModbusStore } from "./stores/useModbusStore";
import { ModbusData } from "./types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const connectSocket = useWebSocketStore((s) => s.connect);
  useEffect(() => {
    connectSocket();
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 bg-[#121921]">
            {children}
          </main>
          <StatusBar />
        </div>
      </body>
    </html>
  );
}

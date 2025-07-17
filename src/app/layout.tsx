"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/fontawesome"; // importa la configuración
import Sidebar from "./components/Sidebar";
import StatusBar from "./components/StatusBar";
import { Toaster } from "react-hot-toast";
import { WebSocketProvider } from "./context/useWebSocketContext";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebSocketProvider>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6 bg-[#121921]">
              {children}
            </main>
            <StatusBar />
          </div>
          <Toaster position="top-right" reverseOrder={false} />
        </WebSocketProvider>
      </body>
    </html>
  );
}

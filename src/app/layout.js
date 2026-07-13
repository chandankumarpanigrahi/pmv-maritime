"use client";

import { Nunito_Sans, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Maintenance from "@/components/Maintenance/page";
import React, { useState, useEffect } from "react";

// ============================
// 🔧 MAINTENANCE MODE TOGGLE
// Set to `true` to show maintenance page
// Set to `false` to show normal website
// ============================
const MAINTENANCE_MODE = true;

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  const [showMaintenance, setShowMaintenance] = useState(true); // default to true to avoid flash
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (!MAINTENANCE_MODE) {
      setShowMaintenance(false);
      return;
    }

    const checkBypass = () => {
      const bypassExpiry = localStorage.getItem("maintenance_bypass_expiry");
      if (bypassExpiry) {
        const expiryTime = parseInt(bypassExpiry, 10);
        const difference = expiryTime - Date.now();
        if (difference > 0) {
          setShowMaintenance(false);
          // Calculate time left in MM:SS format
          const mins = Math.floor(difference / 60000);
          const secs = Math.floor((difference % 60000) / 1000);
          setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
          return;
        } else {
          localStorage.removeItem("maintenance_bypass_expiry");
        }
      }
      setShowMaintenance(true);
      setTimeLeft("");
    };

    checkBypass();
    const interval = setInterval(checkBypass, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("maintenance_bypass_expiry");
    setShowMaintenance(true);
    window.location.reload();
  };

  if (!isMounted) {
    return (
      <html
        lang="en"
        className={`${nunitoSans.variable} ${oswald.variable} h-full antialiased`}
      >
        <body className="flex flex-col relative bg-sky-950"></body>
      </html>
    );
  }

  const hasBypass = MAINTENANCE_MODE && !showMaintenance && timeLeft;

  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex flex-col relative">
        {showMaintenance ? (
          <Maintenance />
        ) : (
          <>
            {hasBypass && (
              <div className="fixed top-4 right-4 z-[99999] flex items-center gap-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transition-all duration-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Bypass:</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{timeLeft}</span>
                </div>
                <div className="w-px h-3 bg-slate-700"></div>
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
            <Header />
            {children}
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}

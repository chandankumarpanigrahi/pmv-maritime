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
  const [showMaintenance, setShowMaintenance] = useState(MAINTENANCE_MODE);

  useEffect(() => {
    if (!MAINTENANCE_MODE) {
      setShowMaintenance(false);
      return;
    }

    const checkBypass = () => {
      const bypassExpiry = localStorage.getItem("maintenance_bypass_expiry");
      if (bypassExpiry) {
        const expiryTime = parseInt(bypassExpiry, 10);
        if (Date.now() < expiryTime) {
          setShowMaintenance(false);
          return;
        } else {
          localStorage.removeItem("maintenance_bypass_expiry");
        }
      }
      setShowMaintenance(true);
    };

    checkBypass();
    // Periodically verify if bypass has expired
    const interval = setInterval(checkBypass, 1000);
    return () => clearInterval(interval);
  }, []);

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
            <Header />
            {children}
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}

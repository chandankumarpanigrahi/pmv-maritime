"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Maintenance from "@/components/Maintenance/page";
import SmoothScroll from "@/components/SmoothScroll";

export default function ClientLayout({ children, maintenanceMode, showLoader }) {
  const [showMaintenance, setShowMaintenance] = useState(() => {
    // If maintenance mode is off, show the website
    if (!maintenanceMode) return false;

    // Check if client-side bypass is active
    if (typeof window !== "undefined") {
      const bypassExpiry = localStorage.getItem("maintenance_bypass_expiry");
      if (bypassExpiry) {
        const expiryTime = parseInt(bypassExpiry, 10);
        if (Date.now() < expiryTime) {
          return false;
        }
      }
    }
    return true;
  });
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(showLoader);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (!showLoader) return;
    const handleLoad = () => {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      const fallback = setTimeout(handleLoad, 3000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallback);
      };
    }
  }, [showLoader]);

  useEffect(() => {
    if (!showLoader) return;
    if (prevPathname.current !== pathname) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 450);
      prevPathname.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname, showLoader]);

  useEffect(() => {
    if (!maintenanceMode) return;

    const checkBypass = () => {
      const bypassExpiry = localStorage.getItem("maintenance_bypass_expiry");
      if (bypassExpiry) {
        const expiryTime = parseInt(bypassExpiry, 10);
        const difference = expiryTime - Date.now();
        if (difference > 0) {
          setShowMaintenance(false);
          // Calculate time left in MM:SS
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
  }, [maintenanceMode]);

  const handleLogout = () => {
    localStorage.removeItem("maintenance_bypass_expiry");
    setShowMaintenance(true);
    window.location.reload();
  };

  const hasBypass = maintenanceMode && !showMaintenance && timeLeft;

  return (
    <>
      <SmoothScroll />
      {loading && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <img src="/loader.gif" alt="Loading..." className="w-30 h-30 object-contain bg-white/60 p-2 rounded-full" />
        </div>
      )}
      {showMaintenance ? (
        <Maintenance />
      ) : (
        <>
          {hasBypass && (
            <div className="fixed top-4 right-4 z-99999 flex items-center gap-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transition-all duration-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
    </>
  );
}

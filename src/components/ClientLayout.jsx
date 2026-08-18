"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header/page";
import Footer from "@/components/Footer/page";
import Maintenance from "@/components/Maintenance/page";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children, maintenanceMode, showLoader }) {
  const [liveMaintenanceMode, setLiveMaintenanceMode] = useState(maintenanceMode);
  const [showMaintenance, setShowMaintenance] = useState(() => {
    if (!maintenanceMode) return false;
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

  // Poll live maintenance status every 3 seconds to instantly switch mode without page refresh
  useEffect(() => {
    let ignore = false;
    const pollMaintenance = async () => {
      try {
        const res = await fetch("/api/settings/maintenance", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setLiveMaintenanceMode(Boolean(data.isEnabled));
          }
        }
      } catch (err) {
        console.error("Error polling maintenance mode:", err);
      }
    };

    pollMaintenance();
    const interval = setInterval(pollMaintenance, 3000);
    window.addEventListener("focus", pollMaintenance);
    return () => {
      ignore = true;
      clearInterval(interval);
      window.removeEventListener("focus", pollMaintenance);
    };
  }, []);

  useEffect(() => {
    if (!showLoader) return;

    let timer;
    const handleLoad = () => {
      timer = setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      const fallback = setTimeout(() => setLoading(false), 5000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallback);
        clearTimeout(timer);
      };
    }
    return () => clearTimeout(timer);
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
    if (!liveMaintenanceMode) {
      setShowMaintenance(false);
      setTimeLeft("");
      return;
    }

    const checkBypass = () => {
      const bypassExpiry = localStorage.getItem("maintenance_bypass_expiry");
      if (bypassExpiry) {
        const expiryTime = parseInt(bypassExpiry, 10);
        const difference = expiryTime - Date.now();
        if (difference > 0) {
          setShowMaintenance(false);
          const hours = Math.floor(difference / (1000 * 60 * 60));
          const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((difference % (1000 * 60)) / 1000);
          if (hours > 0) {
            setTimeLeft(`${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
          } else {
            setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
          }
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
  }, [liveMaintenanceMode]);

  const handleLogout = () => {
    localStorage.removeItem("maintenance_bypass_expiry");
    setShowMaintenance(true);
  };

  const hasBypass = liveMaintenanceMode && !showMaintenance && timeLeft;

  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 9999999 }} />
      {/* {!isAdmin && <SmoothScroll />} */}
      {loading && (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <img src="/loader.gif" alt="Loading..." className="w-30 h-30 object-contain bg-white/60 p-2 rounded-full" />
        </div>
      )}
      {showMaintenance && !isAdmin ? (
        <Maintenance />
      ) : (
        <>
          {hasBypass && !isAdmin && (
            <div className="fixed bottom-8 right-4 z-99999 flex items-center gap-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transition-all duration-300">
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
          {!isAdmin && <Header />}
          {children}
          {!isAdmin && <Footer />}
        </>
      )}
    </>
  );
}

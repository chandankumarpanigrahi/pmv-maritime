"use client";

import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import Image from "next/image";

import cruiseGif from "../../../public/assets/images/cruise.gif";
import copyrightBg from "../../../public/assets/images/copyright-bg.png";
import heart from "../../../public/assets/images/cc-heart.png";
import brain from "../../../public/assets/images/cc-brain.png";

export default function Copyright() {
  const [activeIcon, setActiveIcon] = useState(0); // 0: heart, 1: brain
  const INTERVAL_TIME = 3000; // Speed control: interchange interval in milliseconds

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev === 0 ? 1 : 0));
    }, INTERVAL_TIME);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container relative max-w-7xl border border-gray-200 mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 py-2">
      <div className="absolute inset-0 z-1 overflow-hidden">
        <Image
          src={copyrightBg}
          alt="Footer Background Image"
          fill
          className="object-cover object-center z-1 scale-101"
          priority
        />
      </div>
      {/* Ship & Slogan */}
      <div className="w-full relative z-5 flex flex-col md:flex-row justify-between items-center gap-4 py-2 md:py-0">
        <div className="flex items-center gap-3">
          <Image src={cruiseGif} alt="Cruise Ship" className="w-10 h-10 object-contain flex-shrink-0" />
          <div className="flex flex-col leading-tight">
            <span className="text-[14px] font-extrabold text-secondary-dark">Work together</span>
            <span className="text-[12px] font-semibold text-gray-500">
              towards a <span className="text-primary font-bold">better tomorrow.</span>
            </span>
          </div>
        </div>

        {/* Copyrights */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs md:text-sm text-secondary font-semibold text-center">
          <span>©2026 PMV Maritime Solutions. All Rights Reserved</span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-1">
            Made with{" "}
            <span className="w-4 h-4 overflow-hidden inline-flex flex-col relative align-middle mx-0.5">
              <span
                className="flex flex-col transition-transform flex-shrink-0"
                style={{
                  transform: activeIcon === 0 ? "translateY(0)" : "translateY(-16px)",
                  transition: "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              >
                <Image src={heart} alt="heart" className="w-4 h-4 object-contain flex-shrink-0" />
                <Image src={brain} alt="brain" className="w-4 h-4 object-contain flex-shrink-0" />
              </span>
            </span>{" "}
            by <a href="https://shoolin.co.uk" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors text-secondary">Shoolin Innovations Ltd.</a>
          </span>
        </div>
      </div>
    </div>
  );
}

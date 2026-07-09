"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Icons
import { LuAnchor, LuCompass, LuShip, LuMapPin, LuPhone } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { TbRadar } from "react-icons/tb";

import mapBg from "../../public/assets/images/map-bg.png";
import bannerAnchor from "../../public/assets/images/banner-anchor.png";

const quickLinks = [
  { label: "Home", href: "/", icon: <LuCompass className="text-lg" /> },
  { label: "About Us", href: "/about", icon: <LuAnchor className="text-lg" /> },
  { label: "Our Services", href: "/services", icon: <LuShip className="text-lg" /> },
  { label: "Contact Us", href: "/contact", icon: <LuPhone className="text-lg" /> },
];

export default function NotFound() {
  // Animated sonar ping effect
  const [pingVisible, setPingVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPingVisible(false);
      setTimeout(() => setPingVisible(true), 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Main 404 Content */}
      <div className="container max-w-7xl mx-auto mt-[140px] flex-grow flex flex-col">

        {/* Hero Section — Full-width deep-sea banner */}
        <div className="w-full bg-gradient-to-br from-sky-950 via-sky-900 to-sky-950 relative overflow-hidden">
          {/* Anchor pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url(${bannerAnchor.src})`,
              backgroundSize: "50px",
              backgroundRepeat: "repeat",
            }}
          ></div>

          {/* Subtle map overlay */}
          <div className="absolute inset-0 opacity-[0.06]">
            <Image
              src={mapBg}
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>

          {/* Content Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: 404 Message */}
            <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-16 md:py-24">
              {/* Status badge */}
              <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 bg-white/8 backdrop-blur-md text-white/80 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/10">
                Signal Lost
              </div>

              {/* Giant 404 */}
              <h1 className="font-oswald text-[120px] md:text-[160px] lg:text-[200px] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/30 to-white/5 select-none tracking-tighter">
                404
              </h1>

              {/* Headline */}
              <h2 className="font-oswald text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight -mt-4 md:-mt-6">
                Page Not Found<span className="text-primary">.</span>
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-4 max-w-md">
                The coordinates you&apos;re navigating to don&apos;t match any charted route. This page may have been decommissioned, relocated, or never existed in our fleet registry.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold text-[13px] px-6 py-3 uppercase tracking-wider transition-all duration-300 shadow-lg"
                  id="not-found-return-home"
                >
                  Return to Home
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 border border-white/30 hover:bg-white/10 text-white font-bold text-[13px] px-6 py-3 uppercase tracking-wider transition-all duration-300"
                  id="not-found-contact"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right: Visual / Radar Animation */}
            <div className="hidden md:flex items-center justify-center relative py-16">
              {/* Radar container */}
              <div className="relative w-[320px] h-[320px] lg:w-[380px] lg:h-[380px]">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-white/10"></div>
                {/* Middle ring */}
                <div className="absolute inset-[15%] rounded-full border border-white/10"></div>
                {/* Inner ring */}
                <div className="absolute inset-[30%] rounded-full border border-white/10"></div>
                {/* Center ring */}
                <div className="absolute inset-[45%] rounded-full border border-white/15"></div>

                {/* Cross hairs */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/8"></div>
                <div className="absolute left-0 right-0 top-1/2 h-px bg-white/8"></div>

                {/* Rotating radar sweep */}
                <div className="absolute overflow-hidden inset-0 rounded-full animate-[spin_4s_linear_infinite]">
                  <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
                    style={{
                      background: "linear-gradient(to right, rgba(173,29,65,0.9), transparent)",
                    }}
                  ></div>
                  {/* Sweep glow */}
                  <div
                    className="absolute top-0 left-0 w-full h-full origin-top-left"
                    style={{
                      background: "conic-gradient(from 0deg, rgba(173,29,65,0.6), transparent 60deg)",
                      borderRadius: "0 0 100% 0",
                    }}
                  ></div>
                </div>

                {/* Ping blips */}
                <div className={`absolute top-[22%] left-[38%] w-2 h-2 rounded-full bg-primary/80 shadow-[0_0_8px_rgba(173,29,65,0.5)] transition-opacity duration-500 ${pingVisible ? "opacity-100" : "opacity-0"}`}></div>
                <div className={`absolute top-[58%] left-[68%] w-1.5 h-1.5 rounded-full bg-secondary/80 shadow-[0_0_8px_rgba(0,123,167,0.5)] transition-opacity duration-700 ${pingVisible ? "opacity-80" : "opacity-0"}`}></div>
                <div className={`absolute top-[72%] left-[32%] w-1 h-1 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-opacity duration-300 ${pingVisible ? "opacity-60" : "opacity-0"}`}></div>

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_rgba(173,29,65,0.6)]">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40"></div>
                </div>

                {/* "No Signal" label */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-white/40 font-semibold font-oswald">
                  No Signal Detected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation Grid */}
        <div className="w-full border border-t-0 border-gray-200">
          {/* Section header */}
          <div className="px-6 md:px-10 py-5 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <LuCompass className="text-secondary text-xl" />
              <div>
                <h3 className="font-oswald text-lg font-bold text-gray-900 tracking-wide">
                  Navigate to Safe Waters
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Select a destination to chart your course back
                </p>
              </div>
            </div>
          </div>

          {/* Navigation grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                id={`not-found-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="group bg-white flex flex-col items-center justify-center gap-3 py-8 px-4 text-center hover:bg-secondary/[0.03] transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                {/* Icon container */}
                <div className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-secondary flex items-center justify-center text-gray-400 group-hover:text-secondary transition-all duration-300">
                  {link.icon}
                </div>

                {/* Label */}
                <span className="text-sm font-bold text-gray-700 group-hover:text-secondary-dark uppercase tracking-wide transition-colors duration-300">
                  {link.label}
                </span>

                {/* Arrow */}
                <FaArrowRight className="hidden md:block text-xs text-gray-300 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom info bar — Vessel status report style */}
        <div className="w-full border border-t-0 border-gray-200 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
            {[
              { label: "Error Code", value: "404" },
              { label: "Status", value: "Route Not Found" },
              { label: "Protocol", value: "HTTP/1.1" },
              { label: "Action Required", value: "Redirect" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white px-5 py-4 flex flex-col"
              >
                <span className="text-center md:text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                  {item.label}
                </span>
                <span className="text-center md:text-left text-sm font-bold text-secondary-dark mt-0.5 font-oswald tracking-wide">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

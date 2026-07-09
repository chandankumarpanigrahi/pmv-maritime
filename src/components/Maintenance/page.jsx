import React from "react";
import Image from "next/image";
import { LuMail, LuPhone, LuAnchor } from "react-icons/lu";

import logo from "../../../public/assets/images/logo-light.png";
import bannerAnchor from "../../../public/assets/images/banner-anchor.png";

export default function Maintenance() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-sky-950 via-sky-900 to-sky-950 flex items-center justify-center overflow-hidden">

      {/* Anchor pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url(${bannerAnchor.src})`,
          backgroundSize: "50px",
          backgroundRepeat: "repeat",
        }}
      ></div>

      {/* Animated wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" aria-hidden="true">
        <svg className="w-full h-28 md:h-36 opacity-10" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill="currentColor" className="text-sky-400">
            <animate attributeName="d" dur="8s" repeatCount="indefinite"
              values="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z;
                      M0,80 C240,20 480,100 720,40 C960,100 1200,20 1440,80 L1440,120 L0,120 Z;
                      M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            />
          </path>
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-20 md:h-28 opacity-[0.06]" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,80 C360,20 720,100 1080,40 C1260,20 1380,60 1440,80 L1440,120 L0,120 Z" fill="currentColor" className="text-sky-300">
            <animate attributeName="d" dur="6s" repeatCount="indefinite"
              values="M0,80 C360,20 720,100 1080,40 C1260,20 1380,60 1440,80 L1440,120 L0,120 Z;
                      M0,40 C360,100 720,20 1080,80 C1260,100 1380,40 1440,40 L1440,120 L0,120 Z;
                      M0,80 C360,20 720,100 1080,40 C1260,20 1380,60 1440,80 L1440,120 L0,120 Z"
            />
          </path>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <Image src={logo} alt="PMV Maritime Solutions Logo" className="w-14 h-20 object-contain" />
          <div className="flex flex-col text-left">
            <h3 className="font-oswald text-2xl md:text-3xl font-bold text-white tracking-wide leading-none">
              <span className="text-sky-100">PMV</span> Maritime <br />
              <span className="text-sky-100">Solutions</span><span className="text-primary">.</span>
            </h3>
          </div>
        </div>

        {/* Heading */}
        <h1 className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          We&apos;re Under<br />Maintenance<span className="text-primary">.</span>
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-sm md:text-base leading-relaxed mt-5 max-w-md">
          Our systems are currently undergoing scheduled maintenance to serve you better. We&apos;ll be back online shortly. Thank you for your patience.
        </p>

        {/* Divider line */}
        <div className="w-16 h-[2px] bg-primary my-8"></div>

        {/* Contact info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-white/70 text-sm">
          <a
            href="mailto:info@pmvmaritime.com"
            className="flex items-center gap-2 hover:text-white transition-colors duration-300"
          >
            <LuMail className="text-white/50 text-base" />
            <span className="font-semibold">info@pmvmaritime.com</span>
          </a>
          <div className="hidden sm:block w-px h-4 bg-white/20"></div>
          <a
            href="tel:+971505342726"
            className="flex items-center gap-2 hover:text-white transition-colors duration-300"
          >
            <LuPhone className="text-white/50 text-base" />
            <span className="font-semibold">+97 15053 42726</span>
          </a>
        </div>

        {/* Bottom copyright */}
        <p className="text-white/30 text-xs mt-12 font-medium">
          &copy; {new Date().getFullYear()} PMV Maritime Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}

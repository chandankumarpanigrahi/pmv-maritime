import React from "react";
import styles from "./style.module.css";
import Link from "next/link";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { LuShip, LuAnchor, LuGlobe, LuAward, LuCompass } from "react-icons/lu";

const statsData = [
  {
    icon: <LuShip size={35} className="text-white opacity-60" />,
    number: "20",
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: <LuAnchor size={35} className="text-white opacity-60" />,
    number: "120",
    suffix: "+",
    label: "Vessels Managed",
  },
  {
    icon: <LuGlobe size={35} className="text-white opacity-60" />,
    number: "5",
    suffix: "+",
    label: "Global Hubs",
  },
  {
    icon: <LuAward size={35} className="text-white opacity-60" />,
    number: "30",
    suffix: "+",
    label: "Clients Served",
  },
  {
    icon: <LuCompass size={35} className="text-white opacity-60" />,
    number: "10",
    suffix: "+",
    label: "Industry Recognition",
  },
];

export default function Hero() {
  return (
    <div className="relative w-full h-full md:h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBg}
      >
        <source src="/video/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={styles.overlay}></div>
      <div className="hidden md:grid absolute z-11 inset-0 w-full h-full grid-cols-1 md:grid-cols-5 gap-6 mb-16 lg:mb-24 container max-w-7xl mx-auto opacity-10">
        <div className="h-full border-l border-sky-100"></div>
        <div className="h-full border-l border-sky-100"></div>
        <div className="h-full border-l border-sky-100"></div>
        <div className="h-full border-l border-sky-100"></div>
        <div className="h-full border-l border-r border-sky-100"></div>
      </div>

      <div className={`${styles.content} container max-w-7xl mx-auto px-4 sm:px-12 lg:px-0 flex flex-col justify-between`}>

        <div className="flex flex-col items-center mb-8 md:mb-0 md:items-start max-w-4xl mt-16 md:mt-auto">
          <div className="inline-flex w-fit items-center gap-2 px-3 py-2 bg-white/8 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-2">
            Your Maritime Partner
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-oswald text-white font-extrabold leading-tight tracking-tight text-center md:text-left uppercase ">
            Maritime Excellence
          </h1>

          {/* Subtitle */}
          <p className="text-[14px] text-center md:text-left sm:text-md md:text-lg text-slate-200/95 leading-relaxed mb-3 md:mb-8 max-w-xl">
            Setting the global standard for maritime safety, logistics, and innovation. Our integrated services power the world&apos;s most critical ocean-bound operations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col w-fit md:flex-row gap-2 md:gap-4 items-center">
            <Link
              href="/services"
              className="group flex gap-5 items-center pl-3 md:pl-5 pr-2 md:pr-4 py-1.5 md:py-2 bg-secondary hover:bg-secondary-dark text-white font-bold border border-secondary hover:border-secondary-dark tracking-wider uppercase rounded shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore Services <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
            </Link>
            <Link
              href="/contact"
              className="flex gap-5 items-center pl-3 md:pl-5 pr-2 md:pr-4 py-1.5 md:py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold tracking-wider uppercase rounded backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Feature/Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-8 mb-3 lg:mb-6 mt-auto">
          {statsData.map((stat, index) => (
            <div key={index} className="w-full flex flex-col items-center text-center md:items-start md:text-left gap-0 md:gap-2 px-2 md:px-8 last:col-span-2 md:last:col-span-1">
              {stat.icon}
              <div className="text-5xl md:text-6xl font-oswald text-white mt-3 md:mt-0">
                {stat.number}
                <span className="text-primary pl-1">{stat.suffix}</span>
              </div>
              <p className="text-white/60 uppercase tracking-wide max-w-[90%] md:max-w-none text-[12px] md:text-sm font-semibold mt-2 md:mt-0">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}



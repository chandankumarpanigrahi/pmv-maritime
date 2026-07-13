"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubBanner from "@/components/Sub Banner/page";
import Link from "next/link";
import Image from "next/image";
import ContactUs from "@/components/Contact Us/page";
import SubHeading from "@/design/sub-heading/page";
import { LuClock, LuPhoneCall, LuGlobe, LuShieldCheck, LuUserCheck } from "react-icons/lu";

// Static Asset Imports
import worldMap from "../../../public/assets/svg/world-map.svg";
import locationPin from "../../../public/assets/images/location-pin.png";

// City
import cityImage0 from "../../../public/assets/city/city-photo-0.png";
import cityImage1 from "../../../public/assets/city/city-photo-1.png";
import cityImage2 from "../../../public/assets/city/city-photo-2.png";
import cityImage3 from "../../../public/assets/city/city-photo-3.png";
import cityImage4 from "../../../public/assets/city/city-photo-4.png";
import cityImage5 from "../../../public/assets/city/city-photo-5.png";
import cityImage6 from "../../../public/assets/city/city-photo-6.png";

export default function Contact() {
  const highlights = [
    {
      icon: <LuClock className="text-2xl md:text-4xl" />,
      title: <>Global<br />Support</>,
      description: "We're here for you anytime, anywhere.",
      bg: "bg-white",
    },
    {
      icon: <LuPhoneCall className="text-2xl md:text-4xl" />,
      title: <>Quick<br />Response</>,
      description: "Our team responds quickly to all inquiries.",
      bg: "bg-primary/[0.03]",
    },
    {
      icon: <LuGlobe className="text-2xl md:text-4xl" />,
      title: <>Worldwide<br />Presence</>,
      description: "Offices and partners across 5 continents.",
      bg: "bg-white",
    },
    {
      icon: <LuShieldCheck className="text-2xl md:text-4xl" />,
      title: <>Trusted<br />Partners</>,
      description: "Building long-term relationships worldwide.",
      bg: "bg-primary/[0.03]",
    },
    {
      icon: <LuUserCheck className="text-2xl md:text-4xl" />,
      title: <>Client<br />Focused</>,
      description: "Your success is our commitment.",
      bg: "bg-white",
    },
  ];

  return (
    <>
      <SubBanner Heading="Contact Us" breadcrumbItems={[{ label: "About Us", href: "/about" }]} />

      {/* Highlights Section */}
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative border-t-0 border border-gray-200">
        {highlights.map((item, index) => (
          <div
            key={index}
            className={`flex-1 flex items-start gap-3 px-4 md:px-5 py-4 md:py-7 ${item.bg} border-b md:border-b-0 md:border-r md:border-t-0 border-gray-200 last:border-0 last:border-b-0`}
          >
            <div className="flex-shrink-0 -translate-y-1 text-primary w-12 h-12 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-secondary leading-[1.2] mb-1">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>


      {/* Global Presence Section */}
      <div className="container max-w-7xl mx-auto border-t-0 border border-gray-200 bg-white">
        <section className="px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

            {/* Left Content Column */}
            <div className="lg:col-span-5 flex flex-col justify-between py-2">
              <div>
                <SubHeading title="GLOBAL PRESENCE" className="mb-4" />
                <h2 className="font-oswald text-3xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                  We&apos;re Wherever<br />
                  <span className="text-secondary-dark">You Need Us</span>
                  <span className="text-primary">.</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-base font-medium mt-6 leading-relaxed max-w-md">
                  With offices and partners strategically located around the world, we are always close to our clients and ready to deliver maritime excellence.
                </p>
              </div>

              {/* Statistics Grid (Inside Left Column) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
                <div>
                  <span className="block text-2xl md:text-3xl font-bold text-primary">6+</span>
                  <span className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Countries</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-bold text-primary">15+</span>
                  <span className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Global Branches</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-bold text-primary">100+</span>
                  <span className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Partners</span>
                </div>
                <div>
                  <span className="block text-2xl md:text-3xl font-bold text-primary">500+</span>
                  <span className="text-[11px] md:text-xs text-gray-500 font-bold uppercase tracking-wider block mt-1">Clients Worldwide</span>
                </div>
              </div>
            </div>

            {/* Right Map Column */}
            <div className="lg:col-span-7 relative w-full flex items-center">
              {/* Map Wrapper with Horizontal Scroll on Mobile */}
              <div className="w-full scale-120 translate-x-[-30px]">
                {/* h-auto container matching image height to keep absolute pins locked in place */}
                <div className="relative min-w-[768px] lg:min-w-0 w-full">
                  {/* World Map SVG Background */}
                  <Image
                    src={worldMap}
                    alt="World Map"
                    className="w-full h-auto opacity-90 select-none pointer-events-none block"
                  />

                  {/* Pins & Tooltips */}
                  {[
                    { id: "canada", city: "Toronto", country: "Canada", top: "20%", left: "13%", image: cityImage0 },
                    { id: "uk", city: "London", country: "UK", top: "25%", left: "46.2%", image: cityImage1 },
                    { id: "india", city: "Bhubaneswar", country: "India", top: "46%", left: "69%", image: cityImage2 },
                    { id: "lagos", city: "Lagos", country: "Africa (Nigeria)", top: "52%", left: "47%", image: cityImage3 },
                    { id: "uae", city: "Dubai", country: "UAE", top: "40%", left: "61%", image: cityImage4, isHQ: true },
                    { id: "netherlands", city: "Rotterdam", country: "Netherlands", top: "30%", left: "52.5%", image: cityImage5 },
                    { id: "australia", city: "Malvern", country: "Australia", top: "71%", left: "86%", image: cityImage6 }
                  ].map((loc) => (
                    <div
                      key={loc.id}
                      className="absolute group z-10 hover:z-50"
                      style={{ top: loc.top, left: loc.left }}
                    >
                      {/* Custom Tooltip Card */}
                      <div className="absolute bottom-[140%] left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl rounded-sm border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-200 pointer-events-none">
                        <div className="relative h-20 w-full bg-gray-100">
                          <Image
                            src={loc.image}
                            alt={loc.city}
                            fill
                            className="object-cover"
                          />
                          {loc.isHQ && (
                            <span className="absolute top-2 right-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                              Head Office
                            </span>
                          )}
                        </div>
                        <div className="p-3 flex items-center gap-2.5">
                          <Image
                            src={locationPin}
                            alt="Pin"
                            className="w-4 h-5 object-contain"
                          />
                          <div>
                            <h4 className="text-secondary font-bold text-sm leading-tight">{loc.city}</h4>
                            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">{loc.country}</p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Location Marker */}
                      <div className="flex flex-row items-center cursor-pointer">
                        {/* Pulsing Pin Ring */}
                        <div className="relative flex items-center justify-center">
                          <span className="absolute inline-flex h-6 w-6 rounded-full bg-primary/20 animate-ping"></span>
                          <Image
                            src={locationPin}
                            alt="Location Pin"
                            className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                          />
                        </div>

                        {/* Location Label */}
                        <div className="whitespace-nowrap">
                          <p className="text-[11px] font-bold text-gray-800 leading-tight">
                            {loc.country}{loc.isHQ && <span className="text-secondary-dark text-[10px] font-bold ml-1">(HQ)</span>}
                          </p>
                          <p className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">{loc.city}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Contact Form Section */}
      <ContactUs />
    </>
  );
}
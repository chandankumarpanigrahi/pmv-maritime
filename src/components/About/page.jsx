"use client";

import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css"

// Icons
import { FaArrowRight } from "react-icons/fa";
import { LuShipWheel } from "react-icons/lu";

import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

// Icon Image
import icon1 from "../../../public/icons/shield.png";
import icon2 from "../../../public/icons/support.png";
import icon3 from "../../../public/icons/leaf.png";
import icon4 from "../../../public/icons/user.png";


const images = [image1, image2, image3];

const serviceHighlights = [
  {
    icon: icon1,
    title: "98%",
    description: "On time Service Delivery",
  },
  {
    icon: icon2,
    title: "24/7",
    description: "Operational Support",
  },
  {
    icon: icon3,
    title: "150",
    description: "Lower Carbon Footprint",
  },
  {
    icon: icon4,
    title: "200+",
    description: "Experts & Professionals",
  },
];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch">
      <div className="w-full md:w-5/12 flex flex-col border border-gray-200">
        <div className="flex flex-col pt-8 px-4 md:px-8 pb-4 border-b border-gray-200">
          <SubHeading title="About Us" className="mb-4 md:mb-8" />

          <h1 className="font-oswald text-3xl md:text-4xl text-sky-700 font-bold mb-5 md:mb-8">
            Beyond the<br />
            <span className="text-sky-900">Maritime Services<span className="text-primary">.</span></span> <br />
            Advancing Maritime Possibilities<span className="text-primary">.</span>
          </h1>

          <p className="text-sm md:text-[16px] text-gray-600 font-medium">
            <span className="text-gray-800 font-bold">PMV Maritime Solutions</span>{" "}delivers integrated solutions across vessel management, crewing, marine services, consultancy, shipbuilding, technical management, and maritime projects. We support shipowners and operators with practical expertise and tailored solutions that strengthen operational excellence.
          </p>
        </div>

        <div className="flex flex-col gap-5 py-4 px-4 md:px-8">
          <div className="flex flex-row gap-4">
            <LuShipWheel className="text-primary" size={50} />
            <p className="text-sm md:text-[15px] w-full md:w-[90%] text-gray-900">
              Built on experience, driven by innovation, and trusted at sea, we deliver safe, efficient, compliant, and sustainable maritime solutions.
            </p>
          </div>

          <Link
            href="/services"
            className="group w-fit text-[14px] flex gap-5 items-center pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-primary hover:bg-primary-hover text-white font-bold tracking-wider uppercase shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Services{" "}
            <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
          </Link>
        </div>
      </div>
      <div className="w-full md:w-4/12 h-[400px] md:h-auto relative overflow-hidden">
        {images.map((img, idx) => (
          <Image
            key={idx}
            src={img}
            alt={`about-image-${idx + 1}`}
            fill
            priority={idx === 0}
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === activeIndex ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        {/* Overlay */}
        {/* <div className="absolute inset-0 bg-sky-600/10 pointer-events-none"></div> */}

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-white/40 backdrop-blur-md p-1.5 border border-white/10 rounded-full">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${idx === activeIndex
                ? "w-8 h-3 bg-primary"
                : "w-3 h-3 bg-white/70 hover:bg-white"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row flex-wrap md:flex-col w-full md:w-3/12 h-fit md:h-auto border border-gray-200">
        {serviceHighlights.map((highlight, index) => (
          <div key={index} className={`${styles.numberCardsArea} flex h-[120px] md:h-1/4 px-4 py-5 md:py-0 justify-start items-center border-r border-b border-gray-200 last:border-b-0`}>
            <div className="flex flex-row gap-2">
              <Image
                src={highlight.icon}
                alt={`icon-image-${index + 1}`}
                className="w-[64px] h-[64px] px-0.5 object-contain"
              />
              <div className="w-full flex flex-col gap-2">
                <h1 className="font-oswald text-4xl md:text-5xl text-sky-700 font-bold pt-1">{highlight.title}</h1>
                <p className="text-[12px] md:text-[13px] text-gray-600 font-medium uppercase leading-tight wrap-break-word">{highlight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}

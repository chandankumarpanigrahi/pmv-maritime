"use client";

import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { LuShipWheel } from "react-icons/lu";

// Images
import image1 from "../../../public/Images/about-image-1.jpg";
import image2 from "../../../public/Images/about-image-2.jpg";
import image3 from "../../../public/Images/about-image-3.jpg";

const images = [image1, image2, image3];

export default function About() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row container mx-auto items-stretch">
      <div className="w-full md:w-5/12 flex flex-col border border-gray-200">
        <div className="flex flex-col pt-8 px-4 md:px-8 pb-4 border-b border-gray-200">
          <SubHeading title="About Us" />
          <h1 className="font-oswald text-4xl md:text-5xl text-sky-700 font-bold mb-5 md:mb-8">Beyond the <br /><span className="text-sky-900"> Maritime Services</span> <br /> and Operations<span className="text-rose-700">.</span></h1>
          <p className="text-md md:text-lg text-gray-600 font-medium"><span className="text-gray-800 font-bold">PMV Maritime</span> operates at the intersection of technical precision and visionary management. We don&apos;t just move cargo; we curate the flow of global commerce with a commitment to sustainability and digital-first operations.</p>
        </div>
        <div className="flex flex-col gap-5 py-4 px-4 md:px-8">
          <div className="flex flex-row gap-4">
            <LuShipWheel className="text-rose-700" size={50} />
            <p className="text-sm md:text-[17px] w-full md:w-[90%] text-gray-900">We combine expertise, technology and global reach to deliver safe, efficient and sustainable maritime solutions.</p>
          </div>
          <Link
            href="/services"
            className="group w-fit text-[14px] flex gap-5 items-center pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold tracking-wider uppercase rounded shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Services <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
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
                ? "w-8 h-3 bg-rose-700"
                : "w-3 h-3 bg-white/70 hover:bg-white"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="hidden md:block md:w-3/12"></div>
    </div>
  );
}

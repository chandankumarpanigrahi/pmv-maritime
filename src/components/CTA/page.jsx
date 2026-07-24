import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { TbPhone } from "react-icons/tb";
import ctaBg from "../../../public/assets/images/cta-bg.png";
import mapBg from "../../../public/assets/images/map-bg-light.png";

export default function CTA() {
  return (
    <div className="w-full container max-w-7xl mx-auto relative bg-sky-950 text-white overflow-hidden py-12 md:py-16 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ctaBg}
          alt="Let's power your maritime success"
          fill
          className="object-cover object-left md:object-right"
          priority
        />
        {/* Deep blue/gradient overlay for contrast and text readability on left side */}
        <div className="hidden absolute inset-0 bg-gradient-to-r from-sky-950/95 via-sky-950/60 to-transparent z-1"></div>
      </div>

      {/* Content Container */}
      <div className="container max-w-7xl mx-auto px-4 md:px-16 relative z-10">
        <div className="w-full md:max-w-2xl lg:max-w-3xl flex flex-col items-start text-left relative">
          <div className="relative z-3">
            {/* Subtitle */}
            <span className="text-xs font-oswald md:text-sm uppercase text-white/70 tracking-wider mb-1 block">
              READY TO MOVE FORWARD?
            </span>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-oswald font-medium leading-12 md:leading-16 tracking-tight mb-5">
              Let&apos;s accelerate your<br />
              maritime success<span className="text-primary">.</span>
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-sm md:text-base lg:text-[16px] leading-normal max-w-xl mb-8">
              From strategic advisory to dependable operations, PMV Maritime Solutions Limited delivers integrated solutions that help your business move with greater safety, efficiency, confidence, and sustainability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
              {/* Get a Quote Button */}
              <Link
                href="/contact?type=quote"
                className="group/btn inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary-hover text-white font-bold text-[14px] px-6 py-3 uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer w-full sm:w-auto"
              >
                Get a Quote
                <FaArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>

              {/* Talk to an Expert Button */}
              <Link
                href="tel:+971505342726"
                className="inline-flex items-center justify-center gap-3 border border-white hover:bg-white hover:text-sky-950 text-white font-bold text-[14px] px-6 py-3 uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer w-full sm:w-auto"
              >
                <TbPhone className="text-lg" />
                Talk to an Expert
              </Link>
            </div>
          </div>

          <div className="absolute inset-0 w-full z-2">
            <Image
              src={mapBg}
              alt="Map Design"
              fill
              className="object-cover object-center opacity-60"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

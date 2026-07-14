"use client";

import styles from "./style.module.css";
import React, { useState, useEffect, useRef } from "react";
import SubBanner from "@/components/Sub Banner/page";
import Link from "next/link";
import Image from "next/image";
import ContactUs from "@/components/Contact Us/page";
import SubHeading from "@/design/sub-heading/page";
import {
  LuClock,
  LuPhoneCall,
  LuGlobe,
  LuShieldCheck,
  LuUserCheck,
  LuMapPin,
  LuPhone,
  LuMail,
  LuMessageSquare,
  LuFileText,
  LuShip
} from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

// Static Asset Imports
import worldMap from "../../../public/assets/svg/world-map.svg";
import locationPin from "../../../public/assets/images/location-pin.png";
import bannerBg from "../../../public/assets/images/map-bg.png";

// City
import cityImage0 from "../../../public/assets/city/city-photo-0.png";
import cityImage1 from "../../../public/assets/city/city-photo-1.png";
import cityImage2 from "../../../public/assets/city/city-photo-2.png";
import cityImage3 from "../../../public/assets/city/city-photo-3.png";
import cityImage4 from "../../../public/assets/city/city-photo-4.png";
import cityImage5 from "../../../public/assets/city/city-photo-5.png";
import cityImage6 from "../../../public/assets/city/city-photo-6.png";

export default function Contact() {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [visibleIndices, setVisibleIndices] = useState([0, 1, 2, 3]);

  const offices = [
    {
      city: "Dubai (HQ)",
      country: "UAE",
      address: "IFZA Properties, Dubai Silicon Oasis, UAE",
      phone: "+971 50 534 2726",
      email: "info@pmvmaritime.com",
      image: cityImage4,
      isHQ: true,
    },
    {
      city: "Lagos",
      country: "AFRICA (NIGERIA)",
      address: "Plot 1649, Olosa Street, Victoria Island, Lagos",
      phone: "+234 1 461 4100",
      email: "africa@pmvmaritime.com",
      image: cityImage3,
    },
    {
      city: "Bhubaneswar",
      country: "INDIA",
      address: "The Maritime Hub, Sai Vihar, Bhubaneswar, Odisha 751007",
      phone: "+91 674 254 3000",
      email: "india@pmvmaritime.com",
      image: cityImage2,
    },
    {
      city: "London",
      country: "UNITED KINGDOM",
      address: "30 St Mary Axe, London EC3A 8BF",
      phone: "+44 20 722 7000",
      email: "uk@pmvmaritime.com",
      image: cityImage1,
    },
    {
      city: "Rotterdam",
      country: "NETHERLANDS",
      address: "Wilhelminakade 123, 3072 AP Rotterdam",
      phone: "+31 10 441 5678",
      email: "netherlands@pmvmaritime.com",
      image: cityImage5,
    },
    {
      city: "Toronto",
      country: "CANADA",
      address: "100 King Street West, Toronto, ON M5X 1B1",
      phone: "+1 416 862 7000",
      email: "canada@pmvmaritime.com",
      image: cityImage0,
    },
    {
      city: "Malvern",
      country: "AUSTRALIA",
      address: "Level 15, 60 Margaret St, Malvern, NSW 2000",
      phone: "+61 2 9056 4070",
      email: "australia@pmvmaritime.com",
      image: cityImage6,
    },
  ];

  const steps = [
    {
      title: "Submit Inquiry",
      description: "Send us your requirements via our online form, email, or direct line. Our global intake team responds within 24 hours.",
      icon: <LuMail className="text-2xl" />,
    },
    {
      title: "Technical Assessment",
      description: "Our maritime consultants analyze your request, evaluate operational feasibility, and schedule a scoping call.",
      icon: <LuMessageSquare className="text-2xl" />,
    },
    {
      title: "Custom Proposal",
      description: "We draft a detailed strategy, commercial quote, and resource allocation plan tailored to your specific goals.",
      icon: <LuFileText className="text-2xl" />,
    },
    {
      title: "Project Execution",
      description: "Upon approval, our regional team is deployed, ensuring safety, compliance, and flawless operational delivery.",
      icon: <LuShip className="text-2xl" />,
    },
  ];

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;

      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);

      const firstChild = carouselRef.current.firstElementChild;
      if (firstChild) {
        const cardWidth = firstChild.offsetWidth;
        const indices = [];
        for (let i = 0; i < offices.length; i++) {
          const cardLeft = i * cardWidth;
          if (cardLeft >= scrollLeft - 10 && cardLeft + cardWidth <= scrollLeft + clientWidth + 10) {
            indices.push(i);
          }
        }
        setVisibleIndices(indices);
      }
    }
  };

  useEffect(() => {
    const carouselEl = carouselRef.current;
    if (carouselEl) {
      handleScroll();
      carouselEl.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (carouselEl) {
        carouselEl.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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
      <SubBanner Heading="Contact Us" breadcrumbItems={[{ label: "Contact Us", href: "/contact" }]} />

      {/* Highlights Section */}
      <div className="flex flex-col lg:flex-row container max-w-7xl mx-auto items-stretch relative border-t-0 border border-gray-200">
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
      <div className="container overflow-hidden lg:overflow-visible max-w-7xl mx-auto border-t-0 border border-gray-200 bg-white">
        <section className="px-6 md:p-10 lg:p-12">
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
              <div className="flex flex-row flex-wrap gap-0 md:gap-8 mt-3 md:mt-10">
                <div className="w-1/2 md:w-fit flex flex-col justify-center items-start md:items-center mb-3 md:mb-0">
                  <span className="block text-2xl md:text-3xl font-black text-primary">6+</span>
                  <span className="text-[11px] md:text-[13px] text-gray-500 font-semibold tracking-wider block mt-0 md:mt-1">Countries</span>
                </div>
                <div className="w-1/2 md:w-fit flex flex-col justify-center items-start md:items-center mb-3 md:mb-0">
                  <span className="block text-2xl md:text-3xl font-black text-primary">15+</span>
                  <span className="text-[11px] md:text-[13px] text-gray-500 font-semibold tracking-wider block mt-0 md:mt-1">Global Branches</span>
                </div>
                <div className="w-1/2 md:w-fit flex flex-col justify-center items-start md:items-center">
                  <span className="block text-2xl md:text-3xl font-black text-primary">100+</span>
                  <span className="text-[11px] md:text-[13px] text-gray-500 font-semibold tracking-wider block mt-0 md:mt-1">Partners</span>
                </div>
                <div className="w-1/2 md:w-fit flex flex-col justify-center items-start md:items-center">
                  <span className="block text-2xl md:text-3xl font-black text-primary">500+</span>
                  <span className="text-[11px] md:text-[13px] text-gray-500 font-semibold tracking-wider block mt-0 md:mt-1">Clients Worldwide</span>
                </div>
              </div>
            </div>

            {/* Right Map Column */}
            <div className="hidden lg:col-span-7 relative w-full md:flex items-center">
              {/* Map Wrapper with Horizontal Scroll on Mobile */}
              <div className="w-full scale-100 md:scale-120 translate-x-[-30px]">
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

      {/* Carousel for all Offices */}
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 -top-1/2"
        />
        <div className="w-full flex flex-row justify-between border border-t-0 border-gray-200">
          <div className="flex flex-col md:flex-row py-6 px-4 md:px-8">
            <div className="flex flex-row w-full items-center justify-between">
              <SubHeading title="Our Global BRANCHES" />
            </div>
          </div>
          <div className="flex flex-row gap-8 py-3 md:py-0 px-4 md:px-8 relative z-10 items-center">
            <button
              onClick={() => {
                if (carouselRef.current) {
                  const firstChild = carouselRef.current.firstElementChild;
                  if (firstChild) {
                    carouselRef.current.scrollBy({ left: -firstChild.offsetWidth, behavior: "smooth" });
                  }
                }
              }}
              disabled={!canScrollLeft}
              className={`text-2xl font-semibold transition-colors duration-200 ${canScrollLeft
                ? "text-secondary hover:text-secondary-dark cursor-pointer"
                : "text-secondary/40 pointer-events-none"
                }`}
              aria-label="Previous branches"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => {
                if (carouselRef.current) {
                  const firstChild = carouselRef.current.firstElementChild;
                  if (firstChild) {
                    carouselRef.current.scrollBy({ left: firstChild.offsetWidth, behavior: "smooth" });
                  }
                }
              }}
              disabled={!canScrollRight}
              className={`text-2xl font-semibold transition-colors duration-200 ${canScrollRight
                ? "text-secondary hover:text-secondary-dark cursor-pointer"
                : "text-secondary/40 pointer-events-none"
                }`}
              aria-label="Next branches"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col container max-w-7xl mx-auto relative overflow-hidden">
        {/* The tiles scroll track */}
        <div
          ref={carouselRef}
          className="flex flex-row overflow-x-auto snap-x snap-mandatory border-l border-r border-gray-200 bg-white no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {offices.map((office, idx) => (
            <div
              key={idx}
              className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 snap-start border-r border-gray-200 last:border-r-0 border-b border-gray-200 flex flex-col group bg-white"
            >
              {/* City Photo */}
              <div className="relative h-48 md:h-52 w-full overflow-hidden bg-gray-100">
                <Image
                  src={office.image}
                  alt={office.city}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Details */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <LuMapPin className="text-primary text-xl flex-shrink-0" />
                    <h4 className="text-secondary font-bold text-lg md:text-xl font-oswald group-hover:text-primary transition-colors duration-200">
                      {office.city}
                    </h4>
                  </div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider pl-7">
                    {office.country}
                  </p>

                  <div className="border-b border-gray-200 my-4"></div>

                  {/* Address */}
                  <div className="flex items-start gap-3 mb-3 text-[13px] text-gray-600 font-medium leading-relaxed">
                    <LuMapPin className="text-gray-400 text-base flex-shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 mb-3 text-[13px] text-gray-600 font-medium">
                    <LuPhone className="text-gray-400 text-base flex-shrink-0" />
                    <a href={`tel:${office.phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">
                      {office.phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 text-[13px] text-gray-600 font-medium">
                    <LuMail className="text-gray-400 text-base flex-shrink-0" />
                    <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors break-all">
                      {office.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scrollbar-hiding utility styles */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* Progress / Dash Indicators */}
      <div className="flex flex-row justify-center gap-1.5 py-6 container max-w-7xl mx-auto relative overflow-hidden border border-gray-200 border-t-0">
        {offices.map((_, idx) => {
          const isVisible = visibleIndices.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => {
                if (carouselRef.current) {
                  const firstChild = carouselRef.current.firstElementChild;
                  if (firstChild) {
                    carouselRef.current.scrollTo({
                      left: idx * firstChild.offsetWidth,
                      behavior: "smooth"
                    });
                  }
                }
              }}
              className={`h-[3px] rounded-sm transition-all duration-300 ${isVisible
                ? "w-8 bg-primary"
                : "w-4 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                }`}
              aria-label={`Go to branch ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Steps Section */}
      <div className="container hidden max-w-7xl mx-auto relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 -top-1/2"
        />
        {/* Steps Header */}
        <div className="w-full flex flex-col justify-between border border-t-0 border-gray-200 bg-white p-6 md:p-10 lg:p-12 pb-0 relative z-10">
          <SubHeading title="How We Work" className="mb-4" />
          <h2 className="font-oswald text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-dark leading-tight mt-2">
            Your Journey to Maritime Excellence <span className="text-secondary">in 4 Simple Steps</span><span className="text-primary">.</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium mt-4 leading-relaxed max-w-2xl">
            We make partnering with us seamless and transparent. Here is the process we follow to deliver exceptional results for your vessels and operations.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-t-0 border-gray-200 bg-white items-stretch relative z-10">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-8 lg:p-10 flex flex-col bg-white relative group transition-all duration-300 hover:shadow-inner border-b border-gray-200 md:border-b-0 md:border-r border-gray-200 last:border-r-0 last:border-b-0 ${idx % 2 === 0 ? "md:border-r" : "md:border-r-0 lg:border-r"
                } ${idx < 2 ? "md:border-b" : "md:border-b-0"} lg:border-b-0`}
            >
              {/* Step Number Overlay */}
              <span className="absolute top-6 right-8 text-6xl font-bold font-oswald text-secondary/5 group-hover:text-primary/10 transition-colors duration-300 pointer-events-none select-none">
                0{idx + 1}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-sm bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                {step.icon}
              </div>

              {/* Title & Desc */}
              <h3 className="font-oswald text-lg font-bold text-secondary-dark mb-3 group-hover:text-primary transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed flex-grow">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactUs />
    </>
  );
}
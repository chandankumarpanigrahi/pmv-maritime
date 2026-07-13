"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { TbShip, TbTarget, TbShieldCheck, TbActivity, TbGlobe } from "react-icons/tb";
import { PiGraduationCap } from "react-icons/pi";
import { LuShipWheel, LuShip, LuGlobe, LuUsers, LuAward, LuMapPin, LuCalendar, LuTrendingUp } from "react-icons/lu";
import { TbUserShield } from "react-icons/tb";
import { TbDeviceDesktopCheck } from "react-icons/tb";
import { MdOutlineAnchor } from "react-icons/md";
import { PiMonitorPlay } from "react-icons/pi";
import { TbBuildingWarehouse, TbSchool, TbLeaf, TbCrane } from "react-icons/tb";

import bannerBg from "../../../public/assets/images/map-bg.png";

import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";
import SubBanner from "@/components/Sub Banner/page";

const popularServices = [
  {
    title: "Marine Consultancy",
    description: "Strategic advisory for fleet optimization, safety compliance, and operational efficiency across international waters.",
    icon: MdOutlineAnchor,
    path: "/services/marine-consultancy",
    category: "Maritime Consultancy"
  },
  {
    title: "Training & LMS",
    description: "Next-generation Learning Management Systems tailored for certified maritime training and officer certification.",
    icon: PiGraduationCap,
    path: "/services/training-lms",
    category: "Fleet Management"
  },
  {
    title: "Port Operations",
    description: "End-to-end management of terminal logistics, security, and automated vessel traffic monitoring.",
    icon: TbBuildingWarehouse,
    path: "/services/port-operations",
    category: "Port Operations"
  },
  {
    title: "Marine University",
    description: "World-class academic programs focusing on maritime law, engineering, and global logistics management.",
    icon: TbSchool,
    path: "/services/marine-university",
    category: "Maritime Consultancy"
  },
  {
    title: "Digitisation",
    description: "Transforming legacy nautical charts and operations into agile digital ecosystems with IoT integration.",
    icon: PiMonitorPlay,
    path: "/services/digitisation",
    category: "Digitisation"
  },
  {
    title: "Environment Protection",
    description: "Leading the charge in decarbonization and marine ecosystem preservation through advanced spill-prevention tech.",
    icon: TbLeaf,
    path: "/services/environment-protection",
    category: "Fleet Management"
  },
  {
    title: "Shipbuilding",
    description: "From design to hull construction, we manage the technical lifecycle of bespoke commercial and patrol vessels.",
    icon: TbCrane,
    path: "/services/shipbuilding",
    category: "Shipbuilding"
  },
  {
    title: "Global Recruitment",
    description: "Connecting elite seafaring talent with the world's leading shipping companies and port authorities.",
    icon: TbGlobe,
    path: "/services/global-recruitment",
    category: "Fleet Management"
  },
  {
    title: "Underwater Robotics",
    description: "Innovative solutions utilizing ROV and AUV technologies for underwater exploration and maintenance tasks.",
    icon: MdOutlineAnchor,
    path: "/services/underwater-robotics",
    category: "Shipbuilding"
  },
  {
    title: "Vessel Performance Analytics",
    description: "Real-time data analysis to enhance fuel efficiency and optimize voyage routes for better sustainability.",
    icon: PiGraduationCap,
    path: "/services/vessel-performance-analytics",
    category: "Digitisation"
  },
  {
    title: "Marine Insurance Solutions",
    description: "Comprehensive coverage options tailored to mitigate risks associated with maritime operations and cargo transport.",
    icon: TbBuildingWarehouse,
    path: "/services/marine-insurance-solutions",
    category: "Maritime Consultancy"
  },
  {
    title: "Sustainability Consulting",
    description: "Advising maritime businesses on sustainable practices and compliance with global environmental regulations.",
    icon: TbSchool,
    path: "/services/sustainability-consulting",
    category: "Maritime Consultancy"
  }
];

export default function Services() {
  const [activeTab, setActiveTab] = useState("All Services");

  const serviceCategories = [
    "All Services",
    "Port Operations",
    "Fleet Management",
    "Maritime Consultancy",
    "Shipbuilding",
    "Digitisation"
  ];

  const filteredServices = activeTab === "All Services"
    ? popularServices
    : popularServices.filter((service) => service.category === activeTab);

  return (
    <>
      <SubBanner
        Heading="Our Services"
        breadcrumbItems={[
          { label: "Our Services", href: "/services" }
        ]} />
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
          <div className="flex flex-col md:flex-row py-8 px-4 md:px-8 border-b border-gray-200">
            <div className="flex flex-col w-full md:w-7/12">
              <SubHeading title="Services" className="mb-4 md:mb-6" />
              <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">End-to-End <span className="text-secondary-dark">Maritime Solutions</span> <span className="text-primary">.</span><br />Driven by Expertise <span className="text-primary">.</span><span className="text-secondary-dark">Delivered with Care</span><span className="text-primary">.</span></h1>
              <p className="text-sm md:text-[15px] max-w-full md:max-w-[60%] text-gray-600 font-medium">We combine expertise, technology and global reach to deliver safe, efficient and sustainable maritime solutions.</p>
            </div>
            <div className="w-full md:w-5/12 hidden flex-col mt-6 md:mt-0">
            </div>
          </div>

          {/* Service Tabs */}
          <div className="w-full border-b pt-2 bg-white relative z-2 border-gray-200">
            <div className="flex overflow-x-auto gap-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
              {serviceCategories.map((category) => {
                const isActive = activeTab === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`pb-3 px-3 pt-2 text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-all duration-300 border-b-4 -mb-[1.5px] uppercase tracking-wider text-left snap-start flex-shrink-0 group ${isActive
                      ? "border-primary text-secondary-dark font-bold"
                      : "border-transparent text-gray-400 hover:text-gray-600 font-semibold"
                      }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-gray-200 bg-white">
        {filteredServices.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <div
              key={index}
              className="flex flex-col border-r border-b border-gray-200 p-4 md:p-6 min-h-none md:min-h-[290px] bg-white hover:bg-primary group/card transition-all duration-300"
            >
              {/* Icon Container with background color transition on hover */}
              <div className="bg-primary/5 h-10 w-10 md:h-14 md:w-14 flex justify-center items-center mb-2 md:mb-6 group-hover/card:bg-blue-50 transition-all duration-300">
                <IconComponent className="text-2xl md:text-3xl text-primary group-hover/card:text-secondary-dark transition-all duration-300" />
              </div>

              {/* Title */}
              <h2 className="text-[18px] md:text-xl font-bold text-gray-900 group-hover/card:text-white mb-1 md:mb-2">
                {service.title}
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-[12px] md:text-[14px] leading-normal md:leading-relaxed group-hover/card:text-white/80 mb-3 md:mb-6 flex-grow">
                {service.description}
              </p>

              {/* Learn More Link */}
              <Link
                href={service.path}
                className="mt-auto text-secondary group-hover/card:text-white text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ease-in-out inline-flex items-center gap-2 group/link"
              >
                Learn More <FaArrowRight className="group-hover/link:translate-x-1 transition-transform duration-300 ease-in-out" />
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
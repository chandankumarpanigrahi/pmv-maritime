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

import bannerBg from "../../../public/assets/images/map-bg.png";

import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

const projectCategories = [
  "Port Operations",
  "Fleet Management",
  "Maritime Consultancy",
  "Shipbuilding",
  "Digitisation"
];

const projectsData = [
  {
    title: "Smart Container Tracking System",
    tag: "Smart Ports",
    category: "Digitisation",
    description: "Deployed IoT-enabled container monitoring across a major port cluster, delivering real-time visibility and predictive maintenance alerts.",
    location: "Dubai",
    year: "2024",
    stat: "42% Visibility Gain",
    image: image1,
    link: "/projects/container-tracking"
  },
  {
    title: "Terminal Operations Modernization",
    tag: "Port Operations",
    category: "Port Operations",
    description: "Implemented an integrated terminal management system improving operational efficiency and reducing turnaround time by 35%.",
    location: "Singapore",
    year: "2023",
    stat: "35% Efficiency Gain",
    image: image2,
    link: "/projects/terminal-modernization"
  },
  {
    title: "Automated Crane & Yard Management",
    tag: "Port Automation",
    category: "Port Operations",
    description: "Integrated automated stacking crane systems with real-time yard coordination software, increasing cargo throughput by 40% and optimizing slot utilization.",
    location: "Hamburg",
    year: "2024",
    stat: "40% Throughput Boost",
    image: image1,
    link: "/projects/crane-yard-automation"
  },
  {
    title: "Smart Berth Allocation System",
    tag: "Berth Optimization",
    category: "Port Operations",
    description: "Deployed AI-driven berth scheduling system to dynamically coordinate vessel arrivals, reducing waiting times at anchorage by 50%.",
    location: "Rotterdam",
    year: "2023",
    stat: "50% Less Waiting Time",
    image: image3,
    link: "/projects/berth-allocation-optimization"
  },
  {
    title: "Cold Chain Network Optimization",
    tag: "Cold Chain",
    category: "Fleet Management",
    description: "Redesigned refrigerated logistics network across 12 distribution hubs, cutting spoilage rates and reducing total cold-chain costs by 28%.",
    location: "Rotterdam",
    year: "2022",
    stat: "28% Cost Reduction",
    image: image3,
    link: "/projects/cold-chain-optimization"
  }
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState(0);
  // Filter projects based on activeTab (category)
  const filteredProjects = projectsData.filter(
    project => project.category === projectCategories[activeTab]
  );

  return (
    <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
      <div className="w-full flex flex-col border border-t-0 border-gray-200">
        <div className="flex flex-col md:flex-row py-8 px-4 md:px-8">
          <div className="flex flex-col w-full md:w-7/12">
            <SubHeading title="Our Projects" className="mb-4 md:mb-6" />
            <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">Delivering Impact<span className="text-primary">.</span><br />Driving <span className="text-secondary-dark">Maritime Excellence</span><span className="text-primary">.</span></h1>
            <p className="text-sm md:text-[15px] max-w-full md:max-w-[60%] text-gray-600 font-medium">From complex operations to innovative solutions, explore how PMV Maritime creates value across the globe.</p>
          </div>
          <div className="w-full md:w-5/12 flex flex-col mt-6 md:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 md:mb-6 mt-2">
              {/* Projects Completed */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-r border-b md:border-b-0 border-gray-200/80">
                <LuShip className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">120+</span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Projects Completed
                </span>
              </div>

              {/* Countries Served */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-b md:border-b-0 md:border-l-0 md:border-r border-gray-200/80">
                <LuGlobe className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">25+</span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Countries Served
                </span>
              </div>

              {/* Client Satisfied */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-r border-gray-200/80">
                <LuUsers className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">99%</span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Client Satisfied
                </span>
              </div>

              {/* Industry Awards */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0">
                <LuAward className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">15+</span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Industry Awards
                </span>
              </div>
            </div>
            <Link
              href="/projects"
              className="mt-auto mr-auto md:mr-0 ml-0 md:ml-auto group w-fit text-md flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-white border-secondary text-secondary border hover:border-secondary-hover hover:text-secondary-hover font-bold transition-all duration-300"
            >
              View All Projects <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
            </Link>
          </div>
        </div>

        {/* Tabs Headers */}
        <div className="w-full border-b border-gray-200">
          <div className="flex overflow-x-auto gap-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {projectCategories.map((category, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx);
                  }}
                  className={`pb-3 px-3 pt-2 text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-all duration-300 border-b-3 -mb-[1.5px] uppercase tracking-wider text-left snap-start flex-shrink-0 group ${isActive
                    ? "border-primary text-secondary-dark font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-600 font-semibold"
                    }`}
                >
                  {category}
                </button>
              );
            })}
            <Link
              href="/projects"
              className="pb-3 px-3 pt-2 text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-all duration-300 border-b-3 -mb-[1.5px] uppercase tracking-wider text-left snap-start flex-shrink-0 text-gray-400 hover:text-gray-600 font-semibold border-transparent flex items-center gap-1 group"
            >
              <span>All Projects</span>
              <FaArrowRight className="text-xs transition-all duration-300 transform -rotate-45 translate-x-[-6px] -translate-y-0.5 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 text-primary" />
            </Link>
          </div>
        </div>

        {/* Tab Content Display (Projects Grid) */}
        <div className=" bg-gray-50/30">
          <div className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3 items-stretch bg-gray-200">
            {filteredProjects.map((project, idx) => (
              <div
                key={idx}
                className="flex flex-col bg-white overflow-hidden group/card cursor-pointer"
              >
                {/* Image container */}
                <div className="relative h-[220px] w-full overflow-hidden flex-shrink-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
                    {project.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-5 md:p-6 justify-between">
                  <div>
                    {/* Title and Arrow */}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg md:text-xl font-bold text-secondary-gray-900 leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed mt-3 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Stats divider line */}
                    <div className="flex items-center justify-between py-3.5 border-t border-gray-100 mt-5 text-gray-700">
                      {/* Location */}
                      <div className="flex items-center gap-1.5">
                        <LuMapPin className="text-secondary text-base flex-shrink-0" />
                        <span className="text-[11px] md:text-xs font-semibold">{project.location}</span>
                      </div>

                      {/* Year */}
                      <div className="flex items-center gap-1.5">
                        <LuCalendar className="text-secondary text-base flex-shrink-0" />
                        <span className="text-[11px] md:text-xs font-semibold">{project.year}</span>
                      </div>

                      {/* Metric */}
                      <div className="flex items-center gap-1.5 max-w-[50%]">
                        <LuTrendingUp className="text-secondary text-base flex-shrink-0" />
                        <span className="text-[10px] md:text-[11px] font-semibold text-gray-800 truncate">
                          <span className="text-primary">{project.stat.split(' ')[0]}</span> {project.stat.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    </div>

                    {/* View Case Study link */}
                    <div className="flex items-center gap-1.5 text-xs md:text-[13px] font-bold text-primary hover:text-primary-hover group/link transition-colors duration-300 mt-3 pt-2">
                      <span>View Case Study</span>
                      <FaArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

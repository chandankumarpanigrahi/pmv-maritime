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
  "Port Projects",
  "Fleet Projects",
  "Consultancy Projects",
  "Shipbuilding Projects",
  "Digital Projects"
];

const projectsData = [
  // ========================= PORT PROJECTS =========================
  {
    title: "Port Development Projects",
    tag: "Port Development",
    category: "Port Projects",
    description:
      "Supporting port master planning, terminal development, logistics optimisation, and infrastructure improvements for modern maritime operations.",
    location: "Global",
    year: "Ongoing",
    stat: "Capacity Improvement",
    image: image1,
    link: "/projects/port-development"
  },
  {
    title: "Port Operations Projects",
    tag: "Port Operations",
    category: "Port Projects",
    description:
      "Improving port-call coordination, cargo handling, marine logistics, vessel turnaround, and operational efficiency across ports.",
    location: "Worldwide",
    year: "Ongoing",
    stat: "Reduced Delays",
    image: image2,
    link: "/projects/port-operations"
  },
  {
    title: "Port Digitisation Projects",
    tag: "Port Digitisation",
    category: "Port Projects",
    description:
      "Implementing connected digital systems, workflow automation, dashboards, and operational visibility for smarter port management.",
    location: "International",
    year: "Ongoing",
    stat: "Digital Transformation",
    image: image3,
    link: "/projects/port-digitisation"
  },

  // ========================= FLEET PROJECTS =========================
  {
    title: "Fleet Management Projects",
    tag: "Fleet Management",
    category: "Fleet Projects",
    description:
      "Enhancing vessel reliability through maintenance planning, compliance management, inspections, and technical performance monitoring.",
    location: "Global",
    year: "Ongoing",
    stat: "Reduced Downtime",
    image: image1,
    link: "/projects/fleet-management"
  },
  {
    title: "Crew Management Projects",
    tag: "Crew Management",
    category: "Fleet Projects",
    description:
      "Managing recruitment, deployment, certification, welfare, and workforce planning for compliant maritime operations worldwide.",
    location: "Worldwide",
    year: "Ongoing",
    stat: "Qualified Workforce",
    image: image2,
    link: "/projects/crew-management"
  },
  {
    title: "Marine Logistics Projects",
    tag: "Marine Logistics",
    category: "Fleet Projects",
    description:
      "Delivering logistics support for vessels, equipment, offshore operations, spare parts, and maritime infrastructure projects.",
    location: "International",
    year: "Ongoing",
    stat: "Reliable Delivery",
    image: image3,
    link: "/projects/marine-logistics"
  },

  // ========================= CONSULTANCY PROJECTS =========================
  {
    title: "Maritime Consultancy Projects",
    tag: "Consultancy",
    category: "Consultancy Projects",
    description:
      "Providing strategic, technical, operational, and commercial advisory services for maritime organisations and stakeholders.",
    location: "Global",
    year: "Ongoing",
    stat: "Better Decisions",
    image: image1,
    link: "/projects/maritime-consultancy"
  },
  {
    title: "Risk Management Projects",
    tag: "Risk Management",
    category: "Consultancy Projects",
    description:
      "Developing digital risk management solutions for monitoring, compliance, incident reporting, and operational safety.",
    location: "Worldwide",
    year: "Ongoing",
    stat: "Reduced Risk",
    image: image2,
    link: "/projects/risk-management"
  },
  {
    title: "Case Advisory Projects",
    tag: "Case Advisory",
    category: "Consultancy Projects",
    description:
      "Supporting maritime investigations, claims, disputes, technical reviews, and regulatory compliance through expert advisory.",
    location: "International",
    year: "Ongoing",
    stat: "Expert Guidance",
    image: image3,
    link: "/projects/case-advisory"
  },

  // ========================= SHIPBUILDING PROJECTS =========================
  {
    title: "Shipbuilding Projects",
    tag: "Shipbuilding",
    category: "Shipbuilding Projects",
    description:
      "Supporting vessel construction, conversion, refurbishment, quality assurance, commissioning, and final project delivery.",
    location: "Global",
    year: "Ongoing",
    stat: "Quality Assurance",
    image: image1,
    link: "/projects/shipbuilding"
  },
  {
    title: "Infrastructure Projects",
    tag: "Infrastructure",
    category: "Shipbuilding Projects",
    description:
      "Managing maritime infrastructure projects from feasibility and planning through construction and successful handover.",
    location: "Worldwide",
    year: "Ongoing",
    stat: "Project Success",
    image: image2,
    link: "/projects/infrastructure"
  },
  {
    title: "Inland Waterway Projects",
    tag: "Waterways",
    category: "Shipbuilding Projects",
    description:
      "Improving inland transport, navigation safety, connectivity, and operational readiness through strategic waterway development.",
    location: "Regional",
    year: "Ongoing",
    stat: "Safer Navigation",
    image: image3,
    link: "/projects/inland-waterways"
  },

  // ========================= DIGITAL PROJECTS =========================
  {
    title: "Maritime Software Projects",
    tag: "Software Development",
    category: "Digital Projects",
    description:
      "Designing, testing, reviewing, and deploying maritime software solutions that improve reliability and operational performance.",
    location: "Global",
    year: "Ongoing",
    stat: "Reliable Systems",
    image: image1,
    link: "/projects/software-development"
  },
  {
    title: "Artificial Intelligence Projects",
    tag: "Artificial Intelligence",
    category: "Digital Projects",
    description:
      "Applying AI-powered analytics, predictive maintenance, intelligent planning, and automation across maritime operations.",
    location: "International",
    year: "Ongoing",
    stat: "Smarter Decisions",
    image: image2,
    link: "/projects/artificial-intelligence"
  },
  {
    title: "Training LMS Projects",
    tag: "Digital Learning",
    category: "Digital Projects",
    description:
      "Developing Learning Management Systems for maritime training, certification, competency tracking, and professional development.",
    location: "Worldwide",
    year: "Ongoing",
    stat: "Digital Learning",
    image: image3,
    link: "/projects/training-lms"
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

            <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
              Maritime Expertise<span className="text-primary">.</span>
              <br />
              <span className="text-secondary-dark">Transformed into Measurable Results</span>
              <span className="text-primary">.</span>
            </h1>

            <p className="text-sm md:text-[15px] max-w-full md:max-w-[70%] text-gray-600 font-medium">
              Explore how PMV Maritime Solutions delivers projects through technical
              expertise, digital innovation, industry knowledge, and disciplined
              execution across the global maritime sector.
            </p>
          </div>

          <div className="w-full md:w-5/12 flex flex-col mt-6 md:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 md:mb-6 mt-2">
              {/* Projects Delivered */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-r border-b md:border-b-0 border-gray-200/80">
                <LuShip className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  120+
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Projects Delivered
                </span>
              </div>

              {/* Maritime Sectors */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-b md:border-b-0 md:border-l-0 md:border-r border-gray-200/80">
                <LuGlobe className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  25+
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Maritime Sectors
                </span>
              </div>

              {/* Service Areas */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-r border-gray-200/80">
                <LuUsers className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  20+
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Project Categories
                </span>
              </div>

              {/* Delivery Framework */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0">
                <LuAward className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  100%
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Delivery Focus
                </span>
              </div>
            </div>

            <Link
              href="/projects"
              className="mt-auto mr-auto md:mr-0 ml-0 md:ml-auto group w-fit text-md flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-white border-secondary text-secondary border hover:border-secondary-hover hover:text-secondary-hover font-bold transition-all duration-300"
            >
              View All Projects{" "}
              <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
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
                    <div className="hidden items-center justify-between py-3.5 border-t border-gray-100 mt-5 text-gray-700">
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

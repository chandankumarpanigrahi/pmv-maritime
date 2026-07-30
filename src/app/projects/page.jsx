"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";

import bannerBg from "../../../public/assets/images/map-bg.png";
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";
const image4 = "https://iili.io/Ck11H4s.jpg";
import SubBanner from "@/components/Sub Banner/page";

const projectCategories = [
  "All Projects",
  "Port Operations",
  "Fleet Management",
  "Maritime Consultancy",
  "Shipbuilding",
  "Digitisation"
];

const projectsData = [
  {
    title: "Port Development Projects",
    category: "Port Operations",
    description: "Delivered comprehensive port development solutions focused on infrastructure planning, operational efficiency, and sustainable maritime growth.",
    image: image1,
    link: "/projects/port-development"
  },
  {
    title: "Port Operations Projects",
    category: "Port Operations",
    description: "Optimized port operations through strategic planning, workflow improvements, and operational support for enhanced vessel turnaround.",
    image: image2,
    link: "/projects/port-operations"
  },
  {
    title: "Port Digitisation Projects",
    category: "Port Operations",
    description: "Implemented digital technologies to modernize port operations, automate workflows, and improve data-driven decision making.",
    image: image4,
    link: "/projects/port-digitisation"
  },
  {
    title: "Port Waste Management Projects",
    category: "Port Operations",
    description: "Developed sustainable waste management solutions for ports, ensuring regulatory compliance and environmentally responsible operations.",
    image: image1,
    link: "/projects/port-waste-management"
  },
  {
    title: "Fleet & Technical Management Projects",
    category: "Fleet Management",
    description: "Provided integrated fleet and technical management services to improve vessel performance, maintenance, and operational reliability.",
    image: image2,
    link: "/projects/fleet-technical-management"
  },
  {
    title: "Crew Management Projects",
    category: "Fleet Management",
    description: "Delivered end-to-end crew management services including recruitment, deployment, compliance, and seafarer welfare support.",
    image: image3,
    link: "/projects/crew-management"
  },
  {
    title: "Global Recruitment Projects",
    category: "Fleet Management",
    description: "Supported maritime organizations with global recruitment solutions, connecting skilled professionals with industry opportunities.",
    image: image1,
    link: "/projects/global-recruitment"
  },
  {
    title: "Marine Logistics Projects",
    category: "Fleet Management",
    description: "Executed marine logistics projects ensuring efficient cargo movement, supply chain coordination, and offshore operational support.",
    image: image2,
    link: "/projects/marine-logistics"
  },
  {
    title: "Maritime Consultancy Projects",
    category: "Maritime Consultancy",
    description: "Delivered expert consultancy services covering maritime operations, compliance, business strategy, and technical advisory solutions.",
    image: image3,
    link: "/projects/maritime-consultancy"
  },
  {
    title: "Marine Insurance Projects",
    category: "Maritime Consultancy",
    description: "Provided marine insurance consulting and risk assessment services to protect maritime assets and support informed decision-making.",
    image: image1,
    link: "/projects/marine-insurance"
  },
  {
    title: "Maritime Risk Management Software Projects",
    category: "Maritime Consultancy",
    description: "Designed intelligent risk management solutions that improve compliance, safety monitoring, incident reporting, and operational decision-making.",
    image: image2,
    link: "/projects/maritime-risk-management-software"
  },
  {
    title: "Maritime Case Advisory Projects",
    category: "Maritime Consultancy",
    description: "Provided expert advisory support for maritime disputes, regulatory matters, arbitration, and complex case management services.",
    image: image3,
    link: "/projects/maritime-case-advisory"
  },
  {
    title: "Shipbuilding Projects",
    category: "Shipbuilding",
    description: "Delivered shipbuilding solutions from concept to commissioning with a focus on quality, safety, and engineering excellence.",
    image: image1,
    link: "/projects/shipbuilding"
  },
  {
    title: "Shipyard Projects",
    category: "Shipbuilding",
    description: "Executed shipyard development and modernization projects to improve production efficiency, maintenance capabilities, and operational performance.",
    image: image2,
    link: "/projects/shipyard"
  },
  {
    title: "Maritime Infrastructure Development Projects",
    category: "Shipbuilding",
    description: "Developed maritime infrastructure projects including terminals, waterfront facilities, and marine engineering solutions.",
    image: image3,
    link: "/projects/maritime-infrastructure"
  },
  {
    title: "Inland Waterways Projects",
    category: "Shipbuilding",
    description: "Supported inland waterway development through navigation planning, infrastructure enhancement, and sustainable transport solutions.",
    image: image1,
    link: "/projects/inland-waterways"
  },
  {
    title: "Maritime Software Development Projects",
    category: "Digitisation",
    description: "Built custom maritime software platforms that streamline operations, automate workflows, and improve business performance.",
    image: image2,
    link: "/projects/maritime-software-development"
  },
  {
    title: "Artificial Intelligence Projects",
    category: "Digitisation",
    description: "Integrated AI-powered technologies to enhance maritime analytics, predictive maintenance, operational intelligence, and automation.",
    image: image3,
    link: "/projects/artificial-intelligence"
  },
  {
    title: "Maritime Simulation Projects",
    category: "Digitisation",
    description: "Developed advanced maritime simulation environments for operational planning, crew assessment, and practical training programs.",
    image: image1,
    link: "/projects/maritime-simulation"
  },
  {
    title: "Training LMS Projects",
    category: "Digitisation",
    description: "Implemented Learning Management Systems for maritime institutions to deliver digital training, certification, and performance tracking.",
    image: image2,
    link: "/projects/training-lms"
  },
  {
    title: "Digital Twin Projects",
    category: "Digitisation",
    description: "Developed digital twin solutions for maritime assets, enabling real-time monitoring, predictive analysis, and improved operational efficiency.",
    image: image3,
    link: "/projects/digital-twin"
  }
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState(0);
  // Filter projects based on activeTab (category)
  const filteredProjects = activeTab === 0
    ? projectsData
    : projectsData.filter(project => project.category === projectCategories[activeTab]);

  return (
    <>
      <SubBanner
        Heading="Our Projects"
        breadcrumbItems={[
          { label: "Our Projects", href: "/projects" }
        ]} />
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
          <div className="flex flex-col md:flex-row py-8 px-4 md:px-8 border-b border-gray-200">
            <div className="flex flex-col w-full md:w-7/12">
              <SubHeading title="Our Projects" className="mb-4 md:mb-6" />
              <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
                Maritime Expertise<span className="text-primary">.</span>
                <br />
                <span className="text-secondary-dark">Transformed into Measurable Results</span>
                <span className="text-primary">.</span>
              </h1>

              <p className="text-sm md:text-[15px] max-w-full md:max-w-[90%] text-gray-600 font-medium">
                Explore how PMV Maritime Solutions delivers projects through technical
                expertise, digital innovation, industry knowledge, and disciplined
                execution across the global maritime sector.
              </p>
            </div>
            <div className="w-full md:w-5/12 hidden flex-col mt-6 md:mt-0">
            </div>
          </div>

          {/* Tabs Headers */}
          <div className="w-full border-b pt-2 bg-white relative z-2 border-gray-200">
            <div className="flex overflow-x-auto  gap-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
              {projectCategories.map((category, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(idx);
                    }}
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

          {/* Tab Content Display (Projects Grid) */}
          <div className=" bg-gray-50/30">
            <div className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3 items-stretch bg-gray-200">
              {filteredProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white overflow-hidden relative group/card cursor-pointer"
                >
                  <div className="absolute z-1 top-2 left-2 bg-primary text-white px-2 py-0.5 text-sm">{project.category}</div>
                  {/* Image container */}
                  <div className="relative h-[160px] md:h-[220px] w-full overflow-hidden flex-shrink-0">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-4 md:p-6 justify-between">
                    <div>
                      {/* Title and Arrow */}
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg md:text-xl font-bold text-secondary-gray-900 leading-tight">
                          {project.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed mt-2 md:mt-3 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* View Case Study link */}
                      <Link href={project.link} className="flex items-center gap-1.5 text-xs md:text-[13px] font-bold text-primary hover:text-primary-hover group/link transition-colors duration-300 mt-3 pt-2">
                        <span>View Case Study</span>
                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
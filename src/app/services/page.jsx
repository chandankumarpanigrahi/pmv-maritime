"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";

import {
  TbShip,
  TbTarget,
  TbShieldCheck,
  TbActivity,
  TbGlobe,
  TbUserShield,
  TbDeviceDesktopCheck,
  TbBuildingWarehouse,
  TbSchool,
  TbLeaf,
  TbCrane,
  TbBriefcase2,
  TbTruckDelivery,
  TbBuilding,
  TbRoute,
  TbUsers,
  TbTool,
  TbBuildingFactory,
  TbClipboardCheck,
  TbChecklist,
  TbCpu,
  TbChartBar,
} from "react-icons/tb";

import {
  LuShipWheel,
  LuShip,
  LuGlobe,
  LuUsers,
  LuAward,
  LuMapPin,
  LuCalendar,
  LuTrendingUp,
} from "react-icons/lu";

import {
  PiGraduationCap,
  PiMonitorPlay,
} from "react-icons/pi";

import {
  MdOutlineAnchor,
} from "react-icons/md";

import bannerBg from "../../../public/assets/images/map-bg.png";

import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";
import SubBanner from "@/components/Sub Banner/page";

const popularServices = [
  // ===================== MARITIME CONSULTANCY =====================
  {
    title: "Marine Consultancy",
    description: "Strategic, technical, and commercial advisory that improves performance, reduces risk, and supports confident maritime decision-making.",
    icon: MdOutlineAnchor,
    path: "/services/marine-consultancy",
    category: "Maritime Consultancy"
  },
  {
    title: "Marine Insurance",
    description: "Advisory support for marine insurance, risk evaluation, claims guidance, and operational risk mitigation strategies.",
    icon: TbShieldCheck,
    path: "/services/marine-insurance",
    category: "Maritime Consultancy"
  },
  {
    title: "Project Advisory",
    description: "Expert guidance for feasibility studies, investment planning, technical due diligence, and maritime project execution.",
    icon: TbBriefcase2,
    path: "/services/project-advisory",
    category: "Maritime Consultancy"
  },
  {
    title: "Sustainability Consulting",
    description: "Helping maritime organizations improve environmental performance, compliance, and long-term operational sustainability.",
    icon: TbLeaf,
    path: "/services/sustainability-consulting",
    category: "Maritime Consultancy"
  },

  // ===================== PORT OPERATIONS =====================
  {
    title: "Port Operations",
    description: "Coordinated port services that improve vessel turnaround, cargo handling, and terminal operational efficiency.",
    icon: TbBuildingWarehouse,
    path: "/services/port-operations",
    category: "Port Operations"
  },
  {
    title: "Marine Logistics",
    description: "Reliable logistics support for vessels, equipment, spare parts, customs, and offshore maritime operations.",
    icon: TbTruckDelivery,
    path: "/services/marine-logistics",
    category: "Port Operations"
  },
  {
    title: "Terminal Operations",
    description: "Efficient coordination of terminal activities, berth planning, vessel movements, and cargo operations.",
    icon: TbBuilding,
    path: "/services/terminal-operations",
    category: "Port Operations"
  },
  {
    title: "Port Coordination",
    description: "Integrated planning and documentation that ensure smooth vessel calls and regulatory compliance.",
    icon: TbRoute,
    path: "/services/port-coordination",
    category: "Port Operations"
  },

  // ===================== FLEET MANAGEMENT =====================
  {
    title: "Fleet Management",
    description: "Technical vessel management focused on maintenance, compliance, reliability, and long-term asset performance.",
    icon: LuShipWheel,
    path: "/services/fleet-management",
    category: "Fleet Management"
  },
  {
    title: "Crew Management",
    description: "Complete recruitment, deployment, certification, welfare, and workforce planning for maritime professionals.",
    icon: TbUsers,
    path: "/services/crew-management",
    category: "Fleet Management"
  },
  {
    title: "Technical Services",
    description: "Professional inspections, engineering support, repair supervision, and technical documentation for vessels.",
    icon: TbTool,
    path: "/services/technical-services",
    category: "Fleet Management"
  },
  {
    title: "Global Recruitment",
    description: "Connecting qualified maritime professionals with shipping companies through transparent recruitment processes.",
    icon: TbGlobe,
    path: "/services/global-recruitment",
    category: "Fleet Management"
  },

  // ===================== SHIPBUILDING =====================
  {
    title: "Shipbuilding",
    description: "Independent support throughout vessel construction, conversion, refurbishment, and final project delivery.",
    icon: TbCrane,
    path: "/services/shipbuilding",
    category: "Shipbuilding"
  },
  {
    title: "Shipyard Services",
    description: "Construction supervision, quality inspections, equipment selection, and shipyard coordination services.",
    icon: TbBuildingFactory,
    path: "/services/shipyard-services",
    category: "Shipbuilding"
  },
  {
    title: "Maritime Projects",
    description: "Structured project delivery from planning and procurement through commissioning and successful handover.",
    icon: TbClipboardCheck,
    path: "/services/maritime-projects",
    category: "Shipbuilding"
  },
  {
    title: "Vessel Commissioning",
    description: "Sea-trial supervision, testing, quality assurance, and commissioning support before vessel delivery.",
    icon: TbChecklist,
    path: "/services/vessel-commissioning",
    category: "Shipbuilding"
  },

  // ===================== DIGITISATION =====================
  {
    title: "Port Digitisation",
    description: "Digital platforms that modernize port operations with automation, dashboards, and integrated workflows.",
    icon: PiMonitorPlay,
    path: "/services/port-digitisation",
    category: "Digitisation"
  },
  {
    title: "Digital Maritime",
    description: "Technology-driven systems that improve operational visibility, compliance, and maritime decision-making.",
    icon: TbDeviceDesktopCheck,
    path: "/services/digital-maritime",
    category: "Digitisation"
  },
  {
    title: "Workflow Automation",
    description: "Automating maritime processes through connected systems, digital documentation, and smart integrations.",
    icon: TbCpu,
    path: "/services/workflow-automation",
    category: "Digitisation"
  },
  {
    title: "Data Analytics",
    description: "Real-time dashboards, operational insights, reporting, and performance analytics for maritime businesses.",
    icon: TbChartBar,
    path: "/services/data-analytics",
    category: "Digitisation"
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
              <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
                End-to-End <span className="text-secondary-dark">Maritime Solutions</span><span className="text-primary">.</span><br />
                Expertise You Can Trust<span className="text-primary">.</span>{" "}
                <span className="text-secondary-dark">Delivered with Confidence</span><span className="text-primary">.</span>
              </h1>

              <p className="text-sm md:text-[15px] max-w-[90%] md:max-w-[80%] text-gray-600 font-medium">
                PMV Maritime Solutions Limited delivers integrated maritime services
                through technical expertise, operational excellence, and digital
                innovation for safer, smarter, and more efficient maritime operations.
              </p>
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
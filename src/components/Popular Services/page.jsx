import styles from "./style.module.css";
import React from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { GiCargoShip } from "react-icons/gi";
import { TbBriefcase2 } from "react-icons/tb";
import { TbBuildingWarehouse, TbSchool, TbLeaf, TbCrane, TbGlobe } from "react-icons/tb";

import bannerBg from "../../../public/assets/images/map-bg.png";

const popularServices = [
  {
    title: "Port Operations",
    description: "Coordinated port services that improve vessel turnaround, cargo handling, terminal efficiency, and operational performance.",
    icon: TbBuildingWarehouse,
    path: "/services/port-operations"
  },
  {
    title: "Shipbuilding",
    description: "Independent support for vessel construction, repair, refurbishment, quality assurance, commissioning, and successful project delivery.",
    icon: TbCrane,
    path: "/services/shipbuilding"
  },
  {
    title: "Maritime Projects",
    description: "End-to-end project management covering planning, procurement, supervision, commissioning, and final delivery of maritime projects.",
    icon: TbBriefcase2,
    path: "/services/maritime-projects"
  },
  {
    title: "Marine Logistics",
    description: "Reliable logistics support for vessels, crews, equipment, spare parts, offshore operations, and maritime project execution.",
    icon: GiCargoShip,
    path: "/services/marine-logistics"
  }
];

export default function PopularServices() {
  return (
    <div>
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 -top-1/2"
        />
        <div className="w-full flex flex-col border border-y-0 border-gray-200">
          <div className="flex flex-col md:flex-row py-6 px-4 md:px-8">
            <div className="flex flex-row w-full items-center justify-between">
              <SubHeading title="Popular Services" />
              <Link
                href="/services"
                className="group w-fit text-[14px] md:text-md flex gap-5 items-center text-secondary font-bold tracking-wider uppercase"
              >
                View All <FaArrowRight className="hidden md:block group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Cards Grid */}
      <div className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-gray-200 bg-white">
        {popularServices.map((service, index) => {
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
    </div>
  );
}

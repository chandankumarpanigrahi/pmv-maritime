"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SubBanner from "@/components/Sub Banner/page";
import SubHeading from "@/design/sub-heading/page";

// Images
import bannerBg from "../../../../public/assets/images/map-bg.png";

// Icons
import { IoMdCall } from "react-icons/io";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { LuCompass, LuShip, LuShield, LuAnchor, LuCpu, LuLeaf } from "react-icons/lu";

export default function Projects() {
  const services = [
    {
      title: "Strategic Advisory",
      description: "Helping you define vision, strategy, and roadmap for long-term maritime success.",
      icon: LuCompass
    },
    {
      title: "Operational Excellence",
      description: "Improving efficiency, reducing costs, and optimizing processes across your operations.",
      icon: LuShip
    },
    {
      title: "Risk & Compliance",
      description: "Ensuring adherence to international regulations, safety standards, and industry best practices.",
      icon: LuShield
    },
    {
      title: "Fleet & Asset Optimization",
      description: "Maximizing vessel performance, managing lifecycle costs, and improving asset value.",
      icon: LuAnchor
    },
    {
      title: "Digital Transformation",
      description: "Leveraging technology and data analytics to drive smarter, safer, and more agile operations.",
      icon: LuCpu
    },
    {
      title: "Sustainability Consulting",
      description: "Supporting decarbonization, environmental compliance, and sustainable maritime practices.",
      icon: LuLeaf
    }
  ];

  return (
    <>
      <SubBanner
        Heading="Marine Consultancy"
        breadcrumbItems={[
          { label: "Our Services", href: "/services" },
          { label: "Marine Consultancy", href: "/services/marine-consultancy" }
        ]}
      />

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
              <h1 className="font-oswald text-4xl md:text-5xl text-secondary font-bold mb-2 md:mb-3">Maritime <span className="text-secondary-dark">Consultancy</span><span className="text-primary">.</span></h1>
              <h5 className="mb-3 font-semibold">Strategic Guidance. Smarter Decisions. Stronger Results.</h5>
              <p className="text-sm md:text-[15px] max-w-full md:max-w-[90%] text-gray-600 font-medium">PMV Maritime Consultancy provides end-to-end advisory services for shipping companies, ports, logistics operators, offshore industries, investors, and maritime organizations. We combine industry expertise, technical excellence, and global best practices to improve operational efficiency, regulatory compliance, sustainability, and long-term business growth.</p>
            </div>
            <div className="relative z-5 w-full md:w-5/12 flex flex-col justify-end items-end mt-6 md:mt-0">
              <div className="w-full md:w-fit">
                <Link
                  href="/services"
                  className="group w-full text-[16px] md:text-[14px] flex gap-3 justify-center items-center mb-2 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-primary hover:bg-primary-hover text-white font-bold tracking-wider shadow-lg"
                >
                  <IoMdCall />
                  Talk to an Expert
                </Link>
                <Link
                  href="/services"
                  className="group w-full md:w-fit justify-center text-[16px] md:text-[14px] flex gap-3 items-center pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-white hover:bg-primary-hover text-primary hover:text-white font-bold tracking-wider shadow-lg"
                >
                  <PiDownloadSimpleBold />
                  Download Brochure
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="flex gap-4 p-4 md:p-6 bg-white items-start">
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-primary/5 text-primary rounded">
                    <Icon className="text-xl md:text-2xl" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-md md:text-lg font-bold text-gray-800 mb-1">{service.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
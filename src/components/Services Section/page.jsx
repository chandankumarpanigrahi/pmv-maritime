import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { TbShip, TbTarget, TbShieldCheck, TbActivity, TbGlobe } from "react-icons/tb";
import { PiGraduationCap } from "react-icons/pi";
import { LuShipWheel } from "react-icons/lu";
import { TbUserShield } from "react-icons/tb";
import { TbDeviceDesktopCheck } from "react-icons/tb";

import bannerBg from "../../../public/assets/images/map-bg.png";

import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

const tabs = [
  {
    title: "Maritime Consultancy",
    icon: TbShip,
    path: "/services/consultancy",
    content: {
      title: "Maritime Consultancy",
      subtitle: "Strategic guidance. Smarter decisions. Stronger results.",
      description: "Our consultants bring deep industry knowledge and real-world experience to solve challenges, drive performance and create sustainable impact.",
      benefits: [
        { icon: TbTarget, title: "Data-driven", desc: "insights" },
        { icon: TbShieldCheck, title: "Risk management", desc: "& compliance" },
        { icon: TbActivity, title: "Operational", desc: "excellence" },
        { icon: TbGlobe, title: "Global perspective,", desc: "local expertise" }
      ],
      images: [image1, image2, image3, image1]
    }
  },
  {
    title: "Maritime Training",
    icon: PiGraduationCap,
    path: "/services/training",
    content: {
      title: "Maritime Training",
      subtitle: "Empowering crew. Raising standards. Ensuring safety.",
      description: "Comprehensive training courses tailored to modern maritime operations, equipping your workforce with skills that meet international compliance and safety standards.",
      benefits: [
        { icon: TbTarget, title: "Certified", desc: "programs" },
        { icon: TbShieldCheck, title: "Safety-first", desc: "standards" },
        { icon: TbActivity, title: "Simulated", desc: "environments" },
        { icon: TbGlobe, title: "Career growth", desc: "& global placement" }
      ],
      images: [image2, image3, image1]
    }
  },
  {
    title: "Fleet Management",
    icon: LuShipWheel,
    path: "/services/fleet-management",
    content: {
      title: "Fleet Management",
      subtitle: "Optimized voyages. Minimal downtime. Maximum reliability.",
      description: "Full technical and operational management of your fleet, utilizing state-of-the-art diagnostic software to ensure high vessel performance and efficiency.",
      benefits: [
        { icon: TbTarget, title: "Cost & fuel", desc: "optimization" },
        { icon: TbShieldCheck, title: "Class & flag", desc: "compliance" },
        { icon: TbActivity, title: "Predictive", desc: "maintenance" },
        { icon: TbGlobe, title: "24/7 global", desc: "monitoring" }
      ],
      images: [image3, image1, image2]
    }
  },
  {
    title: "Crew Management",
    icon: TbUserShield,
    path: "/services/crew-management",
    content: {
      title: "Crew Management",
      subtitle: "Right people. Right place. Right attitude.",
      description: "End-to-end crewing solutions, from recruitment and training to travel logistics and payroll, keeping your vessels running smoothly with top-tier maritime talent.",
      benefits: [
        { icon: TbTarget, title: "Highly verified", desc: "credentials" },
        { icon: TbShieldCheck, title: "Crew welfare", desc: "& protection" },
        { icon: TbActivity, title: "Seamless", desc: "logistics" },
        { icon: TbGlobe, title: "Multi-national", desc: "talent pool" }
      ],
      images: [image1, image2, image3]
    }
  },
  {
    title: "Digital Solutions",
    icon: TbDeviceDesktopCheck,
    path: "/services/digital-solutions",
    content: {
      title: "Digital Solutions",
      subtitle: "Smarter data. Faster decisions. Connected operations.",
      description: "Innovative software and IoT tools designed to aggregate live vessel telemetry and provide predictive analysis for modern shipowners and operators.",
      benefits: [
        { icon: TbTarget, title: "IoT telemetry", desc: "& sensor data" },
        { icon: TbShieldCheck, title: "Cybersecurity", desc: "& data protection" },
        { icon: TbActivity, title: "Real-time", desc: "analytics" },
        { icon: TbGlobe, title: "Cloud integration", desc: "anywhere" }
      ],
      images: [image2, image3, image1]
    }
  }
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const activeContent = tabs[activeTab].content;
  const ActiveTabIcon = tabs[activeTab].icon;

  // Auto-play interval for image slideshow (5-second duration)
  useEffect(() => {
    const totalImages = activeContent.images.length;
    if (totalImages <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIdx, activeTab, activeContent.images.length]);

  return (
    <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
      <Image
        src={bannerBg}
        alt="Banner Background"
        className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
      />
      <div className="w-full flex flex-col border border-t-0 border-gray-200">
        <div className="flex flex-col md:flex-row py-8 px-4 md:px-8">
          <div className="flex flex-col w-full md:w-7/12">
            <SubHeading title="Services" className="mb-4 md:mb-8" />
            <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">End-to-End <span className="text-secondary-dark">Maritime Solutions</span><span className="text-primary">.</span><br />Driven by Expertise<span className="text-primary">.</span> <span className="text-secondary-dark">Delivered with Care</span><span className="text-primary">.</span></h1>
            <p className="text-sm md:text-[15px] max-w-[90%] md:max-w-[60%] text-gray-600 font-medium">We combine expertise, technology and global reach to deliver safe, efficient and sustainable maritime solutions.</p>
          </div>
          <div className="w-full md:w-5/12 flex flex-col mt-6 md:mt-0 justify-end items-start md:items-end">
            <Link
              href="/services"
              className="group w-fit text-[14px] flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-primary hover:bg-primary-hover text-white font-bold tracking-wider uppercase shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              View All Services <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
            </Link>
          </div>
        </div>

        {/* Tabs Headers */}
        <div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory border-b border-gray-200">
            {tabs.map((tab, idx) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx);
                    setCurrentImageIdx(0);
                  }}
                  className={`flex flex-row gap-3 items-center px-3 pt-2 pb-3 border-b-3 transition-all duration-300 ease-in-out cursor-pointer text-left snap-start flex-shrink-0 min-w-[220px] md:min-w-0 md:w-full group ${isActive
                    ? "border-secondary text-secondary font-bold"
                    : "border-b-gray-400 hover:border-secondary hover:bg-primary text-gray-500 hover:text-white font-semibold"
                    }`}
                >
                  <IconComponent
                    className={`text-4xl transition-colors duration-300 ${isActive ? "text-secondary" : "text-gray-400 group-hover:text-white"
                      }`}
                  />
                  <p
                    className={`text-[16px] leading-tight transition-colors duration-300 ${isActive ? "text-gray-900 font-bold" : "text-gray-500 group-hover:text-white font-semibold"
                      }`}
                  >
                    {tab.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 md:p-8 bg-white">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Image with dots indicators */}
            <div className="w-full lg:w-1/2 min-h-[200px] lg:min-h-[300px] relative overflow-hidden shadow-lg group/img flex-shrink-0">
              <Image
                src={activeContent.images[currentImageIdx] || activeContent.images[0]}
                alt={tabs[activeTab].title}
                fill
                className="object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              {/* Pagination Dots Pill */}
              <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs z-10">
                {activeContent.images.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentImageIdx(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentImageIdx === dotIdx ? "w-6 bg-primary" : "w-2 bg-white/70 hover:bg-white"
                      }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column: Title, Subtitle, Description, Benefits Grid, and Link Button */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-2">
              <div>
                {/* Header with Styled Icon Box & Title */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-2 bg-primary/5 text-primary">
                    <ActiveTabIcon className="text-2xl" />
                  </div>
                  <h3 className="text-xl md:text-2xl text-secondary-dark font-bold">
                    {activeContent.title}
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="text-gray-800 font-semibold text-base mt-2">
                  {activeContent.subtitle}
                </p>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-[17px] leading-normal mt-2.5">
                  {activeContent.description}
                </p>

                {/* 2x2 Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6">
                  {activeContent.benefits.map((benefit, bIdx) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <div key={bIdx} className="flex items-start gap-3">
                        <div className="text-secondary text-2xl mt-0.5 flex-shrink-0">
                          <BenefitIcon />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-semibold text-sm leading-tight">
                            {benefit.title}
                          </span>
                          <span className="text-gray-500 text-sm leading-tight">
                            {benefit.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Button Link */}
              <div className="mt-8">
                <Link
                  href={tabs[activeTab].path}
                  className="group inline-flex items-center gap-4 border border-primary text-primary hover:bg-primary hover:text-white font-bold text-[14px] px-4 py-2.5 uppercase tracking-wider transition-all duration-300 w-fit group/btn cursor-pointer"
                >
                  Let&apos;s Work Together <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

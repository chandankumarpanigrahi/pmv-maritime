"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SubBanner from "@/components/Sub Banner/page";
import SubHeading from "@/design/sub-heading/page";

// Images
import bannerBg from "../../../../public/assets/images/map-bg.png";
import colorLogo from "../../../../public/assets/images/banner-anchor-color.png";
import projectAboutPort from "../../../../public/assets/images/project-about-port.png";

// SVG
import stepArrow from "../../../../public/assets/svg/step.svg"
import stepArrowActive from "../../../../public/assets/svg/step-active.svg"

// Icons
import { IoMdCall } from "react-icons/io";
import { PiDownloadSimpleBold } from "react-icons/pi";
import {
  TbCheck,
  TbSearch,
  TbChartBar,
  TbCalendar,
  TbUsers,
  TbShieldCheck,
  TbActivity,
  TbCompass,
  TbUserCheck,
  TbShip,
  TbEye,
  TbTrendingUp,
  TbAward,
  TbUserShield,
} from "react-icons/tb";
import { MdOutlineAnchor } from "react-icons/md";
import { LuHandshake, LuShipWheel } from "react-icons/lu";
import ContactUs from "@/components/Contact Us/page";

const keyPillars = [
  {
    title: "Strategic Advisory",
    description: "Helping you define vision, strategy, and roadmap for long-term maritime success.",
    icon: TbCompass,
  },
  {
    title: "Operational Excellence",
    description: "Improving efficiency, reducing costs, and optimizing processes across your operations.",
    icon: TbShip,
  },
  {
    title: "Risk & Compliance",
    description: "Ensuring adherence to international regulations, safety standards, and industry best practices.",
    icon: TbUserShield,
  },
];

const deliverables = [
  "Maritime business strategy",
  "Feasibility studies",
  "Market-entry advisory",
  "Regulatory and compliance support",
  "Technical and operational audits",
  "Vessel acquisition and due diligence",
  "Shipbuilding and shipyard consultancy",
  "Risk assessment and mitigation",
  "Performance-improvement planning",
  "Maritime project advisory",
];

const deliverySteps = [
  {
    step: "1",
    title: "Discover",
    description: "We define project scope, timelines, and expected outcomes.",
    icon: TbSearch,
  },
  {
    step: "2",
    title: "Assess",
    description: "We assess requirements and identify technical priorities.",
    icon: TbChartBar,
  },
  {
    step: "3",
    title: "Plan",
    description: "We create a delivery plan with milestones and risk controls.",
    icon: TbCalendar,
  },
  {
    step: "4",
    title: "Execute",
    description: "We execute with experienced teams and strong coordination.",
    icon: TbUsers,
  },
  {
    step: "5",
    title: "Verify",
    description: "We monitor quality, compliance, progress, and performance.",
    icon: TbShieldCheck,
  },
  {
    step: "6",
    title: "Report & Improve",
    description: "We report results and improve through continuous feedback.",
    icon: TbActivity,
    active: true,
  },
];

const serviceStandards = [
  {
    title: "Quality",
    description: "Professional, technical, and operational standards applied to every assignment.",
    icon: TbCompass,
  },
  {
    title: "Safety",
    description: "Protection of people, vessels, cargo, assets, and the environment.",
    icon: TbShieldCheck,
  },
  {
    title: "Compliance",
    description: "Support for statutory, regulatory, classification, and industry requirements.",
    icon: TbUserCheck,
  },
  {
    title: "Accountability",
    description: "Clear responsibilities and ownership at every stage.",
    icon: TbShip,
  },
  {
    title: "Transparency",
    description: "Open communication and accurate reporting.",
    icon: TbEye,
  },
  {
    title: "Commercial Value",
    description: "Solutions that reduce risk, improve efficiency, control costs, and performance.",
    icon: TbTrendingUp,
  },
  {
    title: "Timely Execution",
    description: "Careful planning and a strong focus on agreed deadlines.",
    icon: LuShipWheel,
  },
  {
    title: "Reliability",
    description: "Consistent support and dependable delivery.",
    icon: TbAward,
  },
];

export default function ContainerTracking() {
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % deliverySteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SubBanner
        Heading="Our Projects"
        breadcrumbItems={[
          { label: "Our Projects", href: "/projects" },
          { label: "Maritime Consultancy Projects", href: "/projects/maritime-consultancy" }
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
              <h1 className="font-oswald text-4xl md:text-5xl text-secondary-dark font-bold mb-2 md:mb-3">Maritime Consultancy Projects</h1>
              <p className="text-sm md:text-[15px] max-w-full md:max-w-[90%] text-gray-600 font-medium">Strategic, technical, and commercial advice designed to help clients make informed decisions, reduce risk, and improve performance.</p>
            </div>
            <div className="relative z-5 w-full md:w-5/12 flex flex-col justify-end items-end mt-6 md:mt-0">
              <div className="w-full md:w-fit">
                <a
                  href="tel:+971505342726"
                  className="group w-full text-[16px] md:text-[14px] flex gap-3 justify-center items-center mb-2 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-primary hover:bg-primary-hover text-white font-bold tracking-wider shadow-lg"
                >
                  <IoMdCall />
                  Talk to an Expert
                </a>
                <button
                  type="button"
                  onClick={() => handleDownload("/docs/projects.pdf", "PMV Maritime Projects.pdf")}
                  className="group w-full md:w-fit justify-center text-[16px] md:text-[14px] flex gap-3 items-center pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-white hover:bg-primary-hover text-primary hover:text-white font-bold tracking-wider shadow-lg cursor-pointer"
                >
                  <PiDownloadSimpleBold />
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 border-x border-b border-gray-200 bg-white divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {keyPillars.map((pillar) => {
            const PillarIcon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-start gap-4 p-5 md:p-6 bg-white">
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-secondary-dark/5 text-secondary-dark flex items-center justify-center">
                  <PillarIcon className="w-6 h-6 md:h-7 md:w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-secondary-dark text-base md:text-[17px]">{pillar.title}</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mt-1 font-medium">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About The Project & Value Delivered Section */}
      <section className="container max-w-7xl mx-auto">
        <div className="bg-white border border-t-0 border-gray-200 overflow-hidden">
          {/* Upper Grid: Image + About Content + Value Delivered Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Image */}
            <div className="lg:col-span-4 relative min-h-[260px] lg:min-h-full overflow-hidden">
              <Image
                src={projectAboutPort}
                alt="About The Project"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center w-full h-full"
                priority
              />
            </div>

            {/* Middle About Text */}
            <div className="lg:col-span-5 p-5 md:p-8 flex flex-col justify-start">
              <SubHeading title="About The Project" className="mb-2 md:mb-3" />
              <p className="text-sm md:text-[16px] leading-relaxed text-gray-700 font-medium">
                Strategic, technical, and commercial advice designed to help clients make informed decisions, reduce risk, and improve performance. Our team brings deep industry expertise and a commitment to delivering practical, results-driven solutions tailored to your unique challenges.
              </p>
            </div>

            {/* Right Value Delivered Box */}
            <div className="lg:col-span-3 bg-[#f8fafc] border-t lg:border-t-0 lg:border-l border-gray-200 p-6 md:p-8 flex flex-col justify-center relative">
              <div className="w-10 h-10 md:w-11 md:h-11 border-2 border-secondary-dark/30 text-secondary-dark rounded-lg flex items-center justify-center mb-3 shrink-0 bg-white shadow-2xs">
                <TbShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-oswald text-lg md:text-xl font-bold text-secondary-dark mb-2">
                Value Delivered
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-gray-600 font-medium">
                Clear strategic direction, reduced operational risk, stronger decision-making, improved compliance, and practical implementation plans.
              </p>
            </div>
          </div>

          {/* Lower Grid: What We Deliver 3-Column Checklist */}
          <div className="border-t border-gray-200 bg-white">
            <div className="flex items-center border-y border-gray-200 flex-col md:flex-row py-3 px-4 md:px-8">
              <h2 className="text-lg md:text-xl font-bold font-oswald text-secondary uppercase tracking-wide">
                What <span className="text-secondary-dark">We Deliver</span>
              </h2>
            </div>
            <div className="grid grid-cols-1  px-4 md:px-8 py-5 md:grid-cols-2 lg:grid-cols-3 gap-y-3.5 gap-x-6">
              {deliverables.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                    <TbCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-gray-700 leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container max-w-7xl mx-auto">
        <div className="bg-white md:border-x md:border-b border-gray-200">
          <div className="flex items-center py-3 px-4 md:px-8">
            <h2 className="text-lg md:text-xl font-bold font-oswald text-secondary uppercase tracking-wide">
              How <span className="text-secondary-dark">We Deliver</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 bg-white border-t border-gray-200">
            {deliverySteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === activeStepIdx;
              return (
                <article
                  key={step.title}
                  onClick={() => setActiveStepIdx(idx)}
                  className={`relative flex flex-row md:flex-col items-center overflow-hidden border-b sm:border-b-0 lg:border-b-0 lg:border-r border-gray-200 last:border-r-0 pt-0 md:pt-6 cursor-pointer transition-all duration-300 ${isActive ? "bg-primary text-white" : "bg-white text-secondary-dark"
                    }`}
                >
                  <div className="w-0 md:w-full pointer-events-none overflow-hidden">
                    <Image
                      src={stepArrow}
                      alt="Arrow"
                      priority
                      className={`absolute inset-0 w-full object-cover transition-opacity duration-500 ease-in-out ${isActive ? "opacity-0" : "opacity-100"}`}
                    />
                    <Image
                      src={stepArrowActive}
                      alt="Arrow"
                      priority
                      className={`absolute inset-0 w-full object-cover transition-opacity duration-500 ease-in-out ${isActive ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  <div className="relative md:min-h-[80px] z-2 shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                    <StepIcon className={`absolute h-6 w-6 md:h-12 md:w-12 transition-all duration-500 ease-in-out ${isActive ? "opacity-0 scale-90 pointer-events-none text-white" : "opacity-100 scale-100 text-secondary-dark"}`} />
                    <p className={`absolute text-4xl font-semibold font-oswald flex justify-center items-center w-10 transition-all duration-500 ease-in-out ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}>{step.step}</p>
                  </div>
                  <div className={`relative z-[1] mt-0 md:mt-5 flex w-full flex-1 flex-col items-center gap-1.5 border-l md:border-l-0 md:border-t border-gray-200 px-3.5 pb-5 pt-3 text-center transition-colors duration-500 ease-in-out ${isActive ? "bg-[#fff3f6]" : "bg-[#f8fafc]"}`}>
                    <h3 className={`w-full text-base md:text-[17px] font-bold transition-colors duration-500 ${isActive ? "text-primary" : "text-secondary-dark"}`}>{step.title}</h3>
                    <p className="w-full text-xs md:text-[13px] px-0 md:px-2 text-gray-600 font-medium leading-relaxed">{step.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="bg-white border-x border-b border-gray-200">
          <div className="flex items-center border-b border-gray-200 py-3 px-4 md:px-8">
            <h2 className="text-lg md:text-xl font-bold font-oswald text-secondary uppercase tracking-wide">
              Our Service <span className="text-secondary-dark">Standards</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {serviceStandards.map((standard) => {
              const StandardIcon = standard.icon;
              return (
                <article
                  key={standard.title}
                  className="flex md:min-h-[140px] items-start gap-4 border-r border-b border-gray-200 bg-white p-5 md:p-6"
                >
                  <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-primary/5 text-primary flex items-center justify-center">
                    <StandardIcon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="w-full text-base md:text-[17px] font-bold text-gray-900">
                      {standard.title}
                    </h3>
                    <p className="w-full text-sm md:text-[14px] leading-relaxed text-gray-600 font-medium">
                      {standard.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="container max-w-7xl mx-auto bg-white border border-t-0 border-gray-200 py-3 md:py-5 px-4 md:px-8">
        <p className="text=xl md:text-3xl font-oswald font-bold text-gray-800 uppercase flex flex-col md:flex-row justify-center gap-2 md:gap-8"><span className="text-secondary">Delivered with Expertise. </span><span className="text-primary">Managed with Discipline. </span><span className="text-secondary-dark">Built for Lasting Maritime Impact.</span></p>
      </section>

      <ContactUs />
    </>
  );
}

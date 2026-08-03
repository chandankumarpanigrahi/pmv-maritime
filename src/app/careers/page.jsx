"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SubBanner from "@/components/Sub Banner/page";
import SubHeading from "@/design/sub-heading/page";
import styles from "./style.module.css";

import bannerBg from "../../../public/assets/images/map-bg.png";

// Images
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

import sea from "../../../public/assets/svg/sea.svg";
import ship from "../../../public/assets/svg/ship.svg";

import {
  TbCompass,
  TbShip,
  TbUserShield,
  TbCheck,
  TbArrowUpRight,
  TbAnchor,
  TbBriefcase,
  TbCircleCheck,
  TbMail,
  TbMapPin,
  TbClock,
  TbCalendar,
  TbX,
  TbSend,
} from "react-icons/tb";
import ContactUs from "@/components/Contact Us/page";

const careerEmail = "careers@pmvmaritime.com";

const directionImages = [image1, image2, image3];

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

const proudBenefits = [
  {
    title: "Well-being Program 'Well at PMV'",
    description:
      "Helps crews engage mentally and physically to maintain highest standards of safety and comfort.",
  },
  {
    title: "Medical Benefits",
    description:
      "Comprehensive medical coverage for family members and dependents while at sea.",
  },
  {
    title: "Continuous Feedback System",
    description:
      "Designed for seafarers and office staff to excel at their work and consistently improve skills.",
  },
  {
    title: "Office Job Opportunities",
    description:
      "Transition opportunities from sea to shore as a natural part of your career progression.",
  },
  {
    title: "Support for Crew Marriage",
    description:
      "Comprehensive family care program to nurture relationships and personal welfare ashore.",
  },
  {
    title: "The One PMV Platform",
    description:
      "Keeps Commercial, Technical, and Crew Management aligned in one single organization.",
  },
];

const tabInfo = {
  sea: {
    badge: "Career at SEA",
    heading: (
      <>
        <span className="text-secondary">Life at Sea</span>
        <span className="text-primary">,</span>
        <br />
        Built on Excellence
        <span className="text-primary">.</span>
      </>
    ),
    description:
      "With 90% of our staff employed onboard our vessels, their wellbeing, working conditions, and career opportunities are critical to our success.",
  },
  shore: {
    badge: "Career at SHORE",
    heading: (
      <>
        <span className="text-secondary">A Global Team</span>
        <span className="text-primary">,</span>
        <br />
        Many Opportunities
        <span className="text-primary">.</span>
      </>
    ),
    description:
      "We offer excellent training and further education opportunities and promote from within whenever possible across shipping-specific roles and other corporate functions.",
  },
};

function ProudBenefit({ benefit }) {
  return (
    <article className="flex min-w-0 items-start gap-3.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary bg-[#fdf2f4] text-primary mt-0.5">
        <TbCheck className="h-3 w-3" />
      </span>
      <div className="min-w-0">
        <h3 className="text-base md:text-[16px] font-bold text-gray-700">
          {benefit.title}
        </h3>
        <p className="text-xs md:text-[13px] text-gray-600 font-medium leading-relaxed mt-1">
          {benefit.description}
        </p>
      </div>
    </article>
  );
}

export default function Careers() {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("sea");
  const [selectedJob, setSelectedJob] = useState(null);
  const [careerPositions, setCareerPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic positions from MongoDB API
  useEffect(() => {
    async function fetchCareers() {
      try {
        const res = await fetch("/api/careers", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setCareerPositions(data);
          }
        }
      } catch (err) {
        console.error("Failed to load careers from API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  // Auto-play interval for image slideshow (5-second duration)
  useEffect(() => {
    const totalImages = directionImages.length;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedJob(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedJob]);

  // Filter jobs dynamically by active tab category ("sea" or "shore"), excluding archived positions
  const activePositions = careerPositions.filter(
    (job) => (job.category || "sea") === activeTab && !job.archived
  );

  return (
    <>
      <SubBanner
        Heading="Careers"
        breadcrumbItems={[{ label: "Careers", href: "/careers" }]}
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
              <SubHeading title="Career at PMV" className="mb-4 md:mb-6" />
              <h1 className="font-oswald text-4xl md:text-5xl text-secondary font-bold mb-2 md:mb-3">
                Working <span className="text-secondary-dark">at PMV</span><span className="text-primary">.</span>
              </h1>

              <p className="text-sm md:text-[15px] max-w-full md:max-w-[90%] text-gray-600 font-medium">
                At PMV Maritime, we believe our people are our greatest strength. Whether at sea or on shore, we empower our teams to grow, collaborate, and make a real impact in the maritime industry.
              </p>
            </div>
            <div className="w-full md:w-5/12 hidden flex-col mt-6 md:mt-0">
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
                <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-primary/5 text-primary flex items-center justify-center">
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

      <main className="bg-white pb-12 md:pb-16">
        <section className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:p-8 gap-3 md:gap-8 overflow-hidden border-x border-b border-gray-200 bg-white lg:flex-row">
            <div className="w-full md:w-3/7 h-[220px] md:h-auto relative overflow-hidden shadow-md group/img">
              {directionImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Our Direction ${idx + 1}`}
                  fill
                  className={`object-cover transition-all duration-1000 ease-in-out group-hover/img:scale-105 ${idx === currentImageIdx ? "opacity-100 z-1" : "opacity-0 z-0"
                    }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={idx === 0}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-2"></div>

              {/* Pagination Dots Pill */}
              <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs z-10">
                {directionImages.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentImageIdx(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${currentImageIdx === dotIdx ? "w-6 bg-primary" : "w-2 bg-white/70 hover:bg-white"
                      }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-4 md:p-0 min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-secondary-dark">
                What Makes Us Proud
              </h2>
              <div className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-2">
                {proudBenefits.map((benefit) => (
                  <ProudBenefit key={benefit.title} benefit={benefit} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
          <Image
            src={bannerBg}
            alt="Banner Background"
            className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 -top-1/2"
          />
          <div className="w-full flex flex-col border border-t-0 relative z-2 border-gray-200">
            <div className="flex flex-col md:flex-row py-6 px-4 md:px-8">
              <div className="flex flex-col md:flex-row w-full items-center justify-between">
                <SubHeading title="Choose your career path" />
                <div className="flex items-center mt-4 md:mt-0 gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("sea")}
                    className={`cursor-pointer flex items-center gap-1.5 md:gap-2.5 px-2 md:px-4 py-2 font-bold text-xs md:text-sm tracking-wide transition-all ${activeTab === "sea"
                      ? "border border-primary bg-primary text-white"
                      : "border border-secondary-dark bg-white text-secondary-dark hover:bg-slate-50"
                      }`}
                  >
                    <TbAnchor className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="text-[14px] md:text-lg whitespace-nowrap">Career at Sea</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("shore")}
                    className={`cursor-pointer flex items-center gap-1.5 md:gap-2.5 px-2 md:px-4 py-2 font-bold text-xs md:text-sm tracking-wide transition-all ${activeTab === "shore"
                      ? "border border-primary bg-primary text-white"
                      : "border border-secondary-dark bg-white text-secondary-dark hover:bg-slate-50"
                      }`}
                  >
                    <TbBriefcase className="h-4 md:h-5 w-4 md:w-5" />
                    <span className="text-[14px] md:text-lg whitespace-nowrap">Career at Shore</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div >

        <section className="container mx-auto max-w-7xl">
          <div className="flex flex-col border-x border-b border-gray-200 bg-white lg:flex-row">
            <aside
              className={`md:min-h-[360px] border-b border-gray-200 bg-white p-6 md:p-8 lg:w-[320px] lg:border-b-0 lg:border-r ${styles.jobInfoPattern}`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="font-oswald text-xs md:text-sm font-bold uppercase tracking-wider text-primary">
                    {tabInfo[activeTab].badge}
                  </p>
                  <h3 className="font-oswald text-2xl md:text-3xl font-bold text-secondary-dark leading-tight">
                    {tabInfo[activeTab].heading}
                  </h3>
                  <span className="h-1 w-12 rounded-sm bg-secondary-dark mt-1" />
                </div>
                <p className="text-xs md:text-sm font-medium text-gray-600 leading-relaxed mt-2">
                  {tabInfo[activeTab].description}
                </p>
              </div>
            </aside>

            <div className="min-w-0 flex-1 border-r border-gray-200">
              <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-[200px_140px_minmax(200px,1fr)_max-content] items-center gap-4 md:gap-6 border-b border-gray-200 px-6 py-4 font-bold text-xs md:text-sm uppercase text-secondary-dark tracking-wider lg:px-8 bg-gray-50/50">
                    <p>Positions</p>
                    <p>Location</p>
                    <p>Department</p>
                    <span aria-hidden="true" />
                  </div>
                  <div>
                    {loading ? (
                      <div className="p-8 text-center text-sm font-medium text-gray-500">
                        Loading career positions...
                      </div>
                    ) : activePositions.length === 0 ? (
                      <div className="p-8 text-center text-sm font-medium text-gray-500">
                        No positions available for {tabInfo[activeTab].badge}.
                      </div>
                    ) : (
                      activePositions.map((row) => (
                        <div
                          key={row._id || row.id}
                          className="grid grid-cols-[200px_140px_minmax(200px,1fr)_max-content] items-center gap-4 md:gap-6 border-b border-gray-200 px-6 py-3.5 text-xs md:text-sm lg:px-8 hover:bg-primary/5 transition-colors"
                        >
                          <p className="font-bold whitespace-nowrap text-secondary-dark text-sm md:text-[15px]">{row.position}</p>
                          <p className="font-medium text-gray-600 text-xs md:text-sm">{row.location}</p>
                          <p className="font-medium text-gray-600 text-xs md:text-sm">{row.department}</p>
                          <button
                            type="button"
                            onClick={() => setSelectedJob(row)}
                            className="cursor-pointer flex items-center gap-1.5 whitespace-nowrap text-xs md:text-sm font-bold text-primary hover:text-primary-hover transition-colors"
                          >
                            View Details
                            <TbArrowUpRight className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl">
          <div
            id="apply"
            className="relative min-h-[300px] overflow-hidden border-x border-b border-gray-200 px-6 py-8 md:px-8 md:py-10"
          >
            <Image
              src={sea}
              alt="sea"
              fill
              sizes="(min-width: 1024px) 1380px, 100vw"
              className="object-cover object-center"
              aria-hidden="true"
            />
            <Image
              src={ship}
              alt="ship"
              className="absolute right-0 bottom-2 z-1 h-[100px] w-fit"
              aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col gap-6 w-full lg:flex-row lg:items-end lg:justify-between">
              <div className="w-full">
                <h2 className="font-oswald text-2xl md:text-3xl font-bold text-secondary">
                  Ready to <span className="text-secondary-dark">Join PMV</span>
                  <span className="text-primary">?</span>
                </h2>
                <p className="mt-2 text-xs md:text-sm text-gray-600 font-medium leading-relaxed">
                  Interested candidates can apply for a specific job by sending
                  their CV to our email.
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  <li className="flex items-center gap-2.5 text-xs md:text-sm text-gray-600 font-medium">
                    <TbCircleCheck className="h-4 w-4 shrink-0 text-primary" />
                    <span>
                      Please mention the{" "}
                      <strong className="font-bold text-secondary-dark">Job Position</strong> in the
                      email subject line.
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-xs md:text-sm text-gray-600 font-medium">
                    <TbCircleCheck className="h-4 w-4 shrink-0 text-primary" />
                    <span>
                      Our team will review your application and get in touch with
                      suitable opportunities.
                    </span>
                  </li>
                </ul>
              </div>

              <a
                href={`mailto:${careerEmail}`}
                className="flex w-fit items-center gap-4 border border-gray-200 bg-white px-4 py-3 shadow-sm transition-all hover:border-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center bg-[#ffeff3] shrink-0 text-primary">
                  <TbMail className="h-5 w-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    Send your application to
                  </span>
                  <span className="text-sm md:text-base font-bold text-primary">
                    {careerEmail}
                  </span>
                </span>
              </a>
            </div>
          </div>
        </section>
      </main >

      {/* Job Details Modal */}
      {selectedJob && (() => {
        const formatDateDDMMYYYY = (dateStr) => {
          if (!dateStr) return "";
          const parts = dateStr.split("T")[0].split("-");
          if (parts.length === 3 && parts[0].length === 4) {
            const [year, month, day] = parts;
            return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
          }
          return dateStr;
        };

        const details = {
          position: selectedJob.position,
          location: selectedJob.location,
          department: selectedJob.department,
          type: selectedJob.type || "Full Time",
          deadline: formatDateDDMMYYYY(selectedJob.deadline),
          overview:
            selectedJob.overview ||
            `PMV Maritime is inviting qualified candidates to apply for the position of ${selectedJob.position} in our ${selectedJob.department} department (${selectedJob.location}). Join a global team dedicated to excellence, crew safety, and maritime innovation.`,
          responsibilities: (Array.isArray(selectedJob.responsibilities) && selectedJob.responsibilities.length > 0)
            ? selectedJob.responsibilities
            : [
              `Perform daily operational, navigation, or engineering duties for ${selectedJob.department}`,
              "Adhere strictly to SOLAS, MARPOL, ISM Code, and internal safety protocols",
              "Maintain clear documentation, logs, and routine maintenance reports",
              "Coordinate with port authorities, shore operations, and vessel management",
            ],
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn">
            {/* Backdrop overlay click */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setSelectedJob(null)}
            />

            {/* Modal Dialog Box */}
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white shadow-2xl border border-gray-200 z-10 overflow-hidden">
              {/* Header */}
              <div className="flex items-start justify-between p-5 md:p-6 border-b border-gray-200 bg-[#f7f5f8]">
                <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                  <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-primary/10 text-primary">
                    {details.department}
                  </span>
                  <h2 className="font-oswald text-2xl md:text-3xl font-bold text-secondary-dark leading-tight mt-1">
                    {details.position}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <TbMapPin className="h-4 w-4 text-primary" />
                      {details.location}
                    </span>
                    <span className="h-3 w-px bg-gray-300" />
                    <span className="flex items-center gap-1">
                      <TbBriefcase className="h-4 w-4 text-primary" />
                      {details.type}
                    </span>
                    {details.deadline && (
                      <>
                        <span className="h-3 w-px bg-gray-300" />
                        <span className="flex items-center gap-1">
                          <TbCalendar className="h-4 w-4 text-primary" />
                          {details.deadline}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="cursor-pointer p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <TbX className="h-6 w-6" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5">
                    Job Overview
                  </h3>
                  <p className="text-xs md:text-sm font-medium text-gray-600 leading-relaxed">
                    {details.overview}
                  </p>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {details.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-medium text-gray-600">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                          <TbCheck className="h-3 w-3" />
                        </span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 md:px-6 border-t border-gray-200 bg-gray-50/80">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="cursor-pointer w-1/2 sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 font-bold text-xs md:text-sm hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${careerEmail}?subject=Application for ${encodeURIComponent(details.position)} position (${details.location})`}
                    className="cursor-pointer flex items-center justify-center gap-2 w-1/2 sm:w-auto px-5 py-2 bg-primary text-white font-bold text-xs md:text-sm hover:bg-primary-hover shadow-sm transition-colors"
                  >
                    <TbSend className="h-4 w-4" />
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <ContactUs />
    </>
  );
}

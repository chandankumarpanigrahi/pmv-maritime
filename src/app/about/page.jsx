"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SubBanner from "@/components/Sub Banner/page";
import SubHeading from "@/design/sub-heading/page";
import Projects from "@/components/Projects Section/page";

// Images
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

// Members
import member1 from "../../../public/assets/members/member1.png";
import member2 from "../../../public/assets/members/member2.png";
import member3 from "../../../public/assets/members/member3.png";
import member4 from "../../../public/assets/members/member4.png";

const directionImages = [image1, image2, image3];

// icons
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa";
import { TbMailFilled } from "react-icons/tb";
import { FaXTwitter } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import Accreditation from "@/components/Accreditation/page";

const teamMembers = [
  {
    name: "Samir Raj Deasi",
    role: "Ganeral Manager",
    image: member1,
    socials: {
      email: "info@pmvmaritime.com",
      linkedin: "https://linkedin.com/in/vikpatra",
      x: "https://x.com/vikpatra",
      facebook: "https://facebook.com/vikpatra",
      instagram: "https://instagram.com/vikpatra",
      whatsapp: "https://whatsapp.com/vikpatra",
      website: "https://pmvmaritime.com"
    }
  },
  {
    name: "Capt. Rajesh Sharma",
    role: "Head of Port Operations",
    image: member2,
    socials: {
      email: "r.sharma@pmvmaritime.com",
      linkedin: "https://linkedin.com/in/rajeshsharma",
      whatsapp: "https://whatsapp.com/rajeshsharma"
    }
  },
  {
    name: "Sarah Jenkins",
    role: "Director of Fleet Management",
    image: member3,
    socials: {
      email: "s.jenkins@pmvmaritime.com",
      linkedin: "https://linkedin.com/in/sarahjenkins",
      instagram: "https://instagram.com/sarahjenkins"
    }
  },
  {
    name: "Elena Rostova",
    role: "Chief Digital Officer",
    image: member4,
    socials: {
      email: "e.rostova@pmvmaritime.com",
      linkedin: "https://linkedin.com/in/elenarostova",
      x: "https://x.com/elenarostova",
      website: "https://elenarostova.dev"
    }
  }
];

export default function About() {
  const [activeTab, setActiveTab] = useState("mission");
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Auto-play interval for image slideshow (5-second duration)
  useEffect(() => {
    const totalImages = directionImages.length;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % totalImages);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const tabContents = {
    mission: "Our mission is to engineer maritime excellence through forward-thinking innovation, uncompromising safety, and environmental compliance. We combine senior maritime expertise and global reach to deliver safe, highly efficient, and sustainable marine operations. By prioritizing operational integrity, we protect life at sea and optimize critical ocean-bound supply chains. We continuously strive to build trusted partnerships, ensuring every vessel is managed with the highest standard of care.",
    vision: "Our vision is to be the world's most trusted partner in sustainable maritime operations, defining the future of marine logistics through digital innovation, carbon-neutral initiatives, and exceptional service quality. We aspire to connect global markets seamlessly while preserving our oceans for generations to come.",
    goals: "Provide connected services across consultancy, training, fleet management, crew management, port operations, digitisation, shipbuilding, environmental protection, recruitment, education, and maritime projects."
  };

  return (
    <>
      <SubBanner Heading="About Us" breadcrumbItems={[{ label: "About Us", href: "/about" }]} />
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative border border-t-0 border-gray-200 bg-[#f7f5f8]">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col w-full py-6 md:py-4 md:w-7/12 px-4 md:px-8 my-auto">
            <h1 className="font-oswald text-4xl md:text-5xl text-secondary font-bold mb-3 md:mb-6">Beyond the Horizon<span className="text-primary">,</span><br /><span className="text-secondary-dark">Leading with Trust</span><span className="text-primary">.</span></h1>
            <p className="text-sm md:text-[15px] max-w-full md:max-w-[80%] text-gray-600 font-medium">PMV Maritime is a global maritime leader with 20+ years of experience in port operations, fleet management, and logistics consultancy. We combine technical precision with visionary management to curate the flow of global commerce with a commitment to sustainability and digital-first operations.</p>
          </div>
          <div className="hidden w-full md:w-5/12 md:flex h-auto flex-col mt-6 md:mt-0">
            <video src="/video/about-video.mp4" autoPlay loop muted playsInline></video>
          </div>
        </div>
      </div >

      <div className="container max-w-7xl mx-auto border border-t-0 border-gray-200 bg-white relative">
        <div className="flex flex-col md:flex-row py-8 px-4 md:px-8 gap-8 md:gap-12 items-stretch">
          {/* Left Column: Image Slider Container */}
          <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[300px] relative overflow-hidden shadow-md group/img">
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

          {/* Right Column: Direction Tabs */}
          <div className="w-full md:w-1/2 flex flex-col justify-center pb-0 pt-4 md:pb-4">
            <SubHeading title="Our Direction" className="mb-2 md:mb-3" />

            {/* Headline */}
            <h2 className="font-oswald text-3xl sm:text-4xl md:text-[42px] text-secondary font-bold mb-8 leading-tight">
              What Drives Us <span className="text-secondary-dark">Forward</span>
            </h2>

            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 mb-4 gap-6 md:gap-10">
              {["Mission", "Vision", "Goals"].map((tab) => {
                const tabId = tab.toLowerCase();
                const isActive = activeTab === tabId;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tabId)}
                    className={`pb-2.5 text-base md:text-lg font-bold tracking-wide uppercase transition-all duration-300 relative -mb-[2px] ${isActive
                      ? "text-primary border-b-2 border-primary font-bold"
                      : "text-gray-500 border-b-2 border-transparent hover:text-secondary-dark font-medium"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[150px] md:min-h-[160px]">
              <p className="text-sm md:text-[16px] text-gray-600 font-medium leading-relaxed">
                {tabContents[activeTab]}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Projects />
      <div className="container max-w-7xl mx-auto border border-t-0 border-gray-200 bg-white relative">
        <div className="flex flex-col md:flex-row w-full gap-3 md:gap-0 py-8 px-4 md:px-8">
          <div className="flex flex-col w-full">
            <SubHeading title="Our Team" className="mb-4 md:mb-6" />
            <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">Meet the <span className="text-secondary-dark">People</span> Behind <span className="text-secondary-dark">PMV Maritime</span><span className="text-primary">.</span><br /></h1>
            <p className="text-sm md:text-[15px] max-w-full md:max-w-[60%] text-gray-600 font-medium">Our leadership team combines maritime expertise with digital innovation to drive excellence across every operation.</p>
          </div>
          <Link
            href="/projects"
            className="mt-auto whitespace-nowrap mr-auto md:mr-0 ml-0 md:ml-auto group w-fit text-md flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-white border-secondary text-secondary border hover:border-secondary-hover hover:text-secondary-hover font-bold transition-all duration-300"
          >
            All Members <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-gray-200 gap-px border-t border-gray-200">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col gap-1 p-4 md:px-8 md:pb-4 md:pt-6 bg-white group">
              <div className="min-h-[200px] relative bg-gradient-to-t from-neutral-200 via-transparent to-neutral-300 overflow-hidden">
                <div className="h-[10px] w-[1000px] bg-secondary -rotate-43 absolute -bottom-64 -right-40 z-10 group-hover:h-[200px] group-hover:translate-29 transition-all linear duration-500"></div>
                <div className="h-[20px] w-[1000px] bg-primary -rotate-43 absolute -bottom-58 -right-40 z-10 group-hover:h-[1000px] group-hover:-translate-24 transition-all linear duration-500"></div>
                <Image src={member.image} alt={member.name} className="h-full object-contain object-bottom relative z-10" fill />
              </div>
              <h3 className="text-xl font-bold font-oswald text-gray-900">{member.name}</h3>
              <p className="text-sm text-secondary uppercase font-semibold">{member.role}</p>
              <div className="flex flex-wrap flex-row gap-1">
                {member.socials.email && (
                  <a href={`mailto:${member.socials.email}`} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <TbMailFilled className="scale-120" />
                  </a>
                )}
                {member.socials.linkedin && (
                  <a href={member.socials.linkedin} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <FaLinkedinIn />
                  </a>
                )}
                {member.socials.x && (
                  <a href={member.socials.x} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <FaXTwitter />
                  </a>
                )}
                {member.socials.facebook && (
                  <a href={member.socials.facebook} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <FaFacebookF />
                  </a>
                )}
                {member.socials.instagram && (
                  <a href={member.socials.instagram} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <FaInstagram />
                  </a>
                )}
                {member.socials.whatsapp && (
                  <a href={member.socials.whatsapp} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <FaWhatsapp />
                  </a>
                )}
                {member.socials.website && (
                  <a href={member.socials.website} target="_blank" className="bg-primary/7 hover:bg-primary transition-all duration-300 hover:text-white p-2 text-primary">
                    <FaGlobe />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Accreditation />
    </>
  );
}
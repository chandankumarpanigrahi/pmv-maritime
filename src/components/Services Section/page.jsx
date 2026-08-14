"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons — static 2×2 grid icons (same for all tabs)
import { FaArrowRight } from "react-icons/fa";
import { TbTarget, TbShieldCheck, TbActivity, TbGlobe } from "react-icons/tb";
import { MdOutlineAnchor } from "react-icons/md";

// Icon library helper
import { PRESET_ICONS } from "@/lib/maritimeIcons";

import bannerBg from "../../../public/assets/images/map-bg.png";
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

const IMAGES = [image1, image2, image3];

// Static icons cycle for 2×2 benefit grid
const BENEFIT_ICONS = [TbTarget, TbShieldCheck, TbActivity, TbGlobe];

// Resolve icon component by string ID from PRESET_ICONS
function getIconComponent(iconId) {
  const match = PRESET_ICONS.find((i) => i.id === iconId);
  return match?.Icon || MdOutlineAnchor;
}

export default function Services() {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Fetch first 5 published services — with retry for cold-start DB latency
  useEffect(() => {
    let cancelled = false;

    async function fetchServices(attempt = 1) {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data)) {
          setTabs(data.slice(0, 5));
        }
      } catch (err) {
        console.error(`Services Section fetch attempt ${attempt} failed:`, err);
        // Retry up to 3 times with exponential backoff (1s, 2s, 4s)
        if (!cancelled && attempt < 3) {
          setTimeout(() => fetchServices(attempt + 1), 1000 * attempt);
          return;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchServices();
    return () => { cancelled = true; };
  }, []);

  // Image slideshow auto-play — independent of active tab
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  const activeService = tabs[activeTab] || null;

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto border border-t-0 border-gray-200 py-12 px-8 bg-white animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    );
  }

  if (!activeService) return null;

  // Build benefit items from first 4 deliverables
  const deliverables = Array.isArray(activeService.deliverables) ? activeService.deliverables : [];
  const benefitItems = BENEFIT_ICONS.map((Icon, i) => ({
    Icon,
    label: deliverables[i] || "",
  })).filter((b) => b.label);

  const TabIcon = getIconComponent(activeService.icon);

  return (
    <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
      <Image src={bannerBg} alt="Banner Background" className="object-cover opacity-50 pointer-events-none z-0 absolute right-0" />
      <div className="w-full flex flex-col border border-t-0 border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row py-8 px-4 md:px-8">
          <div className="flex flex-col w-full md:w-7/12">
            <SubHeading title="Services" className="mb-4 md:mb-8" />
            <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
              End-to-End <span className="text-secondary-dark">Maritime Solutions</span><span className="text-primary">.</span><br />
              Expertise You Can Trust<span className="text-primary">.</span>{" "}
              <span className="text-secondary-dark">Delivered with Confidence</span><span className="text-primary">.</span>
            </h1>
            <p className="text-sm md:text-[15px] max-w-[90%] md:max-w-[60%] text-gray-600 font-medium">
              PMV Maritime Solutions Limited delivers integrated maritime services
              through technical expertise, operational excellence, and digital
              innovation for safer, smarter, and more efficient maritime operations.
            </p>
          </div>

          <div className="w-full md:w-5/12 flex flex-col mt-6 md:mt-0 justify-end items-start md:items-end">
            <Link
              href="/services"
              className="group w-fit text-[14px] flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-primary hover:bg-primary-hover text-white font-bold tracking-wider uppercase shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              View All Services{" "}
              <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
            </Link>
          </div>
        </div>

        {/* Tab Headers */}
        <div>
          <div className="flex overflow-x-auto md:grid md:grid-cols-5 gap-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory border-b border-gray-200">
            {tabs.map((tab, idx) => {
              const IconComp = getIconComponent(tab.icon);
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab._id || idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex flex-row gap-3 items-center px-3 pt-2 pb-3 border-b-3 transition-all duration-300 ease-in-out cursor-pointer text-left snap-start flex-shrink-0 min-w-[220px] md:min-w-0 md:w-full group ${
                    isActive
                      ? "border-secondary text-secondary font-bold"
                      : "border-b-gray-400 hover:border-secondary hover:bg-primary text-gray-500 hover:text-white font-semibold"
                  }`}
                >
                  <IconComp
                    className={`text-4xl flex-shrink-0 transition-colors duration-300 ${
                      isActive ? "text-secondary" : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <p
                    className={`text-[16px] leading-tight whitespace-nowrap transition-colors duration-300 ${
                      isActive ? "text-gray-900 font-bold" : "text-gray-500 group-hover:text-white font-semibold"
                    }`}
                  >
                    {tab.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 bg-white">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
            {/* Left: Image Slideshow */}
            <div className="w-full lg:w-1/2 min-h-[200px] lg:min-h-[300px] relative overflow-hidden shadow-lg group/img flex-shrink-0">
              <Image
                src={IMAGES[currentImageIdx]}
                alt={activeService.name}
                fill
                className="object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs z-10">
                {IMAGES.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentImageIdx(dotIdx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      currentImageIdx === dotIdx ? "w-6 bg-primary" : "w-2 bg-white/70 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Title, Description, Benefits, Link */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between py-2">
              <div>
                {/* Header: icon + title */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center p-2 bg-primary/5 text-primary">
                    {TabIcon({ className: "text-2xl" })}
                  </div>
                  <h3 className="text-xl md:text-2xl text-secondary-dark font-bold">
                    {activeService.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-[17px] leading-normal mt-2.5">
                  {activeService.shortDesc}
                </p>

                {/* 2×2 Benefits Grid from deliverables */}
                {benefitItems.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mt-6">
                    {benefitItems.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-3">
                        <div className="text-secondary text-2xl flex-shrink-0">
                          <benefit.Icon />
                        </div>
                        <span className="text-gray-800 font-semibold text-sm leading-snug">
                          {benefit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <Link
                  href={`/services/${activeService.slug || ""}`}
                  aria-label={`Work together on ${activeService.name || "maritime services"}`}
                  className="group inline-flex items-center gap-4 border border-primary text-primary hover:bg-primary hover:text-white font-bold text-[14px] px-4 py-2.5 uppercase tracking-wider transition-all duration-300 w-fit cursor-pointer"
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

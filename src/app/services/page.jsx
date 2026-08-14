"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

import { FaArrowRight } from "react-icons/fa";
import { MdOutlineAnchor } from "react-icons/md";
import { PRESET_ICONS } from "@/lib/maritimeIcons";

import bannerBg from "../../../public/assets/images/map-bg.png";
import SubBanner from "@/components/Sub Banner/page";

function getIconComponent(iconId) {
  const match = PRESET_ICONS.find((i) => i.id === iconId);
  return match?.Icon || MdOutlineAnchor;
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Services");

  useEffect(() => {
    let cancelled = false;

    async function fetchServices(attempt = 1) {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data)) setServices(data);
      } catch (err) {
        console.error(`Services page fetch attempt ${attempt} failed:`, err);
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

  // Build unique category list from DB data
  const serviceCategories = [
    "All Services",
    ...Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
  ];

  const filteredServices =
    activeTab === "All Services"
      ? services
      : services.filter((service) => service.category === activeTab);

  return (
    <>
      <SubBanner
        Heading="Our Services"
        breadcrumbItems={[{ label: "Our Services", href: "/services" }]}
      />

      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
          <div className="flex-col md:flex-row py-8 px-4 md:px-8 border-b border-gray-200">
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
          </div>

          {/* Service Category Tabs */}
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

      {/* Service Cards Grid */}
      <div className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-gray-200 bg-white">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col border-r border-b border-gray-200 p-4 md:p-6 min-h-[250px] animate-pulse bg-white">
              <div className="w-12 h-12 bg-gray-200 mb-5 rounded" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-2" />
              <div className="h-3 bg-gray-100 rounded w-4/5" />
            </div>
          ))
          : filteredServices.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <div
                key={service._id || index}
                className="flex flex-col border-r border-b border-gray-200 p-4 md:p-6 min-h-none md:min-h-[290px] bg-white hover:bg-primary group/card transition-all duration-300"
              >
                <div className="bg-primary/5 h-10 w-10 md:h-14 md:w-14 flex justify-center items-center mb-2 md:mb-6 group-hover/card:bg-blue-50 transition-all duration-300">
                  <IconComponent className="text-2xl md:text-3xl text-primary group-hover/card:text-secondary-dark transition-all duration-300" />
                </div>

                <h2 className="text-[18px] md:text-xl font-bold text-gray-900 group-hover/card:text-white mb-1 md:mb-2">
                  {service.name}
                </h2>

                <p className="text-gray-500 text-[12px] md:text-[14px] leading-normal md:leading-relaxed group-hover/card:text-white/80 mb-3 md:mb-6 flex-grow">
                  {service.shortDesc}
                </p>

                <Link
                  href={`/services/${service.slug}`}
                  aria-label={`Learn more about ${service.name}`}
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
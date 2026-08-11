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

function getIconComponent(iconId) {
  const match = PRESET_ICONS.find((i) => i.id === iconId);
  return match?.Icon || MdOutlineAnchor;
}

export default function PopularServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices(attempt = 1) {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data)) {
          // Items 6–9 (indices 5–8, after the 5 Services Section tabs)
          setServices(data.slice(5, 9));
        }
      } catch (err) {
        console.error(`Popular Services fetch attempt ${attempt} failed:`, err);
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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col border-r border-b border-gray-200 p-4 md:p-6 min-h-[250px] animate-pulse bg-white">
                <div className="w-12 h-12 bg-gray-200 mb-5 rounded" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))
          : services.map((service, index) => {
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

"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { LuShip, LuGlobe, LuUsers, LuAward } from "react-icons/lu";

import bannerBg from "../../../public/assets/images/map-bg.png";
import defaultImage from "../../../public/assets/images/about-image-1.jpg";

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchData(attempt = 1) {
      try {
        // Fetch projects from MongoDB API — with retry for cold-start DB latency
        const projectsRes = await fetch("/api/projects", { cache: "no-store" });
        if (!projectsRes.ok) throw new Error(`Projects HTTP ${projectsRes.status}`);
        let projectsList = [];
        const data = await projectsRes.json();
        if (Array.isArray(data)) projectsList = data;
        if (cancelled) return;
        setProjects(projectsList);

        // Fetch master project categories
        const masterRes = await fetch("/api/master?module=projects", { cache: "no-store" });
        let masterCatNames = [];
        if (masterRes.ok) {
          const masterData = await masterRes.json();
          if (Array.isArray(masterData) && masterData.length > 0) {
            masterCatNames = masterData
              .filter((item) => item.status === "Active")
              .map((item) => item.name);
          }
        }

        // Combine categories from master and projects
        const dbCatNames = Array.from(new Set(projectsList.map((p) => p.category).filter(Boolean)));
        const combined = Array.from(new Set([...masterCatNames, ...dbCatNames]));

        const finalCategories = combined.length > 0
          ? combined
          : ["Port Operations", "Fleet Management", "Maritime Consultancy", "Shipbuilding", "Digitisation"];

        if (!cancelled) setCategories(finalCategories);
      } catch (err) {
        console.error(`Projects Section fetch attempt ${attempt} failed:`, err);
        // Retry up to 3 times with exponential backoff (1s, 2s, 4s)
        if (!cancelled && attempt < 3) {
          setTimeout(() => fetchData(attempt + 1), 1000 * attempt);
          return;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const selectedCategory = categories[activeTab] || "";
  // Filter projects by selected category and limit to max 3
  const filteredProjects = projects
    .filter((project) => project.category === selectedCategory)
    .slice(0, 3);

  return (
    <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
      <div className="w-full flex flex-col border border-t-0 border-gray-200">
        <div className="flex flex-col md:flex-row py-8 px-4 md:px-8">
          <div className="flex flex-col w-full md:w-7/12">
            <SubHeading title="Our Projects" className="mb-4 md:mb-6" />

            <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
              Maritime Expertise<span className="text-primary">.</span>
              <br />
              <span className="text-secondary-dark">Transformed into Measurable Results</span>
              <span className="text-primary">.</span>
            </h1>

            <p className="text-sm md:text-[15px] max-w-full md:max-w-[70%] text-gray-600 font-medium">
              Explore how PMV Maritime Solutions delivers projects through technical
              expertise, digital innovation, industry knowledge, and disciplined
              execution across the global maritime sector.
            </p>
          </div>

          <div className="w-full md:w-5/12 flex flex-col mt-6 md:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 w-full mb-8 md:mb-6 mt-2">
              {/* Projects Delivered */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-r border-b md:border-b-0 border-gray-200/80">
                <LuShip className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  120+
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Projects Delivered
                </span>
              </div>

              {/* Maritime Sectors */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-b md:border-b-0 md:border-l-0 md:border-r border-gray-200/80">
                <LuGlobe className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  25+
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Maritime Sectors
                </span>
              </div>

              {/* Service Areas */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0 border-r border-gray-200/80">
                <LuUsers className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  20+
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Project Categories
                </span>
              </div>

              {/* Delivery Framework */}
              <div className="flex flex-col items-center text-center px-2 py-4 md:py-0">
                <LuAward className="w-7 h-7 text-secondary mb-3" />
                <span className="text-2xl md:text-3xl font-extrabold text-primary leading-none">
                  100%
                </span>
                <span className="text-[11px] md:text-xs text-gray-500 font-medium mt-1 leading-tight">
                  Delivery Focus
                </span>
              </div>
            </div>

            <Link
              href="/projects"
              className="mt-auto mr-auto md:mr-0 ml-0 md:ml-auto group w-fit text-md flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-white border-secondary text-secondary border hover:border-secondary-hover hover:text-secondary-hover font-bold transition-all duration-300"
            >
              View All Projects{" "}
              <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
            </Link>
          </div>
        </div>

        {/* Tabs Headers */}
        <div className="w-full border-b border-gray-200">
          <div className="flex overflow-x-auto gap-3 md:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {categories.map((category, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={category}
                  onClick={() => setActiveTab(idx)}
                  className={`pb-3 px-3 pt-2 text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-all duration-300 border-b-3 -mb-[1.5px] uppercase tracking-wider text-left snap-start flex-shrink-0 group ${isActive
                    ? "border-primary text-secondary-dark font-bold"
                    : "border-transparent text-gray-400 hover:text-gray-600 font-semibold"
                    }`}
                >
                  {category}
                </button>
              );
            })}

            {/* ALL PROJECTS TAB LINK */}
            <Link
              href="/projects"
              className="pb-3 px-3 pt-2 text-sm md:text-[15px] whitespace-nowrap cursor-pointer transition-all duration-300 border-b-3 -mb-[1.5px] uppercase tracking-wider text-left snap-start flex-shrink-0 text-gray-400 hover:text-gray-600 font-semibold border-transparent flex items-center gap-1 group"
            >
              <span>All Projects</span>
              <FaArrowRight className="text-xs transition-all duration-300 transform -rotate-45 translate-x-[-6px] -translate-y-0.5 opacity-0 group-hover:translate-x-1 group-hover:opacity-100 text-primary" />
            </Link>
          </div>
        </div>

        {/* Tab Content Display (Projects Grid - Max 3 Projects) */}
        <div className="bg-gray-50/30">
          <div className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3 items-stretch bg-gray-200">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col bg-white overflow-hidden p-6 min-h-[300px] animate-pulse">
                  <div className="h-[220px] bg-gray-200 mb-4 w-full" />
                  <div className="h-5 bg-gray-200 w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 w-full mb-2" />
                  <div className="h-3 bg-gray-100 w-2/3" />
                </div>
              ))
              : filteredProjects.map((project, idx) => {
                const projectTitle = project.title || project.name || "Untitled Project";
                const projectSlug = project.slug || projectTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
                const imgSrc = project.imageUrl || defaultImage;

                return (
                  <Link
                    key={project._id || idx}
                    href={`/projects/${projectSlug}`}
                    className="flex flex-col bg-white overflow-hidden group/card cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="relative h-[220px] w-full overflow-hidden flex-shrink-0 bg-slate-100">
                      {typeof imgSrc === "string" ? (
                        <Image
                          src={imgSrc}
                          alt={projectTitle}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                      ) : (
                        <Image
                          src={imgSrc}
                          alt={projectTitle}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-primary text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider">
                        {project.category || "General"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow p-5 md:p-6 justify-between">
                      <div>
                        {/* Title */}
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg md:text-xl font-bold text-secondary-gray-900 leading-tight">
                            {projectTitle}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed mt-3 line-clamp-3">
                          {project.shortDesc || project.description || ""}
                        </p>
                      </div>

                      <div>
                        {/* View Case Study link */}
                        <div className="flex items-center gap-1.5 text-xs md:text-[13px] font-bold text-primary hover:text-primary-hover group/link transition-colors duration-300 mt-3 pt-2">
                          <span>View Case Study</span>
                          <FaArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>

          {!loading && filteredProjects.length === 0 && (
            <div className="p-12 text-center text-gray-500 font-medium bg-white">
              No projects available in this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";

import bannerBg from "../../../public/assets/images/map-bg.png";
import defaultImage from "../../../public/assets/images/about-image-1.jpg";
import SubBanner from "@/components/Sub Banner/page";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(["All Projects"]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch published projects from API
        const projectsRes = await fetch("/api/projects", { cache: "no-store" });
        let projectsList = [];
        if (projectsRes.ok) {
          const data = await projectsRes.json();
          if (Array.isArray(data)) projectsList = data;
        }
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
        const allCatSet = new Set([...masterCatNames, ...dbCatNames]);
        setCategories(["All Projects", ...Array.from(allCatSet)]);
      } catch (err) {
        console.error("Failed to load projects data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedCategory = categories[activeTab] || "All Projects";
  const filteredProjects = activeTab === 0
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <SubBanner
        Heading="Our Projects"
        breadcrumbItems={[
          { label: "Our Projects", href: "/projects" }
        ]}
      />
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
          <div className="flex flex-col md:flex-row py-8 px-4 md:px-8 border-b border-gray-200">
            <div className="flex flex-col w-full md:w-7/12">
              <SubHeading title="Our Projects" className="mb-4 md:mb-6" />
              <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
                Maritime Expertise<span className="text-primary">.</span>
                <br />
                <span className="text-secondary-dark">Transformed into Measurable Results</span>
                <span className="text-primary">.</span>
              </h1>

              <p className="text-sm md:text-[15px] max-w-full md:max-w-[90%] text-gray-600 font-medium">
                Explore how PMV Maritime Solutions delivers projects through technical
                expertise, digital innovation, industry knowledge, and disciplined
                execution across the global maritime sector.
              </p>
            </div>
            <div className="w-full md:w-5/12 hidden flex-col mt-6 md:mt-0">
            </div>
          </div>

          {/* Tabs Headers */}
          <div className="w-full border-b pt-2 bg-white relative z-2 border-gray-200">
            <div className="flex overflow-x-auto gap-6 md:gap-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
              {categories.map((category, idx) => {
                const isActive = activeTab === idx;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveTab(idx);
                    }}
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

          {/* Tab Content Display (Projects Grid) */}
          <div className="bg-gray-50/30">
            <div className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3 items-stretch bg-gray-200">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col bg-white overflow-hidden p-6 min-h-[300px] animate-pulse">
                    <div className="h-[180px] bg-gray-200 mb-4 w-full" />
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
                    <div
                      key={project._id || idx}
                      className="flex flex-col bg-white overflow-hidden relative group/card cursor-pointer"
                    >
                      <div className="absolute z-10 top-2 left-2 bg-primary text-white px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                        {project.category || "General"}
                      </div>
                      {/* Image container with Next.js Image component */}
                      <div className="relative h-[160px] md:h-[220px] w-full overflow-hidden flex-shrink-0 bg-slate-100">
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
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow p-4 md:p-6 justify-between">
                        <div>
                          {/* Title and Arrow */}
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-lg md:text-xl font-bold text-secondary-gray-900 leading-tight">
                              {projectTitle}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed mt-2 md:mt-3 line-clamp-3">
                            {project.shortDesc || project.description || ""}
                          </p>
                        </div>

                        <div>
                          {/* View Case Study link */}
                          <Link
                            href={`/projects/${projectSlug}`}
                            className="flex items-center gap-1.5 text-xs md:text-[13px] font-bold text-primary hover:text-primary-hover group/link transition-colors duration-300 mt-3 pt-2"
                          >
                            <span>View Case Study</span>
                            <FaArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
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
    </>
  );
}
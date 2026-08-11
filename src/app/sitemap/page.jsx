"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SubBanner from "@/components/Sub Banner/page";
import styles from "./style.module.css";

import previewImgHome from "../../../public/assets/sitemap/Home.png";
import previewImgAbout from "../../../public/assets/sitemap/About.png";
import previewImgServices from "../../../public/assets/sitemap/Services.png";
import previewImgProjects from "../../../public/assets/sitemap/Projects.png";
import previewImgContact from "../../../public/assets/sitemap/Contact.png";
import previewImgCareer from "../../../public/assets/sitemap/Career.png";
import previewImgFaqs from "../../../public/assets/sitemap/FAQs.png";
import previewImgPrivacy from "../../../public/assets/sitemap/Privacy.png";
import previewImgTnC from "../../../public/assets/sitemap/TnC.png";
import previewImgSitemap from "../../../public/assets/sitemap/Sitemap.png";
import previewImgCopyrights from "../../../public/assets/sitemap/Copyrights.png";
import previewImgGallery from "../../../public/assets/sitemap/Gallery.png";

import { FiHome, FiMail, FiBriefcase, FiImage, FiFileText } from "react-icons/fi";
import {
  LuAnchor,
  LuUsers,
  LuFolderOpen,
  LuMessageSquare,
  LuShieldCheck,
  LuCopyright,
} from "react-icons/lu";
import { IoMdReturnRight } from "react-icons/io";
import { TbSitemap } from "react-icons/tb";

// Reusable Node Card Component with Interactive Hover Page Preview & 3D Cursor Follow Effect
function NodeCard({
  href,
  icon: Icon,
  title,
  subtitle,
  previewImage = previewImgHome,
  side = "right",
  className = "",
  isHome = false,
}) {
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX; // -1 to 1
    const deltaY = (y - centerY) / centerY; // -1 to 1

    setMousePos({
      x: deltaX * 18,
      y: deltaY * 18,
      rotateX: -deltaY * 8,
      rotateY: deltaX * 8,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className={`group relative hover:z-40 z-10 w-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`flex items-center gap-3.5 ${isHome
          ? "bg-[#002B49] hover:bg-[#AD1D41] text-white px-5 py-4 shadow-xl hover:shadow-2xl"
          : "bg-white border border-slate-300 hover:border-[#002B49] rounded-none p-3.5 md:p-4 shadow-md hover:shadow-xl"
          } transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer w-full`}
      >
        <div
          className={`${isHome
            ? "w-10 h-10 bg-[#AD1D41] group-hover:bg-white text-white group-hover:text-[#AD1D41]"
            : "w-10 h-10 md:w-12 md:h-12 bg-[#002B49] text-white group-hover:bg-[#AD1D41]"
            } flex items-center justify-center shrink-0 shadow-sm transition-colors`}
        >
          <Icon className="text-xl md:text-2xl" />
        </div>
        <div className="flex flex-col text-left min-w-0">
          <span
            className={`font-oswald font-bold ${isHome
              ? "text-xl tracking-widest text-white"
              : "text-base md:text-lg text-[#002B49] tracking-wider uppercase group-hover:text-[#AD1D41]"
              } transition-colors truncate`}
          >
            {title}
          </span>
          {subtitle && (
            <span className="text-xs md:text-sm font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5">
              <span className="text-[#AD1D41] font-bold text-sm">
                <IoMdReturnRight />
              </span>{" "}
              {subtitle}
            </span>
          )}
        </div>
      </Link>

      {/* FLOATING PAGE PREVIEW CARD (DESKTOP MODE ONLY - PURE IMAGE) */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out opacity-0 scale-90 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible group-hover:z-50 ${side === "left" ? "right-full mr-5" : "left-full ml-5"
          }`}
      >
        <div
          style={{
            transform: `perspective(800px) translate3d(${mousePos.x}px, ${mousePos.y}px, 0px) rotateX(${mousePos.rotateX}deg) rotateY(${mousePos.rotateY}deg)`,
            transition: "transform 0.12s ease-out",
          }}
          className="w-72 md:w-80 aspect-[16/10] bg-slate-800 shadow-2xl border-2 border-primary overflow-hidden ring-1 ring-black/10"
        >
          <img
            src={previewImage?.src || previewImage}
            alt={`${title} Page Preview`}
            className="w-full h-full object-cover object-top block"
          />
        </div>
      </div>
    </div>
  );
}

export default function SitemapTreePage() {
  useEffect(() => {
    const imagesToPreload = [
      previewImgHome,
      previewImgAbout,
      previewImgServices,
      previewImgProjects,
      previewImgContact,
      previewImgCareer,
      previewImgFaqs,
      previewImgPrivacy,
      previewImgTnC,
      previewImgSitemap,
      previewImgCopyrights,
      previewImgGallery,
    ];

    if (typeof window !== "undefined") {
      const preload = () => {
        imagesToPreload.forEach((imgObj) => {
          const srcUrl = imgObj?.src || imgObj;
          if (srcUrl) {
            const img = new window.Image();
            img.src = srcUrl;
          }
        });
      };

      if (document.readyState === "complete") {
        preload();
      } else {
        window.addEventListener("load", preload, { once: true });
      }
    }
  }, []);

  return (
    <>
      <SubBanner
        Heading="Sitemap"
        breadcrumbItems={[{ label: "Sitemap", href: "/sitemap" }]}
      />

      {/* SITEMAP CONTAINER */}
      <section className={`${styles.bgahchor} w-full bg-white border-x border-b border-gray-200 container max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-8 relative overflow-hidden md:overflow-visible`}>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">

          {/* ==========================================
              DESKTOP VIEW: TWO-SIDED CENTRAL NODE TREE
             ========================================== */}
          <div className="hidden md:flex flex-col items-center w-full relative">

            {/* Top Node: HOME */}
            <div className="relative z-20 mb-8 max-w-xs w-full flex justify-center">
              <NodeCard
                href="/"
                icon={FiHome}
                title="HOME"
                previewImage={previewImgHome}
                side="right"
                isHome={true}
                className="max-w-xs"
              />
            </div>

            {/* Central Vertical Spine */}
            <div className="absolute top-16 bottom-16 w-0.5 bg-[#002B49] left-1/2 -translate-x-1/2 z-0" />

            {/* ROWS CONTAINER */}
            <div className="w-full flex flex-col gap-10 relative z-10">

              {/* ROW 1: SERVICES (Left) | ABOUT US (Right) */}
              <div className="w-full flex items-center relative">
                <div className="w-1/2 pr-8 flex justify-end">
                  <NodeCard
                    href="/services"
                    icon={LuAnchor}
                    title="SERVICES"
                    subtitle="All Services"
                    previewImage={previewImgServices}
                    side="left"
                    className="max-w-xs"
                  />
                </div>
                {/* Center Circle Dot & Horizontal Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 z-20 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white" />
                  <div className="absolute w-16 h-0.5 bg-[#002B49] -z-10" />
                </div>
                <div className="w-1/2 pl-8 flex justify-start">
                  <NodeCard
                    href="/about"
                    icon={LuUsers}
                    title="ABOUT US"
                    subtitle="Team Members"
                    previewImage={previewImgAbout}
                    side="right"
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* ROW 2: CONTACT US (Left) | PROJECTS (Right) */}
              <div className="w-full flex items-center relative">
                <div className="w-1/2 pr-8 flex justify-end">
                  <NodeCard
                    href="/contact"
                    icon={FiMail}
                    title="CONTACT US"
                    previewImage={previewImgContact}
                    side="left"
                    className="max-w-xs"
                  />
                </div>
                {/* Center Circle Dot & Horizontal Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 z-20 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white" />
                  <div className="absolute w-16 h-0.5 bg-[#002B49] -z-10" />
                </div>
                <div className="w-1/2 pl-8 flex justify-start">
                  <NodeCard
                    href="/projects"
                    icon={LuFolderOpen}
                    title="PROJECTS"
                    subtitle="All Projects"
                    previewImage={previewImgProjects}
                    side="right"
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* ROW 3: FAQS (Left) | CAREERS (Right) */}
              <div className="w-full flex items-center relative">
                <div className="w-1/2 pr-8 flex justify-end">
                  <NodeCard
                    href="/faqs"
                    icon={LuMessageSquare}
                    title="FAQS"
                    previewImage={previewImgFaqs}
                    side="left"
                    className="max-w-xs"
                  />
                </div>
                {/* Center Circle Dot & Horizontal Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 z-20 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white" />
                  <div className="absolute w-16 h-0.5 bg-[#002B49] -z-10" />
                </div>
                <div className="w-1/2 pl-8 flex justify-start">
                  <NodeCard
                    href="/careers"
                    icon={FiBriefcase}
                    title="CAREERS"
                    previewImage={previewImgCareer}
                    side="right"
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* ROW 4: PRIVACY POLICY (Left) | GALLERY (Right) */}
              <div className="w-full flex items-center relative">
                <div className="w-1/2 pr-8 flex justify-end">
                  <NodeCard
                    href="/privacy"
                    icon={LuShieldCheck}
                    title="PRIVACY POLICY"
                    previewImage={previewImgPrivacy}
                    side="left"
                    className="max-w-xs"
                  />
                </div>
                {/* Center Circle Dot & Horizontal Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 z-20 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white" />
                  <div className="absolute w-16 h-0.5 bg-[#002B49] -z-10" />
                </div>
                <div className="w-1/2 pl-8 flex justify-start">
                  <NodeCard
                    href="/gallery"
                    icon={FiImage}
                    title="GALLERY"
                    previewImage={previewImgGallery}
                    side="right"
                    className="max-w-xs"
                  />
                </div>
              </div>

              {/* ROW 5: TERMS & CONDITIONS (Left) | SITEMAP (Right) */}
              <div className="w-full flex items-center relative">
                <div className="w-1/2 pr-8 flex justify-end">
                  <NodeCard
                    href="/terms"
                    icon={FiFileText}
                    title="TERMS & CONDITIONS"
                    previewImage={previewImgTnC}
                    side="left"
                    className="max-w-xs"
                  />
                </div>
                {/* Center Circle Dot & Horizontal Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 z-20 pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white" />
                  <div className="absolute w-16 h-0.5 bg-[#002B49] -z-10" />
                </div>
                <div className="w-1/2 pl-8 flex justify-start">
                  <NodeCard
                    href="/sitemap"
                    icon={TbSitemap}
                    title="SITEMAP"
                    previewImage={previewImgSitemap}
                    side="right"
                    className="max-w-xs"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Node: COPY RIGHTS */}
            <div className="relative z-20 mt-8 max-w-xs w-full flex justify-center">
              <NodeCard
                href="/copyright"
                icon={LuCopyright}
                title="COPY RIGHTS"
                previewImage={previewImgCopyrights}
                side="right"
                className="max-w-xs"
              />
            </div>

          </div>

          {/* ==========================================
              MOBILE VIEW: ONE-SIDED RIGHT BRANCH TREE
             ========================================== */}
          <div className="flex md:hidden flex-col items-start w-full relative pl-6 sm:pl-8 -translate-x-2">

            {/* Left Vertical Spine */}
            <div className="absolute left-3 sm:left-6 -top-12 sm:top-6 bottom-10 sm:bottom-6 w-0.5 bg-[#002B49] z-0" />

            {/* STACKED MOBILE CARDS */}
            <div className="w-full flex flex-col gap-6 relative z-10">

              {/* HOME */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <Link
                  href="/"
                  className="group flex items-center gap-3 bg-[#002B49] hover:bg-[#AD1D41] text-white px-6 py-3.5 shadow-md w-full"
                >
                  <div className="w-9 h-9 bg-[#AD1D41] text-white flex items-center justify-center">
                    <FiHome className="text-xl" />
                  </div>
                  <span className="font-oswald font-bold text-lg tracking-widest uppercase">
                    HOME
                  </span>
                </Link>
              </div>

              {/* SERVICES */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/services"
                  icon={LuAnchor}
                  title="SERVICES"
                  subtitle="All Services"
                  previewImage={previewImgServices}
                />
              </div>

              {/* ABOUT US */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/about"
                  icon={LuUsers}
                  title="ABOUT US"
                  subtitle="Team Members"
                  previewImage={previewImgAbout}
                />
              </div>

              {/* CONTACT US */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/contact"
                  icon={FiMail}
                  title="CONTACT US"
                  previewImage={previewImgContact}
                />
              </div>

              {/* PROJECTS */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/projects"
                  icon={LuFolderOpen}
                  title="PROJECTS"
                  subtitle="All Projects"
                  previewImage={previewImgProjects}
                />
              </div>

              {/* FAQS */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/faqs"
                  icon={LuMessageSquare}
                  title="FAQS"
                  previewImage={previewImgFaqs}
                />
              </div>

              {/* CAREERS */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/careers"
                  icon={FiBriefcase}
                  title="CAREERS"
                  previewImage={previewImgCareer}
                />
              </div>

              {/* PRIVACY POLICY */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/privacy"
                  icon={LuShieldCheck}
                  title="PRIVACY POLICY"
                  previewImage={previewImgPrivacy}
                />
              </div>

              {/* GALLERY */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/gallery"
                  icon={FiImage}
                  title="GALLERY"
                  previewImage={previewImgGallery}
                />
              </div>

              {/* TERMS & CONDITIONS */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/terms"
                  icon={FiFileText}
                  title="TERMS & CONDITIONS"
                  previewImage={previewImgTnC}
                />
              </div>

              {/* SITEMAP */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/sitemap"
                  icon={TbSitemap}
                  title="SITEMAP"
                  previewImage={previewImgSitemap}
                />
              </div>

              {/* COPY RIGHTS */}
              <div className="relative pl-1 sm:pl-6 flex items-center">
                <div className="absolute left-0 -ml-[19px] w-3.5 h-3.5 rounded-full border-2 border-[#002B49] bg-white z-20" />
                <div className="absolute left-0 -ml-4 w-6 h-0.5 bg-[#002B49] z-10" />
                <NodeCard
                  href="/copyright"
                  icon={LuCopyright}
                  title="COPY RIGHTS"
                  previewImage={previewImgCopyrights}
                />
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}

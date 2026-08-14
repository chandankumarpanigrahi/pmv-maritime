"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import ComesInGoesOutUnderline from "@/components/fancy/text/underline-comes-in-goes-out"

// Icons
import { LuPhone, LuMail, LuMapPin, LuFacebook, LuInstagram, LuLinkedin, LuShieldCheck, LuLeaf } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { ImArrowUp } from "react-icons/im";

// Assets
import logo from "../../../public/assets/images/logo.png";
import iso1 from "../../../public/assets/images/iso-1.png";
import iso2 from "../../../public/assets/images/iso-2.png";
import iso3 from "../../../public/assets/images/iso-3.png";
import ism from "../../../public/assets/images/ism.png";
import Copyright from "../Copyright/page";
import footerBg from "../../../public/assets/images/footer-bg.png";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [popularServices, setPopularServices] = useState([]);

  useEffect(() => {
    async function fetchPopularServices() {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPopularServices(data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load popular services in footer:", err);
      }
    }
    fetchPopularServices();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer className="container max-w-7xl mx-auto w-full flex flex-col gap-6 pt-8">

      {/* Top Footer: Main Columns */}
      <div className="container relative max-w-7xl mx-auto pt-12 px-4 md:px-8 pb-6 border border-gray-200">
        <div className="absolute inset-0 z-1 overflow-hidden">
          <Image
            src={footerBg}
            alt="Footer Background Image"
            fill
            className="object-cover object-[30%] translate-y-0 lg:translate-y-0 opacity-15 lg:opacity-100 lg:object-center"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between relative z-5 gap-8 lg:gap-0">
          {/* Logo & About Column */}
          <div className="w-full lg:w-3/13 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Image src={logo} alt="PMV Logo" className="w-12 h-18 object-contain" />
                <div className="flex flex-col">
                  <h3 className="font-oswald text-3xl font-bold text-secondary-dark tracking-wide leading-none">
                    <span className="text-secondary">PMV</span> Maritime <br /><span className="text-secondary">Solutions</span><span className="text-primary">.</span>
                  </h3>
                </div>
              </div>
              <p className="text-secondary-dark font-medium text-[16px] leading-tight mt-6 max-w-sm">
                Engineering maritime excellence through innovation, expertise, and commitment.
              </p>
            </div>

            {/* Contact Info & Socials */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm text-secondary-dark font-semibold">
                <LuMapPin className="text-primary text-base mt-0.5 flex-shrink-0" />
                <span>IFZA Properties, Dubai Silicon Oasis, UAE</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-dark font-semibold">
                <LuMail className="text-primary text-base flex-shrink-0" />
                <a href="mailto:info@pmvmaritime.com" className="hover:text-primary transition-colors">
                  info@pmvmaritime.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-dark font-semibold">
                <LuPhone className="text-primary text-base flex-shrink-0" />
                <a href="tel:+971505342726" className="hover:text-primary transition-colors">
                  +97 15053 42726
                </a>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center transition-all duration-300">
                  <LuFacebook className="text-sm" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center transition-all duration-300">
                  <LuInstagram className="text-sm" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center transition-all duration-300">
                  <FaXTwitter className="text-sm" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:text-primary hover:border-primary flex items-center justify-center transition-all duration-300">
                  <LuLinkedin className="text-sm" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-7/15 gap-8 lg:gap-6 mt-8 lg:mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
              {/* Company Column */}
              <div className="w-full">
                <h4 className="font-oswald text-lg font-bold text-gray-900 tracking-wider">
                  Quick Links
                </h4>
                <div className="w-8 h-[2.5px] bg-primary mt-1 mb-4"></div>
                <ul className="flex flex-col gap-2">
                  <li className="">
                    <Link href="/" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Home</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/about" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">About Us</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/services" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Our Services</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/projects" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Our Projects</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/careers" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Careers</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/gallery" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Gallery</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Services Column */}
              <div className="w-full">
                <h4 className="font-oswald text-lg font-bold text-gray-900 tracking-wider">
                  Popular Services
                </h4>
                <div className="w-8 h-[2.5px] bg-primary mt-1 mb-4"></div>
                <ul className="flex flex-col gap-2">
                  {popularServices.length > 0 ? (
                    popularServices.map((service) => (
                      <li key={service._id || service.slug} className="">
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200 line-clamp-1"
                        >
                          <ComesInGoesOutUnderline direction="left">{service.name}</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="">
                        <Link href="/services/marine-consultancy" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                          <ComesInGoesOutUnderline direction="left">Maritime Consultancy</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                      <li className="">
                        <Link href="/services/maritime-training" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                          <ComesInGoesOutUnderline direction="left">Maritime Training</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                      <li className="">
                        <Link href="/services/fleet-management" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                          <ComesInGoesOutUnderline direction="left">Fleet Management</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                      <li className="">
                        <Link href="/services/crew-management" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                          <ComesInGoesOutUnderline direction="left">Crew Management</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                      <li className="">
                        <Link href="/services/port-operations" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                          <ComesInGoesOutUnderline direction="left">Port Operations</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                      <li className="">
                        <Link href="/services/ship-building" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                          <ComesInGoesOutUnderline direction="left">Shipbuilding</ComesInGoesOutUnderline>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Resources Column */}
              <div className="w-full">
                <h4 className="font-oswald text-lg font-bold text-gray-900 tracking-wider">
                  Resources
                </h4>
                <div className="w-8 h-[2.5px] bg-primary mt-1 mb-4"></div>
                <ul className="flex flex-col gap-2">
                  <li className="">
                    <Link href="/contact" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Contact Us</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/faqs" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">FAQs</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/privacy" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Privacy Policy</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/terms" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Terms & Conditions</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/copyright" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Copy Rights</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                  <li className="">
                    <Link href="/sitemap" className="text-sm font-semibold text-secondary-dark w-full block hover:text-primary-hover transition-colors duration-200">
                      <ComesInGoesOutUnderline direction="left">Sitemap</ComesInGoesOutUnderline>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* Certification / ISO Badges Block */}
            <div className="flex mt-8 lg:mt-auto flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <LuShieldCheck className="text-secondary text-4xl flex-shrink-0" />
                <div className="flex flex-col text-secondary-dark font-bold text-[12px] leading-tight">
                  <span>Certified.</span>
                  <span>Compliant.</span>
                  <span>Committed.</span>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200 hidden lg:block mx-4"></div>

              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-end">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-end">
                  <Image src={iso1} alt="ISO 9001:2015" className="h-9 sm:h-11 w-auto object-contain" />
                  <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                  <Image src={iso2} alt="ISO 14001:2015" className="h-9 sm:h-11 w-auto object-contain" />
                  <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                  <Image src={iso3} alt="ISO 45001:2018" className="h-9 sm:h-11 w-auto object-contain" />
                  <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>
                  <Image src={ism} alt="ISM Code Compliant" className="h-9 sm:h-11 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Circular Progress Back to Top Button */}
        <button
          onClick={scrollToTop}
          className={`fixed right-4 bottom-8 md:right-8 md:bottom-8 z-50 transition-all duration-300 cursor-pointer flex items-center justify-center p-0 rounded-full bg-white shadow-xl hover:shadow-2xl hover:scale-105 group ${showScrollTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-75 pointer-events-none"
            }`}
          aria-label="Back to Top"
        >
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 text-primary p-0.5" viewBox="0 0 48 48">
              {/* Background Track Circle */}
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-gray-200 stroke-current"
                strokeWidth="3"
                fill="none"
              />
              {/* Foreground Scroll Progress Circle */}
              <circle
                cx="24"
                cy="24"
                r="20"
                className="text-primary stroke-current transition-all duration-150 ease-out"
                strokeWidth="3.5"
                strokeDasharray="125.66"
                strokeDashoffset={125.66 - (scrollProgress / 100) * 125.66}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-primary group-hover:text-primary-hover group-hover:-translate-y-0.5 transition-transform duration-200">
              <ImArrowUp className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
        </button>
      </div>
      <Copyright />
    </footer>
  );
}

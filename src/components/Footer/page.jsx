"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
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
            className="object-cover object-[30%] translate-y-0 lg:translate-y-4 opacity-15 lg:opacity-100 lg:object-center scale-101 overflow-visible"
            priority
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

          <div className="flex flex-col w-full lg:w-7/15 gap-8 lg:gap-0 mt-8 lg:mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
              {/* Services Column */}
              <div className="w-full">
                <h4 className="font-oswald text-lg font-bold text-gray-900 tracking-wider">
                  Services
                </h4>
                <div className="w-8 h-[2.5px] bg-primary mt-1 mb-4"></div>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/services/consultancy" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Maritime Consultancy
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/training" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Maritime Training
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/fleet" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Fleet Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/crew" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Crew Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/port-operations" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Port Operations
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/digital" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Digital Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/shipbuilding" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Shipbuilding
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Column */}
              <div className="w-full">
                <h4 className="font-oswald text-lg font-bold text-gray-900 tracking-wider">
                  Company
                </h4>
                <div className="w-8 h-[2.5px] bg-primary mt-1 mb-4"></div>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/about" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/leadership" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Our Leadership
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/news" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      News & Media
                    </Link>
                  </li>
                  <li>
                    <Link href="/case-studies" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Case Studies
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Column */}
              <div className="w-full">
                <h4 className="font-oswald text-lg font-bold text-gray-900 tracking-wider">
                  Resources
                </h4>
                <div className="w-8 h-[2.5px] bg-primary mt-1 mb-4"></div>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/projects" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/brochures" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Brochures
                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors duration-200">
                      Terms & Conditions
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

        {/* Back to Top Arrow */}
        <button
          onClick={scrollToTop}
          className={`fixed right-4 bottom-8 md:right-8 md:bottom-8 z-50 text-primary hover:text-primary-hover hover:-translate-y-1 transition-all duration-500 cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-primary/5 bg-white shadow-lg border border-gray-100/80 ${showScrollTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-75 pointer-events-none"
            }`}
          aria-label="Back to Top"
        >
          <ImArrowUp size={28} />
        </button>
      </div>
      <Copyright />
    </footer>
  );
}

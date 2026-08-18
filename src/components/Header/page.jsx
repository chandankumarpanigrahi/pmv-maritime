"use client";

import React, { useState, useEffect, useRef } from "react";
import LetterSwapPingPong from "@/components/fancy/text/letter-swap-pingpong-anim"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons
import { LuMenu, LuX, LuAnchor, LuCompass, LuShieldAlert, LuBookOpen, LuPhone, LuMail } from "react-icons/lu";
import { FiHome, FiInfo, FiCpu, FiLayers, FiPhone, FiBriefcase, FiImage, FiFileText } from "react-icons/fi";

// Images
import logoLight from "../../../public/assets/images/logo-light.png"
import logoDark from "../../../public/assets/images/logo.png"
import CtaHeader from "../Cta Header/page";

const maritimeServices = [
  {
    slug: "marine-consultancy",
    icon: LuAnchor,
    title: "Marine Consultancy",
    description: "Pre-purchase, damage & technical vessel assessments.",
  },
  {
    slug: "maritime-training",
    icon: LuBookOpen,
    title: "Maritime Training",
    description: "Industry-focused training programmes.",
  },
  {
    slug: "ship-building",
    icon: LuShieldAlert,
    title: "Ship Building",
    description: "New build, conversions, and technical supervision.",
  },
  {
    slug: "port-operations",
    icon: LuCompass,
    title: "Port Operations",
    description: "Efficient cargo handling, vessel coordination & supply chain.",
  },
];

const quickLinksPrimary = [
  { href: "/", icon: FiHome, label: "Home" },
  { href: "/about", icon: FiInfo, label: "About Us" },
  { href: "/services", icon: FiCpu, label: "Our Services" },
  { href: "/projects", icon: FiLayers, label: "Our Projects" },
  { href: "/contact", icon: FiPhone, label: "Contact Us" },
];

const quickLinksSecondary = [
  { href: "/careers", icon: FiBriefcase, label: "Career" },
  { href: "/gallery", icon: FiImage, label: "Gallery" },
  { href: "/faqs", icon: FiFileText, label: "FAQs" },
];

const contactDeskDescription =
  "Reach out directly to our 24/7 technical assistance center for urgent maritime support or survey bookings.";

export default function Header({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const buttonRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // Close mega menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
      const isInsideMenu =
        menuRef.current?.contains(event.target) ||
        mobileMenuRef.current?.contains(event.target);
      const isToggleButton =
        buttonRef.current?.contains(event.target) ||
        mobileButtonRef.current?.contains(event.target);

      if (!isInsideMenu && !isToggleButton) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => pathname === path;

  // Determine design mode based on state & prop (default to transparent on home page)
  const isTransparentMode = (transparent || pathname === "/") && !scrolled;

  return (
    <div className="fixed top-0 w-full z-50">
      {/* Hide CtaHeader when scrolled to keep sticky menu compact */}
      <div className={`hidden transition-all duration-300 relative md:z-100009 origin-top ${scrolled ? "h-0 overflow-hidden opacity-0 scale-y-0" : "h-auto opacity-100"}`}>
        <CtaHeader />
      </div>

      <header
        className={`w-full transition-all relative md:z-100009 duration-300 ease-in-out ${isTransparentMode
          ? "bg-transparent py-4"
          : "bg-white/95 backdrop-blur-md py-3 shadow-lg border-b border-slate-100"
          }`}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-0 flex flex-row justify-between items-center">
          {/* Logo Toggle */}
          <Link href="/" className="flex flex-row justify-center items-center">
            <Image
              src={isTransparentMode ? logoLight : logoDark}
              alt="PMV Maritime Solutions Logo"
              priority
              className="w-[40px] md:w-[70px] transition-all duration-300"
            />
            {/* <p className={`ps-2 text-3xl font-bold ${isTransparentMode ? "text-white" : "text-[#0f387b]"}`}>PMV Maritime <br /> Solutions</p> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row gap-8 items-center">
            <Link
              href="/"
              className={`translate-y-0.5 uppercase font-bold text-lg transition-all duration-300 border-b-2 pb-1 ${isTransparentMode
                ? isActive("/")
                  ? "text-rose-400 border-rose-400"
                  : "text-white hover:text-rose-400 border-transparent"
                : isActive("/")
                  ? "text-rose-700 border-rose-700"
                  : "text-sky-700 hover:text-rose-700 border-transparent"
                }`}
            >
              <LetterSwapPingPong
                label="Home"
                reverse={false}
              />
            </Link>
            <Link
              href="/about"
              className={`translate-y-0.5 uppercase font-bold text-lg transition-all duration-300 border-b-2 pb-1 ${isTransparentMode
                ? isActive("/about")
                  ? "text-rose-400 border-rose-400"
                  : "text-white hover:text-rose-400 border-transparent"
                : isActive("/about")
                  ? "text-rose-700 border-rose-700"
                  : "text-sky-700 hover:text-rose-700 border-transparent"
                }`}
            >
              <LetterSwapPingPong
                label="About"
                reverse={false}
              />
            </Link>
            <Link
              href="/services"
              className={`translate-y-0.5 uppercase font-bold text-lg transition-all duration-300 border-b-2 pb-1 ${isTransparentMode
                ? isActive("/services")
                  ? "text-rose-400 border-rose-400"
                  : "text-white hover:text-rose-400 border-transparent"
                : isActive("/services")
                  ? "text-rose-700 border-rose-700"
                  : "text-sky-700 hover:text-rose-700 border-transparent"
                }`}
            >
              <LetterSwapPingPong
                label="Services"
                reverse={false}
              />
            </Link>
            <div className="flex flex-row items-center gap-3">
              <Link
                href="/contact"
                className={`uppercase px-4 py-1.5 font-bold transition-all duration-300 border ${isTransparentMode
                  ? "text-white border-white/60 hover:bg-white/10"
                  : "text-sky-700 border-sky-700/60 hover:bg-sky-700/10"
                  }`}
              >
                <LetterSwapPingPong
                  label="Contact Us"
                  reverse={false}
                />
              </Link>
              <button
                ref={buttonRef}
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 cursor-pointer transition-all duration-300 text-white ${isTransparentMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-sky-700 hover:bg-rose-700"
                  }`}
                aria-label="Toggle Mega Menu"
              >
                {menuOpen ? <LuX className="text-2xl animate-spin-once" /> : <LuMenu className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex md:hidden flex-row items-center gap-2">
            <Link
              href="/contact"
              className={`uppercase px-3 py-1 text-sm font-bold border ${isTransparentMode
                ? "text-white border-white/60 bg-white/5"
                : "text-sky-700 border-sky-700/60 bg-sky-700/5"
                }`}
            >
              Contact
            </Link>
            <button
              ref={mobileButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 cursor-pointer text-white ${isTransparentMode ? "bg-white/10" : "bg-sky-700"
                }`}
              aria-label="Toggle Mobile Menu"
            >
              {menuOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </header >

      {/* Top-down Animated Mega Menu Overlay (Desktop only) */}
      < div
        ref={menuRef}
        className={`hidden md:block fixed left-0 w-full text-white transition-all duration-500 ease-in-out transform md:z-100000 ${menuOpen
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
          } ${scrolled ? "top-[111px]" : ""}`
        }
      >
        <div className="container max-w-7xl mx-auto grid grid-cols-3 border-b shadow-2xl border-white/15 backdrop-blur-xl bg-slate-950/90">
          {/* Column 1: Services Directory */}
          <div className="flex flex-col border-r border-white/10">
            <h3 className="font-oswald bg-[#ffffff09] px-6 py-4 text-rose-500 text-lg uppercase tracking-wider font-semibold border-b border-white/10">
              Maritime Services
            </h3>
            <div className="px-4 py-4 flex flex-col gap-3">
              {maritimeServices.map((service) => {
                const ServiceIcon = service.icon;
                const serviceHref = `/services/${service.slug}`;

                return (
                  <Link
                    key={service.slug}
                    href={serviceHref}
                    onClick={closeMenu}
                    className="group flex items-start gap-3 w-full p-2 hover:bg-white/5 rounded transition-all"
                  >
                    <ServiceIcon className="text-rose-500 text-xl mt-0.5 group-hover:scale-110 transition-transform shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-xs text-slate-400">{service.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col border-r border-white/10">
            <h3 className="font-oswald bg-[#ffffff09] px-6 py-4 text-rose-500 text-lg uppercase tracking-wider font-semibold border-b border-white/10">
              Quick Links
            </h3>
            <div className="flex">
              <div className="w-1/2 px-4 py-4 flex flex-col gap-1 text-sm font-semibold text-slate-300">
                {quickLinksPrimary.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-row gap-3 items-center px-2 py-1.5 hover:text-white hover:pl-3 transition-all duration-300"
                    >
                      <LinkIcon className="text-rose-500" /> <span className="pt-1">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="w-1/2 px-4 py-4 flex flex-col gap-1 text-sm font-semibold text-slate-300">
                {quickLinksSecondary.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex flex-row gap-3 items-center px-2 py-1.5 hover:text-white hover:pl-3 transition-all duration-300"
                    >
                      <LinkIcon className="text-rose-500" /> <span className="pt-1">{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Contact Desk */}
          <div className="flex flex-col">
            <h3 className="font-oswald bg-[#ffffff09] px-6 py-4 text-rose-500 text-lg uppercase tracking-wider font-semibold border-b border-white/10">
              Contact Desk
            </h3>
            <p className="px-4 py-4 text-xs text-slate-400 leading-relaxed">
              {contactDeskDescription}
            </p>
            <div className="px-4 py-4 flex flex-col gap-3 font-semibold text-sm mt-2">
              <a href="tel:+971505342726" className="flex items-center gap-3 text-slate-300 hover:text-white">
                <LuPhone className="text-rose-500 text-lg" />
                <span>+97 15053 42726</span>
              </a>
              <a href="mailto:info@pmvmaritime.com" className="flex items-center gap-3 text-slate-300 hover:text-white">
                <LuMail className="text-rose-500 text-lg" />
                <span>info@pmvmaritime.com</span>
              </a>
            </div>
            <div className="px-4 py-4 border-t border-white/10 flex gap-4">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="w-full text-center px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all">
                Request Quick Callback
              </Link>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="col-span-3 bg-[#ffffff09] px-4 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <span className="text-slate-400 text-xs text-center sm:text-left">
              Need custom technical specifications or specialized consultations? Speak directly with our marine coordinators.
            </span>
            <div className="flex flex-row gap-3 w-full sm:w-auto justify-center">
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 border border-white/20 hover:border-white/50 text-white rounded transition-colors text-xs font-bold uppercase tracking-wider text-center"
              >
                About Us
              </Link>
              <Link
                href="/services"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded transition-colors text-xs font-bold uppercase tracking-wider text-center"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div >

      {/* Mobile Drawer (Slides from Right, Full Screen, Scrollable, Mobile only) */}
      < div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 w-full h-screen bg-slate-950/98 backdrop-blur-2xl z-[100] flex flex-col transition-all duration-500 ease-in-out md:hidden ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
      >
        {/* Mobile Drawer Header */}
        < div className="flex justify-between items-center px-6 py-5 border-b border-white/10" >
          <Image src={logoLight} alt="logo" className="w-[60px]" />
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer transition-colors"
            aria-label="Close Mobile Menu"
          >
            <LuX className="text-2xl" />
          </button>
        </div >

        {/* Mobile Drawer Content (Scrollable) */}
        < div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8" >
          {/* Section 1: Quick Links */}
          < div className="flex flex-col gap-4" >
            <h3 className="font-oswald text-rose-500 text-xs uppercase tracking-widest font-semibold border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2">
              {quickLinksPrimary.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 py-1.5 transition-colors ${isActive(link.href) ? "text-rose-500" : "text-slate-300 hover:text-white"}`}
                  >
                    <LinkIcon className="text-rose-500 text-lg shrink-0" />
                    <span className="text-sm font-semibold">{link.label}</span>
                  </Link>
                );
              })}
              {quickLinksSecondary.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 py-1.5 transition-colors ${isActive(link.href) ? "text-rose-500" : "text-slate-300 hover:text-white"}`}
                  >
                    <LinkIcon className="text-rose-500 text-lg shrink-0" />
                    <span className="text-sm font-semibold">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div >

          {/* Section 2: Maritime Services */}
          < div className="flex flex-col gap-4" >
            <h3 className="font-oswald text-rose-500 text-xs uppercase tracking-widest font-semibold border-b border-white/10 pb-2">
              Maritime Services
            </h3>
            <div className="flex flex-col gap-3">
              {maritimeServices.map((service) => {
                const ServiceIcon = service.icon;
                const serviceHref = `/services/${service.slug}`;

                return (
                  <Link
                    key={service.slug}
                    href={serviceHref}
                    onClick={closeMenu}
                    className="group flex items-start gap-3 w-full p-2 rounded hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                  >
                    <ServiceIcon className="text-rose-500 text-lg mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="min-w-0">
                      <span className="text-sm font-semibold block text-white group-hover:text-rose-300 transition-colors">
                        {service.title}
                      </span>
                      <span className="text-xs text-slate-400 block mt-0.5">{service.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div >

          {/* Section 3: Contact */}
          < div className="flex flex-col gap-4 mt-auto border-t border-white/10 pt-6" >
            <h3 className="font-oswald text-rose-500 text-xs uppercase tracking-widest font-semibold pb-1">
              Contact Desk
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {contactDeskDescription}
            </p>
            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <a href="tel:+971505342726" className="flex items-center gap-3 hover:text-white">
                <LuPhone className="text-rose-500" />
                <span>+97 15053 42726</span>
              </a>
              <a href="mailto:info@pmvmaritime.com" className="flex items-center gap-3 hover:text-white">
                <LuMail className="text-rose-500" />
                <span>info@pmvmaritime.com</span>
              </a>
            </div>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all"
            >
              Request Quick Callback
            </Link>

            {/* Quick Actions Row */}
            <div className="flex flex-row gap-3 mt-4 pt-4 border-t border-white/10">
              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-white/20 hover:border-white/50 text-white font-bold text-xs uppercase tracking-wider rounded transition-all"
              >
                About Us
              </Link>
              <Link
                href="/services"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs uppercase tracking-wider rounded transition-all"
              >
                Our Services
              </Link>
            </div>
          </div >
        </div >
      </div >
    </div >
  );
}

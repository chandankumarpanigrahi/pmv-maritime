"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero/page";
import About from "@/components/About/page";

// Dynamically import below-the-fold sections for faster initial paint & lower TBT
const LogoScroll = dynamic(() => import("@/components/Logo Scroll/page"));
const Services = dynamic(() => import("@/components/Services Section/page"));
const PopularServices = dynamic(() => import("@/components/Popular Services/page"));
const CTA = dynamic(() => import("@/components/CTA/page"));
const Projects = dynamic(() => import("@/components/Projects Section/page"));
const ContactUs = dynamic(() => import("@/components/Contact Us/page"));

export default function Home() {
  return (
    <main className="flex flex-col font-sans">
      <Hero />
      <div className="border-b-8 border-primary w-full"></div>
      <About />
      <LogoScroll />
      <Services />
      <PopularServices />
      <CTA />
      <Projects />
      <ContactUs />
    </main>
  );
}

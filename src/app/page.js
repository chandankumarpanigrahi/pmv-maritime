"use client";

import About from "@/components/About/page";
import ContactUs from "@/components/Contact Us/page";
import CTA from "@/components/CTA/page";
import Hero from "@/components/Hero/page";
import LogoScroll from "@/components/Logo Scroll/page";
import PopularServices from "@/components/Popular Services/page";
import Projects from "@/components/Projects Section/page";
import Services from "@/components/Services Section/page";

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

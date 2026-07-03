"use client";

import About from "@/components/About/page";
import Hero from "@/components/Hero/page";
import LogoScroll from "@/components/Logo Scroll/page";
import PopularServices from "@/components/Popular Services/page";
import Services from "@/components/Services/page";

export default function Home() {
  return (
    <main className="flex flex-col font-sans">
      <Hero />
      <div className="border-b-8 border-primary w-full"></div>
      <About />
      <LogoScroll />
      <Services />
      <PopularServices />
      <div className="w-full h-30 bg-primary mt-20"></div>
    </main>
  );
}

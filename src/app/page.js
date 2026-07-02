"use client";

import About from "@/components/About/page";
import Hero from "@/components/Hero/page";

export default function Home() {
  return (
    <main className="flex flex-col font-sans">
      <Hero />
      <div className="border-b-8 border-rose-700 w-full"></div>
      <About />
      <div className="w-full h-30 bg-red-100 mt-20"></div>
    </main>
  );
}

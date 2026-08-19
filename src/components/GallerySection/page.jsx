"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SubHeading from "@/design/sub-heading/page";
import { LuX, LuChevronLeft, LuChevronRight, LuArrowRight } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";

import bannerBg from "../../../public/assets/images/map-bg.png";

import img1 from "../../../public/assets/images/about-image-1.jpg";
import img2 from "../../../public/assets/images/about-image-2.jpg";
import img3 from "../../../public/assets/images/about-image-3.jpg";
import portImg from "../../../public/assets/images/project-about-port.png";

const PREVIEW_GALLERY = [
  { id: "p1", image: img1, alt: "Maritime image 1" },
  { id: "p2", image: img2, alt: "Maritime image 2" },
  { id: "p3", image: portImg, alt: "Maritime image 3" },
  { id: "p4", image: img3, alt: "Maritime image 4" },
  { id: "p5", image: "https://i.pinimg.com/1200x/c0/65/c6/c065c6ae77303abbe213ecf53c20d278.jpg", alt: "Maritime image 5" },
  { id: "p6", image: "https://i.pinimg.com/736x/b0/83/5e/b0835ebe5da894e329f3a198996a9277.jpg", alt: "Maritime image 6" },
  { id: "p7", image: "https://i.pinimg.com/736x/b4/d5/0b/b4d50baf33c5133d0c6803d258f5236c.jpg", alt: "Maritime image 7" },
  { id: "p8", image: "https://i.pinimg.com/1200x/17/1d/7d/171d7d88c50dce3d9aeb959ed752d08c.jpg", alt: "Maritime image 8" },
  // { id: "p9", image: "https://i.pinimg.com/1200x/14/26/e4/1426e4c969cc6440e562ccc2f98a84d7.jpg", alt: "Maritime image 9" },
  // { id: "p10", image: "https://i.pinimg.com/1200x/1e/c9/67/1ec967036a45d27172ec3faa3bd5c912.jpg", alt: "Maritime image 10" },
];

export default function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevImage = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? PREVIEW_GALLERY.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedIndex((prev) => (prev === PREVIEW_GALLERY.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation & lock body scroll when lightbox modal is open
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev === PREVIEW_GALLERY.length - 1 ? 0 : prev + 1));
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev === 0 ? PREVIEW_GALLERY.length - 1 : prev - 1));
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 -top-1/2"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200">
          <div className="flex flex-col md:flex-row py-6 px-4 md:px-8">
            <div className="flex flex-row w-full items-center justify-between">
              <SubHeading title="Gallery" />
              <Link
                href="/gallery"
                className="group w-fit text-[14px] md:text-md flex gap-5 items-center text-secondary font-bold tracking-wider uppercase"
              >
                View All <FaArrowRight className="hidden md:block group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <section className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <div className="w-full border border-slate-200 ">

          {/* Clean Pure Image Grid (No Text) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {PREVIEW_GALLERY.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group cursor-pointer transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-[100000] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              aria-label="Close"
            >
              <LuX className="text-2xl" />
            </button>

            {/* Prev Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              aria-label="Previous"
            >
              <LuChevronLeft className="text-2xl" />
            </button>

            {/* Pure Image Container */}
            <div
              className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] rounded overflow-hidden">
                <Image
                  src={PREVIEW_GALLERY[selectedIndex].image}
                  alt={PREVIEW_GALLERY[selectedIndex].alt}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
              aria-label="Next"
            >
              <LuChevronRight className="text-2xl" />
            </button>
          </div>
        )}
      </section >
    </>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import SubBanner from "@/components/Sub Banner/page";
import SubHeading from "@/design/sub-heading/page";
import ContactUs from "@/components/Contact Us/page";

import {
  LuMaximize2,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuEye,
} from "react-icons/lu";

import { BsGrid } from "react-icons/bs";
import { BsGrid1X2 } from "react-icons/bs";

import bannerBg from "../../../public/assets/images/map-bg.png";
import img1 from "../../../public/assets/images/about-image-1.jpg";
import img2 from "../../../public/assets/images/about-image-2.jpg";
import img3 from "../../../public/assets/images/about-image-3.jpg";
import portImg from "../../../public/assets/images/project-about-port.png";

// Gallery Items Dataset
const GALLERY_ITEMS = [
  {
    id: "g1",
    category: "Fleet & Vessels",
    image: img1,
  },
  {
    id: "g2",
    category: "Surveys & Audits",
    image: img2,
  },
  {
    id: "g3",
    category: "Offshore Operations",
    image: portImg,
  },
  {
    id: "g4",
    category: "Crew & Training",
    image: img3,
  },
  {
    id: "g5",
    category: "Fleet & Vessels",
    image: "https://i.pinimg.com/1200x/c0/65/c6/c065c6ae77303abbe213ecf53c20d278.jpg",
  },
  {
    id: "g6",
    category: "Offshore Operations",
    image: "https://i.pinimg.com/736x/b0/83/5e/b0835ebe5da894e329f3a198996a9277.jpg",
  },
  {
    id: "g7",
    category: "Surveys & Audits",
    image: "https://i.pinimg.com/736x/b4/d5/0b/b4d50baf33c5133d0c6803d258f5236c.jpg",
  },
  {
    id: "g8",
    category: "Fleet & Vessels",
    image: "https://i.pinimg.com/1200x/17/1d/7d/171d7d88c50dce3d9aeb959ed752d08c.jpg",
  },
  {
    id: "g9",
    category: "Events & Milestones",
    image: "https://i.pinimg.com/1200x/14/26/e4/1426e4c969cc6440e562ccc2f98a84d7.jpg",
  },
  {
    id: "g20",
    category: "Crew & Training",
    image: "https://images.unsplash.com/photo-1784913109497-dbcbae7c0825?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g14",
    category: "Crew & Training",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g19",
    category: "Offshore Operations",
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g22",
    category: "Surveys & Audits",
    image: "https://images.unsplash.com/photo-1524522173746-f628baad3644?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g10",
    category: "Fleet & Vessels",
    image: "https://images.unsplash.com/photo-1691591765923-3bd6f12f4209?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g11",
    category: "Fleet & Vessels",
    image: "https://images.unsplash.com/photo-1784910626462-1fb9e128e5b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g15",
    category: "Fleet & Vessels",
    image: "https://images.unsplash.com/photo-1783102691138-144bf626aa42?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g16",
    category: "Offshore Operations",
    image: "https://images.unsplash.com/photo-1784915471714-ac9741adfc2b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g17",
    category: "Surveys & Audits",
    image: "https://images.unsplash.com/photo-1784910627599-c3541792138a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g18",
    category: "Events & Milestones",
    image: "https://images.unsplash.com/photo-1687276740103-660a6a34bb67?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "g21",
    category: "Fleet & Vessels",
    image: "https://plus.unsplash.com/premium_photo-1661962356926-f08d78f8b127?auto=format&fit=crop&w=1200&q=80",
  }
];

const CATEGORIES = [
  "All",
  "Fleet & Vessels",
  "Surveys & Audits",
  "Offshore Operations",
  "Crew & Training",
  "Events & Milestones",
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [layoutMode, setLayoutMode] = useState("grid"); // "grid" | "masonry"
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const thumbnailRefs = useRef([]);

  // Filter gallery items based on category
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      return selectedCategory === "All" || item.category === selectedCategory;
    });
  }, [selectedCategory]);

  const currentItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
    );
  }, [lightboxIndex, filteredItems.length]);

  // Scroll active thumbnail into center of the row when popview changes
  useEffect(() => {
    if (lightboxIndex !== null && thumbnailRefs.current[lightboxIndex]) {
      thumbnailRefs.current[lightboxIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [lightboxIndex]);

  // Keyboard navigation & lock body scroll when popview modal is open
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, handleNext, handlePrev]);

  return (
    <>
      <SubBanner
        Heading="Gallery"
        breadcrumbItems={[{ label: "Gallery", href: "/gallery" }]}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
          <div className="flex flex-col md:flex-row py-8 px-4 md:px-8 border-b border-gray-200">
            <div className="flex flex-col w-full md:w-8/12">
              <SubHeading title="PMV Visual Archive" className="mb-4 md:mb-6" />
              <h1 className="font-oswald text-3xl md:text-5xl text-secondary font-bold mb-2 md:mb-3">
                Excellence <span className="text-secondary-dark">in Motion</span>
                <span className="text-primary">.</span>
              </h1>
              <p className="text-sm md:text-[15px] max-w-full md:max-w-[90%] text-gray-600 font-medium">
                Explore our maritime fleet, offshore operations, vessel surveys, and seafarer training in high-definition visual imagery.
              </p>
            </div>
            <div className="w-full md:w-4/12 flex items-end justify-start md:justify-end mt-4 md:mt-0 relative z-2">
              <div className="flex items-center gap-2 bg-white p-1 border border-gray-200 shadow-xs">
                <button
                  onClick={() => setLayoutMode("grid")}
                  className={`p-2 transition-all cursor-pointer ${layoutMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  title="Grid View"
                >
                  <BsGrid className="text-lg" />
                </button>
                <button
                  onClick={() => setLayoutMode("masonry")}
                  className={`p-2 transition-all cursor-pointer ${layoutMode === "masonry"
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  title="Masonry View"
                >
                  <BsGrid1X2 className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <section className="bg-white border-x border-b border-gray-200 container max-w-7xl mx-auto py-5 px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 md:px-3.5 py-1 md:py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedCategory === cat
                ? "bg-primary text-white shadow-xs"
                : "bg-slate-100 text-gray-700 hover:bg-slate-200 hover:text-secondary-dark"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN GALLERY VIEW AREA (ONLY IMAGES) */}
      <main className="bg-slate-100 py-4 md:py-6 px-4 md:px-6 border-x border-b border-gray-200 container max-w-7xl mx-auto">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-gray-300 mx-4 md:mx-8">
            <h3 className="font-oswald text-2xl font-bold text-secondary uppercase">No Images Found</h3>
            <p className="text-sm text-gray-500 max-w-md mt-1 mb-4">
              There are no gallery images matching your filter selection.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-5 py-2 bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : layoutMode === "grid" ? (
          /* PURE IMAGE GRID VIEW (NO TEXT) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="group relative aspect-[4/3] w-full overflow-hidden bg-slate-900 shadow-sm cursor-pointer border border-gray-200"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Subtle Hover Dark Mask & Zoom Icon */}
                {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <LuEye className="text-xl" />
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        ) : (
          /* PURE MASONRY SHOWCASE VIEW (NO TEXT) */
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 px-4 md:px-8 space-y-4">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className="break-inside-avoid group relative w-full overflow-hidden bg-slate-900 shadow-sm cursor-pointer border border-gray-200"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Hover Mask & Zoom Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <LuMaximize2 className="text-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* POPVIEW LIGHTBOX MODAL WITH BOTTOM THUMBNAIL ROW */}
      {currentItem && (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-between bg-black/60 backdrop-blur-md transition-all animate-fadeIn">
          {/* Top Bar (Counter & Close) */}
          <div className="w-full flex items-center justify-between px-6 py-4 z-50 bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-xs font-mono font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {filteredItems.length}
            </span>

            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 bg-white/10 hover:bg-rose-600 text-white rounded-full transition-all cursor-pointer shadow-lg"
              aria-label="Close Lightbox"
            >
              <LuX className="text-2xl" />
            </button>
          </div>

          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0 cursor-pointer z-10"
            onClick={() => setLightboxIndex(null)}
          />

          {/* Center Main Image Stage */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full max-w-7xl px-4 flex items-center justify-center overflow-hidden z-20"
          >
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3.5 bg-black/50 hover:bg-primary text-white rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110 border border-white/10"
              aria-label="Previous Image"
            >
              <LuChevronLeft className="text-3xl" />
            </button>

            {/* Main Full Image */}
            <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                fill
                className="object-contain drop-shadow-2xl select-none"
                priority
              />
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3.5 bg-black/50 hover:bg-primary text-white rounded-full transition-all cursor-pointer shadow-2xl hover:scale-110 border border-white/10"
              aria-label="Next Image"
            >
              <LuChevronRight className="text-3xl" />
            </button>
          </div>

          {/* BOTTOM THUMBNAIL ROW (CLICK TO VIEW) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-slate-950/90 border-t border-white/10 py-3 px-4 z-40 flex items-center justify-center overflow-hidden"
          >
            <div className="flex flex-row overflow-x-auto gap-2.5 max-w-5xl py-1 px-2 scrollbar-none scroll-smooth">
              {filteredItems.map((item, idx) => {
                const isActive = idx === lightboxIndex;
                return (
                  <button
                    key={item.id}
                    ref={(el) => (thumbnailRefs.current[idx] = el)}
                    onClick={() => setLightboxIndex(idx)}
                    className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 overflow-hidden transition-all duration-300 cursor-pointer ${isActive
                      ? "border-2 border-primary ring-2 ring-primary/50 opacity-100 scale-105"
                      : "opacity-40 hover:opacity-100 border border-white/20"
                      }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Contact Us Section */}
      <ContactUs />
    </>
  );
}

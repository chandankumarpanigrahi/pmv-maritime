"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  LuArrowLeft,
  LuImage,
  LuLoader,
  LuEye,
  LuX,
  LuSparkles,
  LuSearch,
} from "react-icons/lu";

import { PRESET_ICONS, renderIconById } from "@/lib/maritimeIcons";
import defaultProjectImage from "../../../../../public/assets/images/about-image-1.jpg";

const EMPTY_HIGHLIGHTS = [
  {
    icon: "TbCompass",
    title: "",
    description: "",
  },
  {
    icon: "TbShip",
    title: "",
    description: "",
  },
  {
    icon: "TbUserShield",
    title: "",
    description: "",
  },
];

export default function CreateProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // Form State - Empty by default for new project
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Port Operations");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [deliverablesText, setDeliverablesText] = useState("");
  const [valueDelivered, setValueDelivered] = useState("");
  const [highlights, setHighlights] = useState(EMPTY_HIGHLIGHTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingEdit, setIsFetchingEdit] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Icon Modal State
  const [iconModalTarget, setIconModalTarget] = useState(null); // index number (0, 1, 2)
  const [iconSearchQuery, setIconSearchQuery] = useState("");

  // Master Categories State
  const [masterCategories, setMasterCategories] = useState([]);

  // Fetch Projects Master Categories from MongoDB (/api/master?module=projects)
  useEffect(() => {
    async function fetchMasterCategories() {
      try {
        const res = await fetch("/api/master?module=projects", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const activeCats = data.filter((item) => item.status === "Active");
            setMasterCategories(activeCats);
            if (activeCats.length > 0 && !editId) {
              setCategory(activeCats[0].name);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load master project categories:", err);
      }
    }
    fetchMasterCategories();
  }, [editId]);

  // Fetch project for edit mode - Populates existing contents
  useEffect(() => {
    if (!editId) return;

    async function fetchProjectForEdit() {
      setIsFetchingEdit(true);
      try {
        const res = await fetch(`/api/projects?id=${editId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Project not found.");
        const data = await res.json();

        setTitle(data.title || data.name || "");
        setCategory(data.category || "Port Operations");
        setImageUrl(data.imageUrl || "");
        setShortDesc(data.shortDesc || data.description || "");
        setLongDesc(data.longDesc || "");
        setDeliverablesText(
          Array.isArray(data.deliverables) ? data.deliverables.join("\n") : data.deliverables || ""
        );
        setValueDelivered(data.valueDelivered || "");

        if (Array.isArray(data.highlights) && data.highlights.length === 3) {
          setHighlights([
            {
              icon: data.highlights[0]?.icon || "TbCompass",
              title: data.highlights[0]?.title || "",
              description: data.highlights[0]?.description || "",
            },
            {
              icon: data.highlights[1]?.icon || "TbShip",
              title: data.highlights[1]?.title || "",
              description: data.highlights[1]?.description || "",
            },
            {
              icon: data.highlights[2]?.icon || "TbUserShield",
              title: data.highlights[2]?.title || "",
              description: data.highlights[2]?.description || "",
            },
          ]);
        }
      } catch (err) {
        toast.error("Could not load project for editing.");
      } finally {
        setIsFetchingEdit(false);
      }
    }

    fetchProjectForEdit();
  }, [editId]);

  const handleHighlightChange = (index, field, value) => {
    setHighlights((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const openIconModal = (index) => {
    setIconModalTarget(index);
    setIconSearchQuery("");
  };

  const handleSelectIconFromModal = (iconId) => {
    if (typeof iconModalTarget === "number") {
      handleHighlightChange(iconModalTarget, "icon", iconId);
    }
    setIconModalTarget(null);
    toast.success("Icon updated successfully!");
  };

  const filteredIcons = PRESET_ICONS.filter(
    (item) =>
      item.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  // ── Submit: POST (create) or PUT (edit) ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a Project Title.");
      return;
    }

    if (!category.trim()) {
      toast.error("Please select a Project Category.");
      return;
    }

    if (!shortDesc.trim()) {
      toast.error("Please enter a Short Description.");
      return;
    }

    if (!longDesc.trim()) {
      toast.error("Please enter a Long Description.");
      return;
    }

    for (let i = 0; i < highlights.length; i++) {
      const card = highlights[i];
      if (!card.title.trim()) {
        toast.error(`Please enter a Title for Feature Card #${i + 1}.`);
        return;
      }
      if (!card.description.trim()) {
        toast.error(`Please enter a Description for Feature Card #${i + 1}.`);
        return;
      }
      if (!card.icon) {
        toast.error(`Please select an Icon for Feature Card #${i + 1}.`);
        return;
      }
    }

    const deliverables = deliverablesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (deliverables.length === 0) {
      toast.error("Please enter at least one deliverable in What We Deliver.");
      return;
    }

    if (!valueDelivered.trim()) {
      toast.error("Please enter Value Delivered.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      category,
      imageUrl: imageUrl.trim(),
      shortDesc,
      longDesc,
      highlights,
      deliverables,
      valueDelivered: valueDelivered.trim(),
    };

    try {
      let res;
      if (editId) {
        res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...payload }),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save project.");
      }

      toast.success(
        editId ? "Project updated successfully!" : "New project created and published!"
      );

      setTimeout(() => {
        router.push("/admin/projects");
      }, 600);
    } catch (err) {
      toast.error(err.message || "Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingEdit) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <LuLoader className="text-3xl animate-spin text-primary" />
          <p className="text-sm font-medium">Loading project data...</p>
        </div>
      </div>
    );
  }

  const previewImage = imageUrl.trim() || defaultProjectImage;

  return (
    <div className="p-3 md:p-6 space-y-6 w-full">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 p-2.5 md:px-5 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 transition-colors"
            title="Back to Projects"
          >
            <LuArrowLeft className="text-lg" />
          </Link>
          <div>
            <h1 className="font-oswald text-lg md:text-xl font-bold text-primary uppercase tracking-wide">
              {editId ? "Edit Project" : "Create New Project"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/projects"
            className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider text-center transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? editId
                ? "Updating..."
                : "Publishing..."
              : editId
                ? "Update Project"
                : "Save & Publish Project"}
          </button>
        </div>
      </div>

      {/* Full-Width Multi-Section Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: General Project Details */}
        <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3.5">
            <span className="w-7 h-7 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
              1
            </span>
            <h2 className="font-oswald text-base md:text-lg font-bold text-secondary uppercase tracking-wide">
              General Project Details
            </h2>
          </div>

          {/* Grid: Project Title + Category */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
            <div className="lg:col-span-7">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                Project Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maritime Consultancy Projects"
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-semibold"
                required
              />
            </div>

            <div className="lg:col-span-5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                Project Category <span className="text-primary">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-3.5 py-2.5 text-sm transition-all text-gray-900 font-semibold cursor-pointer"
              >
                {masterCategories.length > 0 ? (
                  masterCategories.map((item) => (
                    <option key={item._id || item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Port Operations">Port Operations</option>
                    <option value="Fleet Management">Fleet Management</option>
                    <option value="Maritime Consultancy">Maritime Consultancy</option>
                    <option value="Shipbuilding">Shipbuilding</option>
                    <option value="Digitisation">Digitisation</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Image Link Input + Live Preview using Next.js Image component */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
              Image Link (URL) <span className="text-gray-400 font-normal">(Direct Image URL, e.g. https://...)</span>
            </label>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              <div className="lg:col-span-9">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://iili.io/Ck11H4s.jpg"
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Enter a direct image URL. This image will be reflected on the website listing card and inner page.
                </p>
              </div>

              {/* Preview Thumbnail Box & Modal Trigger */}
              <div className="lg:col-span-3 flex items-center justify-between gap-3 bg-slate-50 p-2 border border-gray-200">
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={() => setImageModalOpen(true)}
                    className="relative w-16 h-12 bg-slate-200 border border-gray-300 overflow-hidden shrink-0 cursor-pointer group"
                    title="Click to view full image"
                  >
                    {typeof previewImage === "string" ? (
                      <Image
                        src={previewImage}
                        alt="Project Preview"
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Image
                        src={previewImage}
                        alt="Project Preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <LuEye className="text-sm" />
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Image Preview
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="px-2.5 py-1.5 bg-white hover:bg-secondary hover:text-white border border-gray-300 text-gray-700 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <LuEye className="text-xs" />
                  <span>View Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* Grid: Short Description + Long Description Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                Short Description <span className="text-primary">*</span>{" "}
                <span className="text-gray-400 font-normal">(Card Snippet)</span>
              </label>
              <textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Concise overview snippet displayed on project listing cards..."
                rows={4}
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                Long Description <span className="text-primary">*</span>{" "}
                <span className="text-gray-400 font-normal">(Detailed Overview)</span>
              </label>
              <textarea
                value={longDesc}
                onChange={(e) => setLongDesc(e.target.value)}
                placeholder="Full paragraph explaining the project scope, background, and strategy..."
                rows={4}
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: 3 Key Feature Highlight Cards with Icons */}
        <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-200 pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
                2
              </span>
              <h2 className="font-oswald text-base md:text-lg font-bold text-secondary uppercase tracking-wide">
                3 Key Feature Cards
              </h2>
            </div>
            <span className="text-xs font-semibold text-gray-400">Max 110 Chars Per Card</span>
          </div>

          {/* 3 Equal Grid Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {highlights.map((card, index) => (
              <div
                key={index}
                className="bg-slate-50/90 border border-gray-200 p-4 space-y-4 relative flex flex-col justify-between"
              >
                {/* Card Header & Icon Selector Button */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-2">
                    <span className="w-5 h-5 bg-secondary-dark text-white text-[11px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    Feature Card #{index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => openIconModal(index)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-gray-200 flex items-center gap-2 transition-all cursor-pointer group"
                    title="Change Icon"
                  >
                    <div className="w-6 h-6 bg-secondary-dark text-white flex items-center justify-center shrink-0 font-bold">
                      {renderIconById(card.icon, "h-3.5 w-3.5")}
                    </div>
                    <span className="text-[11px] font-bold text-primary group-hover:underline">
                      Change Icon
                    </span>
                  </button>
                </div>

                {/* Card Title */}
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                    Card Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleHighlightChange(index, "title", e.target.value)}
                    placeholder={`Card #${index + 1} Title`}
                    required
                    className="w-full bg-white border border-gray-200 focus:border-secondary outline-none px-3 py-2 text-xs text-gray-900 font-semibold"
                  />
                </div>

                {/* Card Description */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
                      Description <span className="text-primary">*</span>
                    </label>
                    <span
                      className={`text-[11px] font-mono font-bold ${card.description.length >= 100 ? "text-primary" : "text-gray-400"
                        }`}
                    >
                      {card.description.length} / 110 chars
                    </span>
                  </div>
                  <textarea
                    value={card.description}
                    maxLength={110}
                    onChange={(e) => handleHighlightChange(index, "description", e.target.value)}
                    placeholder="Short card description (max 110 characters)..."
                    rows={3}
                    required
                    className="w-full bg-white border border-gray-200 focus:border-secondary outline-none px-3 py-2 text-xs text-gray-800 font-medium resize-none flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: What We Deliver & Value Delivered */}
        <div className="bg-white border border-gray-200 p-4 md:p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-gray-200 pb-3.5">
            <span className="w-7 h-7 bg-primary/10 text-primary text-xs font-bold flex items-center justify-center border border-primary/20">
              3
            </span>
            <h2 className="font-oswald text-base md:text-lg font-bold text-secondary uppercase tracking-wide">
              Deliverables & Value Delivered
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                What We Deliver <span className="text-primary">*</span>{" "}
                <span className="text-gray-400 font-normal">(One bullet point per line)</span>
              </label>
              <textarea
                value={deliverablesText}
                onChange={(e) => setDeliverablesText(e.target.value)}
                placeholder={`Maritime business strategy\nFeasibility studies\nRegulatory and compliance support...`}
                rows={6}
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                Value Delivered <span className="text-primary">*</span>{" "}
                <span className="text-gray-400 font-normal">(Paragraph summarizing impact)</span>
              </label>
              <textarea
                value={valueDelivered}
                onChange={(e) => setValueDelivered(e.target.value)}
                placeholder="Clear strategic direction, reduced operational risk, stronger decision-making..."
                rows={6}
                required
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/admin/projects"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? editId
                ? "Updating..."
                : "Publishing..."
              : editId
                ? "Update Project"
                : "Save & Publish Project"}
          </button>
        </div>
      </form>

      {/* FULL SCREEN IMAGE PREVIEW MODAL */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white border border-gray-200 shadow-2xl p-4 overflow-hidden flex flex-col items-center">
            <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-3">
              <h3 className="font-oswald text-base font-bold text-secondary uppercase tracking-wide">
                Project Image Preview
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <LuX className="text-xl" />
              </button>
            </div>
            <div className="relative w-full h-[65vh] max-h-[550px] bg-slate-900 flex items-center justify-center border border-gray-200">
              {typeof previewImage === "string" ? (
                <Image
                  src={previewImage}
                  alt="Project Image Full Preview"
                  fill
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <Image
                  src={previewImage}
                  alt="Project Image Full Preview"
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="w-full flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIFORM ICON SELECTION MODAL FOR FEATURE CARDS */}
      {iconModalTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <LuSparkles className="h-3 w-3" />
                </div>
                <h3 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wide">
                  Select Icon for Feature Card #{(iconModalTarget || 0) + 1}
                </h3>
              </div>
              <button
                onClick={() => setIconModalTarget(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            {/* Live Search Bar */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  placeholder="Search icons (e.g. Anchor, Ship, Safety, Crew, Port)..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary outline-none pl-10 pr-4 py-2 text-xs font-semibold text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Icon Grid Body */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                {filteredIcons.map((item) => {
                  const IconComp = item.Icon;
                  const currentlyActive =
                    typeof iconModalTarget === "number"
                      ? highlights[iconModalTarget]?.icon === item.id
                      : false;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectIconFromModal(item.id)}
                      className={`flex flex-col items-center justify-center p-3 border transition-all cursor-pointer gap-2 ${currentlyActive
                        ? "bg-primary text-white border-primary shadow-md ring-2 ring-primary/40"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-slate-100 hover:border-secondary hover:text-secondary"
                        }`}
                    >
                      <IconComp className="h-6 w-6" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate max-w-full">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {filteredIcons.length === 0 && (
                <div className="py-12 text-center text-xs text-gray-500 font-medium">
                  No icons matching &quot;{iconSearchQuery}&quot;.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setIconModalTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

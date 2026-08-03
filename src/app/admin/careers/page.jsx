"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTable/DataTable";
import {
  LuPencil,
  LuTrash2,
  LuShieldAlert,
  LuX,
  LuMapPin,
  LuBriefcase,
  LuAnchor,
  LuCheck,
  LuCalendar,
  LuArchive,
  LuInbox,
} from "react-icons/lu";

// Helper to format ISO date "YYYY-MM-DD" into "DD-MM-YYYY"
const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
  }
  return dateStr;
};

export default function AdminCareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" (Published) | "archive" (Archived)

  // Form State
  const [category, setCategory] = useState("sea");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [type, setType] = useState("Full Time");
  const [deadline, setDeadline] = useState("");
  const [overview, setOverview] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCareer, setDeletingCareer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [masterCareers, setMasterCareers] = useState([]);

  // ─── Fetch Master Careers (Employment Types) from MongoDB ──
  useEffect(() => {
    async function fetchMasterData() {
      try {
        const res = await fetch("/api/master?module=careers", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMasterCareers(data.filter((item) => item.status === "Active"));
          }
        }
      } catch (err) {
        console.error("Failed to load master careers:", err);
      }
    }
    fetchMasterData();
  }, []);

  // ─── Fetch Careers from MongoDB ────────────────────────────
  const fetchCareers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/careers", { cache: "no-store" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.error || `Error ${res.status}: Failed to fetch careers`
        );
      }
      const data = await res.json();
      setCareers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load careers from database.");
      toast.error(err.message || "Failed to load careers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  // ─── Form Reset ───────────────────────────────────────────
  const resetForm = () => {
    setCategory("sea");
    setPosition("");
    setLocation("");
    setDepartment("");
    setType("Full Time");
    setDeadline("");
    setOverview("");
    setResponsibilitiesText("");
    setEditingId(null);
  };

  // ─── Form Submit (Add / Update) ───────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position.trim() || !location.trim() || !department.trim()) {
      toast.error(
        "Please fill in all required fields (Position, Location, Department)."
      );
      return;
    }

    setIsSubmitting(true);

    const responsibilities = responsibilitiesText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      category,
      position,
      location,
      department,
      type: type.trim() || "Full Time",
      deadline: deadline.trim(),
      overview: overview.trim(),
      responsibilities,
    };

    try {
      if (editingId) {
        // Update existing career position
        const res = await fetch("/api/careers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Failed to update career position.");
        }

        setCareers((prev) =>
          prev.map((c) =>
            c._id === editingId ? { ...c, ...payload } : c
          )
        );
        toast.success("Career position updated successfully.");
      } else {
        // Create new career position
        const res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Failed to add career position.");
        }

        const result = await res.json();
        if (result.data) {
          setCareers((prev) => [...prev, result.data]);
        } else {
          fetchCareers();
        }
        toast.success("New career position added successfully.");
      }

      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Edit Handler ─────────────────────────────────────────
  const handleEdit = (career) => {
    setCategory(career.category || "sea");
    setPosition(career.position || "");
    setLocation(career.location || "");
    setDepartment(career.department || "");
    setType(career.type || "Full Time");
    setDeadline(career.deadline || "");
    setOverview(career.overview || "");
    setResponsibilitiesText(
      Array.isArray(career.responsibilities)
        ? career.responsibilities.join("\n")
        : ""
    );
    setEditingId(career._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Archive / Restore Handler ─────────────────────────────
  const handleToggleArchive = async (row, targetAction) => {
    try {
      const res = await fetch("/api/careers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row._id, action: targetAction }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to update status.");
      }

      setCareers((prev) =>
        prev.map((c) =>
          c._id === row._id ? { ...c, archived: targetAction === "archive" } : c
        )
      );

      toast.success(
        targetAction === "archive"
          ? "Career position moved to Archive."
          : "Career position restored to Published."
      );
    } catch (err) {
      toast.error(err.message || "Failed to update position status.");
    }
  };

  // ─── Delete Handlers ──────────────────────────────────────
  const openDeleteModal = (career) => {
    setDeletingCareer(career);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCareer) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingCareer._id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to delete position.");
      }

      setCareers((prev) => prev.filter((c) => c._id !== deletingCareer._id));
      if (editingId === deletingCareer._id) {
        resetForm();
      }
      toast.success("Career position deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete position.");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingCareer(null);
    }
  };

  // ─── Sequence Reorder Handler ──────────────────────────────
  const handleSaveOrder = async (newOrderedCareers) => {
    try {
      const orderedIds = newOrderedCareers.map((c) => c._id);
      const res = await fetch("/api/careers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to save sequence.");
      }

      setCareers(newOrderedCareers);
      toast.success("Career sequence updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save sequence.");
      throw err;
    }
  };

  // Split data into published vs archived
  const publishedCareers = careers.filter((item) => !item.archived);
  const archivedCareers = careers.filter((item) => item.archived);
  const currentDisplayedCareers =
    activeTab === "active" ? publishedCareers : archivedCareers;

  // ─── DataTable Columns Schema ──────────────────────────────
  const columns = [
    {
      header: "Position",
      accessor: "position",
      className: "min-w-[180px]",
      cell: (row) => (
        <p className="text-sm font-bold text-gray-900 leading-snug">
          {row.position}
        </p>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      className: "min-w-[140px]",
      cell: (row) => (
        <span className="text-sm font-medium text-gray-600">
          {row.category === "shore" ? "Career at Shore" : "Career at Sea"}
        </span>
      ),
    },
    {
      header: "Location",
      accessor: "location",
      className: "min-w-[140px]",
      cell: (row) => (
        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
          <LuMapPin className="text-primary text-xs shrink-0" />
          {row.location}
        </span>
      ),
    },
    {
      header: "Department",
      accessor: "department",
      className: "min-w-[180px]",
      cell: (row) => (
        <span className="text-sm font-medium text-gray-600">
          {row.department}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      className: "w-[120px]",
      cell: (row) => (
        <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
          {row.type || "Full Time"}
        </span>
      ),
    },
    {
      header: "Deadline",
      accessor: "deadline",
      className: "w-[130px]",
      cell: (row) => (
        <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
          {row.deadline ? formatDateDDMMYYYY(row.deadline) : "Open"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "w-[160px]",
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-start">
          {activeTab === "active" ? (
            <>
              <button
                onClick={() => handleEdit(row)}
                className="p-1.5 bg-slate-100 hover:bg-secondary hover:text-white text-secondary-dark border border-secondary transition-colors cursor-pointer"
                title="Edit Position"
              >
                <LuPencil className="text-sm" />
              </button>
              <button
                onClick={() => handleToggleArchive(row, "archive")}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-800 hover:text-white text-amber-700 border border-amber-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                title="Move to Archive"
              >
                <LuArchive className="text-xs" />
                <span>Archive</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleToggleArchive(row, "restore")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-800 hover:text-white text-emerald-700 border border-emerald-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                title="Restore to Published"
              >
                <LuCheck className="text-xs" />
                <span>Restore</span>
              </button>
              <button
                onClick={() => openDeleteModal(row)}
                className="p-1.5 bg-red-50 hover:bg-primary hover:text-white text-primary border border-red-200 transition-colors cursor-pointer"
                title="Delete Permanently"
              >
                <LuTrash2 className="text-sm" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  // ─── DataTable Filter Options ─────────────────────────────
  const filterOptions = [
    { label: "Career at Sea", value: "sea" },
    { label: "Career at Shore", value: "shore" },
  ];

  return (
    <div className="p-3 md:p-5">
      <div className="flex flex-col xl:flex-row gap-5">
        {/* ═══════════════════════════════════════════════════
            LEFT PANEL — Add / Edit Career Form
           ═══════════════════════════════════════════════════ */}
        <div className="w-full xl:w-[360px] xl:min-w-[360px] flex-shrink-0">
          <div className="bg-white border border-gray-200 shadow-xs">
            {/* Form Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wide">
                  {editingId ? "Edit Career" : "Add Career Position"}
                  <span className="text-primary">.</span>
                </h2>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                  title="Cancel Edit"
                >
                  <LuX className="text-lg" />
                </button>
              )}
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Career Category <span className="text-primary">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCategory("sea")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 border text-xs font-bold uppercase transition-all cursor-pointer ${category === "sea"
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-slate-50 text-gray-700 hover:bg-slate-100"
                      }`}
                  >
                    <LuAnchor className="text-sm shrink-0" />
                    Career at Sea
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("shore")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 border text-xs font-bold uppercase transition-all cursor-pointer ${category === "shore"
                      ? "border-primary bg-primary text-white"
                      : "border-gray-200 bg-slate-50 text-gray-700 hover:bg-slate-100"
                      }`}
                  >
                    <LuBriefcase className="text-sm shrink-0" />
                    Career at Shore
                  </button>
                </div>
              </div>

              {/* Position Title Field */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Position Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Chief Engineer, Master..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
                  required
                />
              </div>

              {/* Location & Department Fields */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Location <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dubai, Mexico..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-3.5 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Department <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Deck Department..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-3.5 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Employment Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-3.5 py-2.5 text-sm transition-all text-gray-900 font-medium cursor-pointer"
                >
                  <option value="">Select Employment Type...</option>
                  {masterCareers.map((item) => (
                    <option key={item._id || item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-3.5 py-2.5 text-sm transition-all text-gray-900 font-medium cursor-pointer"
                />
              </div>

              {/* Overview Field */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Job Overview
                </label>
                <textarea
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Brief overview of the role and responsibilities..."
                  rows={3}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
                />
              </div>

              {/* Key Points / Responsibilities */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Key Points <span className="text-gray-400 font-normal">(One per line)</span>
                </label>
                <textarea
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  placeholder="Maintain absolute command and safety of vessel...&#10;Ensure compliance with SOLAS & MARPOL..."
                  rows={4}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>
                    {isSubmitting
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                        ? "Update Position"
                        : "Add Position"}
                  </span>
                </button>
                {(position || location || department || overview) && (
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            RIGHT PANEL — Published / Archived Tabs & DataTable
           ═══════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Published vs Archived Sub-Header Tabs */}
          <div className="flex items-center bg-white border border-gray-200 p-2 shadow-xs justify-between">
            <div className="flex ms-auto items-center gap-1.5 bg-slate-100 p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "active"
                  ? "bg-white text-primary shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <LuBriefcase className="text-sm" />
                <span>Published</span>
                <span className="px-1.5 py-0.2 text-[10px] font-mono bg-primary/10 text-primary">
                  {publishedCareers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("archive")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "archive"
                  ? "bg-white text-amber-700 shadow-xs border border-gray-200"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <LuArchive className="text-sm" />
                <span>Archived</span>
                <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-100 text-amber-800">
                  {archivedCareers.length}
                </span>
              </button>
            </div>
          </div>

          <DataTable
            data={currentDisplayedCareers}
            loading={loading}
            error={error}
            onRefresh={fetchCareers}
            columns={columns}
            filterOptions={filterOptions}
            title={activeTab === "active" ? "Published Careers" : "Archived Careers"}
            detailTitle="Career Position Details"
            renderDrawerDetail={(career) => (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${career.category === "shore"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-blue-100 text-secondary-dark"
                      }`}
                  >
                    {career.category === "shore" ? "Career at Shore" : "Career at Sea"}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase bg-slate-100 px-2 py-1">
                    {career.type || "Full Time"}
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Position Title
                  </label>
                  <p className="text-lg font-bold text-gray-900 leading-snug">
                    {career.position}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Location
                    </label>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                      <LuMapPin className="text-primary text-xs" />
                      {career.location}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Department
                    </label>
                    <p className="text-sm font-semibold text-gray-800">
                      {career.department}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Application Deadline
                    </label>
                    <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                      <LuCalendar className="text-xs" />
                      {career.deadline ? formatDateDDMMYYYY(career.deadline) : "Open"}
                    </p>
                  </div>
                </div>

                {career.overview && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Overview
                    </label>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {career.overview}
                    </p>
                  </div>
                )}

                {Array.isArray(career.responsibilities) &&
                  career.responsibilities.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Key Points
                      </label>
                      <ul className="space-y-2">
                        {career.responsibilities.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs font-medium text-gray-700"
                          >
                            <LuCheck className="text-primary text-sm shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </>
            )}
            exportFilename="careers_positions_export.csv"
            searchPlaceholder="Search positions, locations, departments..."
            reorderable={true}
            onSaveOrder={handleSaveOrder}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
         ═══════════════════════════════════════════════════ */}
      {deleteModalOpen && deletingCareer && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 md:p-8 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 border border-red-100 text-primary flex items-center justify-center flex-shrink-0">
                <LuShieldAlert className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-oswald text-xl font-bold text-secondary uppercase tracking-wide">
                  Delete Position<span className="text-primary">?</span>
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  Are you sure you want to delete this career position? This action cannot be undone.
                </p>
                <div className="mt-3 p-3 bg-slate-50 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Position Details
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {deletingCareer.position}{" "}
                    <span className="text-gray-500 font-normal">
                      ({deletingCareer.location} &bull; {deletingCareer.department})
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingCareer(null);
                }}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <LuTrash2 className="text-sm" />
                <span>{isDeleting ? "Deleting..." : "Yes, Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

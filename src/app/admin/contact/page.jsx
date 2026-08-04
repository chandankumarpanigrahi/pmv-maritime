"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTable/DataTable";
import {
  LuMail,
  LuArchive,
  LuTrash2,
  LuShieldAlert,
  LuInbox,
} from "react-icons/lu";

const QUERY_FILTER_OPTIONS = [
  { value: "general", label: "General Inquiry" },
  { value: "consultancy", label: "Technical Consultancy" },
  { value: "training", label: "Maritime Training" },
  { value: "fleet", label: "Fleet Management" },
  { value: "crew", label: "Crew Management" },
  { value: "digital", label: "Digital Solutions" },
  { value: "others", label: "Others" },
];

export default function ContactSubmissionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // "active" | "archive"

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || `Error ${res.status}: Failed to fetch data`);
      }
      const submissions = await res.json();
      setData(Array.isArray(submissions) ? submissions : []);
    } catch (err) {
      setError(err.message || "Failed to load submissions from MongoDB.");
      toast.error(err.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Archive or Restore submission
  const handleToggleArchive = async (row, targetAction) => {
    try {
      const res = await fetch("/api/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row._id, action: targetAction }),
      });

      if (!res.ok) throw new Error("Failed to update status.");

      // Optimistic update local state
      setData((prev) =>
        prev.map((item) =>
          item._id === row._id ? { ...item, archived: targetAction === "archive" } : item
        )
      );

      toast.success(
        targetAction === "archive"
          ? "Submission moved to Archive."
          : "Submission restored to Active."
      );
    } catch (err) {
      toast.error(err.message || "Failed to update submission status.");
    }
  };

  // Delete submission permanently
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });

      if (!res.ok) throw new Error("Failed to delete record.");

      // Remove from local state
      setData((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success("Submission permanently deleted.");
    } catch (err) {
      toast.error(err.message || "Failed to delete submission.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Split data into active vs archive
  const activeSubmissions = data.filter((item) => !item.archived);
  const archivedSubmissions = data.filter((item) => item.archived);
  const currentDisplayedData = activeTab === "active" ? activeSubmissions : archivedSubmissions;

  // Column schema for DataTable
  const columns = [
    {
      header: "Client Name",
      accessor: "fullName",
      className: "min-w-[180px]",
      cell: (row) => (
        <span className="inline-block min-w-[180px] text-sm font-semibold text-gray-900">
          {row.fullName || "N/A"}
        </span>
      ),
    },
    {
      header: "Email Address",
      accessor: "email",
      className: "",
      cell: (row) => (
        <a
          href={`mailto:${row.email}`}
          className="inline-block whitespace-nowrap text-sm font-medium text-secondary hover:text-primary hover:underline font-mono"
        >
          {row.email || "N/A"}
        </a>
      ),
    },
    {
      header: "Query Category",
      accessor: "query",
      className: "min-w-[160px]",
      cell: (row) => {
        const categoryMap = {
          general: "General Inquiry",
          consultancy: "Technical Consultancy",
          training: "Maritime Training",
          fleet: "Fleet Management",
          crew: "Crew Management",
          digital: "Digital Solutions",
          others: "Others",
        };
        const label = categoryMap[row.query] || row.query || "General Inquiry";

        return (
          <span className="inline-block min-w-[160px] text-sm font-normal text-gray-700 whitespace-nowrap">
            {label}
          </span>
        );
      },
    },
    {
      header: "Submitted On",
      accessor: "dateTime",
      className: "min-w-[180px]",
      cell: (row) => (
        <span className="inline-block min-w-[180px] text-sm font-normal text-gray-700 whitespace-nowrap">
          {row.dateTime || row.createdAt || "N/A"}
        </span>
      ),
    },
    {
      header: "Message Snippet",
      accessor: "message",
      className: "min-w-[280px]",
      cell: (row) => (
        <p className="text-sm font-normal text-gray-700 min-w-[280px] line-clamp-2" title={row.message}>
          {row.message || "N/A"}
        </p>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex items-center gap-1.5 justify-start">
          {activeTab === "active" ? (
            <button
              onClick={() => handleToggleArchive(row, "archive")}
              className="px-2.5 pt-1.5 pb-1 bg-amber-50 hover:bg-amber-800 hover:text-white text-amber-700 border border-amber-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
              title="Move to Archive"
            >
              <span>Archive</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => handleToggleArchive(row, "restore")}
                className="px-2.5 pt-1.5 pb-1 bg-emerald-50 hover:bg-emerald-800 hover:text-white text-emerald-700 border border-emerald-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                title="Restore to Active"
              >
                <span>Restore</span>
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="px-2.5 pt-1.5 pb-1 bg-red-50 hover:bg-primary hover:text-white text-red-800 border border-red-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                title="Delete Permanently"
              >
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-5 space-y-4">

      {/* Header Info Banner */}
      <div className="bg-white border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0">
            <LuMail className="text-xl" />
          </div>
          <div>
            <h2 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wide">
              Contact Submissions
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Manage live form submissions stored in MongoDB Atlas database.
            </p>
          </div>
        </div>

        {/* Tab Buttons: Active vs Archive */}
        <div className="flex items-center gap-[1.5px] bg-slate-100 p-1 border border-gray-200 w-full sm:w-auto max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === "active"
              ? "bg-white text-primary shadow-xs border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <LuInbox className="text-sm shrink-0" />
            <span>Active</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-primary/10 text-primary shrink-0">
              {activeSubmissions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === "archive"
              ? "bg-white text-amber-700 shadow-xs border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <LuArchive className="text-sm shrink-0" />
            <span>Archive</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-100 text-amber-800 shrink-0">
              {archivedSubmissions.length}
            </span>
          </button>
        </div>
      </div>

      {/* Reusable DataTable */}
      <DataTable
        data={currentDisplayedData}
        loading={loading}
        error={error}
        onRefresh={fetchSubmissions}
        columns={columns}
        filterOptions={QUERY_FILTER_OPTIONS}
        title={activeTab === "active" ? "Active Submissions" : "Archived Submissions"}
        detailTitle="Submission Details"
        renderDrawerDetail={(selectedRowDetail) => (
          <>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Client / Full Name
              </label>
              <p className="text-base font-bold text-gray-900">
                {selectedRowDetail.fullName || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Email Address
              </label>
              <a
                href={`mailto:${selectedRowDetail.email}`}
                className="text-sm font-semibold text-secondary hover:text-primary hover:underline font-mono"
              >
                {selectedRowDetail.email || "N/A"}
              </a>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Query Category
              </label>
              <p className="text-sm font-medium text-gray-800">
                {(() => {
                  const categoryMap = {
                    general: "General Inquiry",
                    consultancy: "Technical Consultancy",
                    training: "Maritime Training",
                    fleet: "Fleet Management",
                    crew: "Crew Management",
                    digital: "Digital Solutions",
                    others: "Others",
                  };
                  return (
                    categoryMap[selectedRowDetail.query] ||
                    selectedRowDetail.query ||
                    "General Inquiry"
                  );
                })()}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Submitted Date & Time
              </label>
              <p className="text-sm font-medium text-gray-700">
                {selectedRowDetail.dateTime || selectedRowDetail.createdAt || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                Message Details
              </label>
              <p className="text-sm font-normal text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedRowDetail.message || "N/A"}
              </p>
            </div>
          </>
        )}
        exportFilename={`pmv_contact_${activeTab}_submissions.csv`}
        searchPlaceholder="Search by name, email, message..."
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 border border-red-100 text-primary flex items-center justify-center flex-shrink-0">
                <LuShieldAlert className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-oswald text-xl font-bold text-secondary uppercase tracking-wide">
                  Delete Permanently<span className="text-primary">.</span>
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  Are you sure you want to permanently delete submission from{" "}
                  <strong className="text-gray-900">{deleteTarget.fullName}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <LuTrash2 className="text-sm" />
                <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

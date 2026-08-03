"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTable/DataTable";

import {
  LuShip,
  LuHandshake,
  LuCheck,
  LuArchive,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuShieldAlert,
  LuArrowUpRight,
  LuX,
  LuRefreshCw,
} from "react-icons/lu";

import { renderIconById } from "@/lib/maritimeIcons";

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingService, setDeletingService] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch all services from MongoDB ──────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/services?all=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load services.");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // ── Archive / Restore ────────────────────────────────────────────────────
  const handleToggleArchive = async (row, targetAction) => {
    const isArchived = targetAction === "archive";
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row._id, archived: isArchived }),
      });
      if (!res.ok) throw new Error("Failed to update service.");
      setServices((prev) =>
        prev.map((s) => (s._id === row._id ? { ...s, archived: isArchived } : s))
      );
      toast.success(isArchived ? "Service moved to Archive." : "Service restored to Published.");
    } catch (err) {
      toast.error(err.message || "Failed to update service.");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const openDeleteModal = (service) => {
    setDeletingService(service);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingService) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingService._id }),
      });
      if (!res.ok) throw new Error("Failed to delete service.");
      setServices((prev) => prev.filter((s) => s._id !== deletingService._id));
      toast.success("Service deleted successfully.");
      setDeleteModalOpen(false);
      setDeletingService(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete service.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Reorder (client-side only) ───────────────────────────────────────────
  const handleSaveOrder = (newOrderedServices) => {
    setServices(newOrderedServices);
    toast.success("Services sequence updated successfully!");
  };

  // ── Split data ────────────────────────────────────────────────────────────
  const publishedServices = services.filter((item) => !item.archived);
  const archivedServices = services.filter((item) => item.archived);
  const currentDisplayedServices =
    activeTab === "active" ? publishedServices : archivedServices;

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    {
      header: "Icon",
      accessor: "icon",
      className: "w-[70px]",
      cell: (row) => (
        <div className="w-9 h-9 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold">
          {renderIconById(row.icon, "h-5 w-5")}
        </div>
      ),
    },
    {
      header: "Service Name",
      accessor: "name",
      className: "min-w-[220px]",
      cell: (row) => (
        <p className="text-sm font-bold text-gray-900 leading-snug">{row.name}</p>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      className: "min-w-[160px]",
      cell: (row) => (
        <p className="text-sm font-medium text-gray-600 leading-snug">
          {row.category || "—"}
        </p>
      ),
    },
    {
      header: "Short Description",
      accessor: "shortDesc",
      className: "min-w-[320px]",
      cell: (row) => (
        <p
          className="text-sm font-normal text-gray-600 line-clamp-2 leading-snug"
          title={row.shortDesc}
        >
          {row.shortDesc || "N/A"}
        </p>
      ),
    },
    {
      header: "Deliverables",
      accessor: "deliverables",
      className: "w-[120px]",
      cell: (row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-slate-100 text-gray-700">
          {Array.isArray(row.deliverables) ? row.deliverables.length : 0} Items
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "w-[190px]",
      cell: (row) => {
        const slug = row.slug || row.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        return (
          <div className="flex items-center gap-1.5 justify-start">
            {/* View Public Page */}
            <Link
              href={`/services/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-100 hover:bg-secondary-dark hover:text-white text-gray-600 border border-gray-200 transition-colors cursor-pointer"
              title="View Public Page"
            >
              <LuArrowUpRight className="text-sm" />
            </Link>

            {activeTab === "active" ? (
              <>
                <Link
                  href={`/admin/services/create?edit=${row._id}`}
                  className="p-1.5 bg-slate-100 hover:bg-secondary hover:text-white text-secondary-dark border border-secondary transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <LuPencil className="text-sm" />
                </Link>
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
        );
      },
    },
  ];

  return (
    <div className="p-3 md:p-5 space-y-4">
      {/* Combined Action Bar */}
      <div className="bg-white border border-gray-200 p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Add New Service Button */}
        <Link
          href="/admin/services/create"
          className="w-full sm:w-auto px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <LuPlus className="text-base" />
          <span>Add New Service</span>
        </Link>

        {/* Tabs */}
        <div className="flex items-center gap-[1.5px] bg-slate-100 p-1 border border-gray-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "active"
                ? "bg-white text-primary shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <LuShip className="text-sm" />
            <span>Published</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-primary/10 text-primary">
              {publishedServices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === "archive"
                ? "bg-white text-amber-700 shadow-xs border border-gray-200"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <LuArchive className="text-sm" />
            <span>Archived</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-100 text-amber-800">
              {archivedServices.length}
            </span>
          </button>
        </div>
      </div>

      <DataTable
        data={currentDisplayedServices}
        loading={loading}
        error={error}
        onRefresh={fetchServices}
        columns={columns}
        reorderable={activeTab === "active"}
        onReorder={handleSaveOrder}
        title={activeTab === "active" ? "Published Services" : "Archived Services"}
        detailTitle="Service Details Preview"
        renderDrawerDetail={(service) => (
          <>
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                {renderIconById(service.icon, "h-6 w-6")}
              </div>
              <div>
                <h3 className="font-oswald text-xl font-bold text-secondary-dark uppercase tracking-wide">
                  {service.name}
                </h3>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {service.category}
                </span>
              </div>
            </div>

            {/* 3 Key Feature Cards Preview */}
            {Array.isArray(service.highlights) && service.highlights.length > 0 && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  3 Key Feature Cards
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {service.highlights.map((card, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 border border-gray-200">
                      <div className="w-9 h-9 bg-secondary-dark/10 text-secondary-dark flex items-center justify-center shrink-0">
                        {renderIconById(card.icon, "h-4 w-4")}
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary-dark text-xs">{card.title || `Feature #${idx + 1}`}</h4>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed font-medium">
                          {card.description || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.shortDesc && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Short Description
                </label>
                <p className="text-sm font-medium text-gray-700 leading-relaxed bg-slate-50 p-3 border border-gray-200">
                  {service.shortDesc}
                </p>
              </div>
            )}

            {service.longDesc && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Long Description
                </label>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {service.longDesc}
                </p>
              </div>
            )}

            {Array.isArray(service.deliverables) && service.deliverables.length > 0 && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  What We Deliver
                </label>
                <div className="space-y-2 bg-slate-50 p-3.5 border border-gray-200">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-medium text-gray-700">
                      <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <LuCheck className="h-2.5 w-2.5 text-white" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.promise && (
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  Our Promise
                </label>
                <div className="p-4 bg-secondary/5 border-l-4 border-secondary">
                  <div className="flex items-center gap-2 mb-1.5">
                    <LuHandshake className="text-secondary h-5 w-5" />
                    <h4 className="font-oswald text-sm font-bold text-secondary uppercase">
                      Our Operational Promise
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed">
                    {service.promise}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 text-primary border border-red-200 flex items-center justify-center shrink-0">
                <LuShieldAlert className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-oswald text-lg font-bold text-secondary-dark uppercase tracking-wide">
                  Confirm Delete Service
                </h3>
                <p className="text-xs font-medium text-gray-600 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-gray-900">{deletingService.name}</strong>? This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

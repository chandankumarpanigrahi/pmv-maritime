"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTable/DataTable";

import {
  LuFolderOpen,
  LuCheck,
  LuArchive,
  LuPlus,
  LuPencil,
  LuTrash2,
  LuShieldAlert,
  LuArrowUpRight,
  LuX,
  LuImage,
  LuEye,
} from "react-icons/lu";

import { renderIconById } from "@/lib/maritimeIcons";
import { hasPermission } from "@/lib/permissions";
import defaultProjectImage from "../../../../public/assets/images/about-image-1.jpg";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [previewModalImg, setPreviewModalImg] = useState(null);

  const canCreate = hasPermission(null, "projects:create");
  const canEdit = hasPermission(null, "projects:edit");
  const canArchive = hasPermission(null, "projects:archive");
  const canDelete = hasPermission(null, "projects:delete");

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch all projects from MongoDB ──────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects?all=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load projects.");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) fetchProjects();
    });
    return () => {
      ignore = true;
    };
  }, [fetchProjects]);

  // ── Archive / Restore ────────────────────────────────────────────────────
  const handleToggleArchive = async (row, targetAction) => {
    const isArchived = targetAction === "archive";
    try {
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row._id, archived: isArchived }),
      });
      if (!res.ok) throw new Error("Failed to update project.");
      setProjects((prev) =>
        prev.map((p) => (p._id === row._id ? { ...p, archived: isArchived } : p))
      );
      toast.success(isArchived ? "Project moved to Archive." : "Project restored to Published.");
    } catch (err) {
      toast.error(err.message || "Failed to update project.");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const openDeleteModal = (project) => {
    setDeletingProject(project);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingProject._id }),
      });
      if (!res.ok) throw new Error("Failed to delete project.");
      setProjects((prev) => prev.filter((p) => p._id !== deletingProject._id));
      toast.success("Project deleted successfully.");
      setDeleteModalOpen(false);
      setDeletingProject(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Reorder (persisted to MongoDB) ───────────────────────────────────────
  const handleSaveOrder = async (newOrderedProjects) => {
    try {
      const orderedIds = newOrderedProjects.map((p) => p._id || p.id);
      const res = await fetch("/api/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to save sequence.");
      }

      setProjects((prev) => {
        const orderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
        return prev
          .map((p) => ({
            ...p,
            order: orderMap.has(p._id) ? orderMap.get(p._id) : p.order,
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      });

      toast.success("Projects sequence updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save sequence.");
      throw err;
    }
  };

  // ── Split data ────────────────────────────────────────────────────────────
  const publishedProjects = projects.filter((item) => !item.archived);
  const archivedProjects = projects.filter((item) => item.archived);
  const currentDisplayedProjects =
    activeTab === "active" ? publishedProjects : archivedProjects;

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = [
    {
      header: "Image",
      accessor: "imageUrl",
      className: "w-[80px]",
      cell: (row) => {
        const imgSrc = row.imageUrl || defaultProjectImage;
        return (
          <div
            onClick={() => setPreviewModalImg(imgSrc)}
            className="relative w-12 h-10 bg-slate-100 border border-gray-200 overflow-hidden shrink-0 cursor-pointer group"
            title="Click to view full image"
          >
            {typeof imgSrc === "string" ? (
              <Image
                src={imgSrc}
                alt={row.title || row.name || "Project"}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <Image
                src={imgSrc}
                alt={row.title || row.name || "Project"}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            )}
          </div>
        );
      },
    },
    {
      header: "Project Title",
      accessor: "title",
      className: "min-w-[220px]",
      cell: (row) => (
        <p className="text-sm font-bold text-gray-900 leading-snug">{row.title || row.name}</p>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      className: "min-w-[160px]",
      cell: (row) => (
        <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 whitespace-nowrap text-slate-700 border border-slate-200">
          {row.category || "—"}
        </span>
      ),
    },
    {
      header: "Short Description",
      accessor: "shortDesc",
      className: "min-w-[300px]",
      cell: (row) => (
        <p
          className="text-sm font-normal text-gray-600 line-clamp-2 leading-snug"
          title={row.shortDesc || row.description}
        >
          {row.shortDesc || row.description || "N/A"}
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
        const titleText = row.title || row.name || "";
        const slug = row.slug || titleText
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-");

        return (
          <div className="flex items-center gap-1.5 justify-start">
            {/* View Public Page */}
            <Link
              href={`/projects/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-100 hover:bg-secondary-dark hover:text-white text-gray-600 border border-gray-200 transition-colors cursor-pointer"
              title="View Public Page"
            >
              <LuArrowUpRight className="text-sm" />
            </Link>

            {activeTab === "active" ? (
              <>
                {canEdit && (
                  <Link
                    href={`/admin/projects/create?edit=${row._id}`}
                    className="p-1.5 bg-slate-100 hover:bg-secondary hover:text-white text-secondary-dark border border-secondary transition-colors cursor-pointer"
                    title="Edit Project"
                  >
                    <LuPencil className="text-sm" />
                  </Link>
                )}
                {canArchive && (
                  <button
                    onClick={() => handleToggleArchive(row, "archive")}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-800 hover:text-white text-amber-700 border border-amber-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                    title="Move to Archive"
                  >
                    <LuArchive className="text-xs" />
                    <span>Archive</span>
                  </button>
                )}
              </>
            ) : (
              <>
                {canArchive && (
                  <button
                    onClick={() => handleToggleArchive(row, "restore")}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-800 hover:text-white text-emerald-700 border border-emerald-200 font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                    title="Restore to Published"
                  >
                    <LuCheck className="text-xs" />
                    <span>Restore</span>
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => openDeleteModal(row)}
                    className="p-1.5 bg-red-50 hover:bg-primary hover:text-white text-primary border border-red-200 transition-colors cursor-pointer"
                    title="Delete Permanently"
                  >
                    <LuTrash2 className="text-sm" />
                  </button>
                )}
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
      <div className="bg-white border border-gray-200 p-2.5 md:px-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Add New Project Button */}
        {canCreate ? (
          <Link
            href="/admin/projects/create"
            className="w-full sm:w-auto px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <LuPlus className="text-base" />
            <span>Add New Project</span>
          </Link>
        ) : (
          <div />
        )}

        {/* Tabs */}
        <div className="flex items-center gap-[1.5px] bg-slate-100 p-1 border border-gray-200 w-full sm:w-auto max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === "active"
              ? "bg-white text-primary shadow-xs border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <LuFolderOpen className="text-sm shrink-0" />
            <span>Published</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-primary/10 text-primary shrink-0">
              {publishedProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`flex-1 sm:flex-none px-2.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === "archive"
              ? "bg-white text-amber-700 shadow-xs border border-gray-200"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <LuArchive className="text-sm shrink-0" />
            <span>Archived</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-100 text-amber-800 shrink-0">
              {archivedProjects.length}
            </span>
          </button>
        </div>
      </div>

      <DataTable
        data={currentDisplayedProjects}
        loading={loading}
        error={error}
        onRefresh={fetchProjects}
        columns={columns}
        reorderable={activeTab === "active"}
        onSaveOrder={handleSaveOrder}
        onReorder={handleSaveOrder}
        title={activeTab === "active" ? "Published Projects" : "Archived Projects"}
        detailTitle="Project Details Preview"
        renderDrawerDetail={(project) => {
          const imgSrc = project.imageUrl || defaultProjectImage;
          return (
            <>
              {/* Header with Project Image */}
              <div className="flex flex-col gap-3 border-b border-gray-200 pb-4">
                <div
                  onClick={() => setPreviewModalImg(imgSrc)}
                  className="relative w-full h-44 bg-slate-100 border border-gray-200 overflow-hidden cursor-pointer group"
                  title="Click to view full image"
                >
                  {typeof imgSrc === "string" ? (
                    <Image
                      src={imgSrc}
                      alt={project.title || "Project"}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Image
                      src={imgSrc}
                      alt={project.title || "Project"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                    <LuEye className="text-sm" />
                    <span>View Full Image</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold text-secondary-dark uppercase tracking-wide">
                    {project.title || project.name}
                  </h3>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* 3 Key Feature Cards Preview */}
              {Array.isArray(project.highlights) && project.highlights.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    3 Key Feature Cards
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {project.highlights.map((card, idx) => (
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

              {(project.shortDesc || project.description) && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Short Description
                  </label>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed bg-slate-50 p-3 border border-gray-200">
                    {project.shortDesc || project.description}
                  </p>
                </div>
              )}

              {project.longDesc && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Long Description
                  </label>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {project.longDesc}
                  </p>
                </div>
              )}

              {Array.isArray(project.deliverables) && project.deliverables.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    What We Deliver
                  </label>
                  <div className="space-y-2 bg-slate-50 p-3.5 border border-gray-200">
                    {project.deliverables.map((item, idx) => (
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

              {project.valueDelivered && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Value Delivered
                  </label>
                  <div className="p-4 bg-secondary/5 border-l-4 border-secondary">
                    <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed">
                      {project.valueDelivered}
                    </p>
                  </div>
                </div>
              )}
            </>
          );
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 text-primary border border-red-200 flex items-center justify-center shrink-0">
                <LuShieldAlert className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-oswald text-lg font-bold text-secondary-dark uppercase tracking-wide">
                  Confirm Delete Project
                </h3>
                <p className="text-xs font-medium text-gray-600 mt-1 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-gray-900">{deletingProject.title || deletingProject.name}</strong>? This action cannot be undone.
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

      {/* Full Screen Image Preview Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white border border-gray-200 shadow-2xl p-4 overflow-hidden flex flex-col items-center">
            <div className="flex items-center justify-between w-full pb-3 border-b border-gray-200 mb-3">
              <h3 className="font-oswald text-base font-bold text-secondary uppercase tracking-wide">
                Project Image Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                <LuX className="text-xl" />
              </button>
            </div>
            <div className="relative w-full h-[65vh] max-h-[550px] bg-slate-900 flex items-center justify-center border border-gray-200">
              {typeof previewModalImg === "string" ? (
                <Image
                  src={previewModalImg}
                  alt="Project Full Image"
                  fill
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <Image
                  src={previewModalImg}
                  alt="Project Full Image"
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <div className="w-full flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setPreviewModalImg(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

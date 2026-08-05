"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTable/DataTable";

import {
  LuFolderOpen,
  LuShip,
  LuMail,
  LuBriefcaseBusiness,
  LuPencil,
  LuTrash2,
  LuShieldAlert,
  LuX,
  LuPlus,
  LuCheck,
} from "react-icons/lu";

export default function MasterPage() {
  const [activeTab, setActiveTab] = useState("services");
  const [masterData, setMasterData] = useState({
    projects: [],
    services: [],
    contact: [],
    careers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State: Name & Status
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch Master Records from MongoDB ──────────────────────
  const fetchMasterRecords = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/master", { cache: "no-store" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || `Error ${res.status}: Failed to fetch master records`);
      }
      const data = await res.json();

      const grouped = {
        projects: [],
        services: [],
        contact: [],
        careers: [],
      };

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const mod = item.module || "projects";
          if (grouped[mod]) {
            grouped[mod].push(item);
          }
        });
      }

      setMasterData(grouped);
    } catch (err) {
      setError(err.message || "Failed to load master records from database.");
      toast.error(err.message || "Failed to load master records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterRecords();
  }, [fetchMasterRecords]);

  // Reset Form
  const resetForm = () => {
    setName("");
    setStatus("Active");
    setEditingId(null);
  };

  // Switch Tab Handler
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetForm();
  };

  // Form Submit (Add / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name field is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update item in MongoDB
        const res = await fetch("/api/master", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: name.trim(),
            status,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Failed to update record.");
        }

        setMasterData((prev) => ({
          ...prev,
          [activeTab]: prev[activeTab].map((item) =>
            (item._id || item.id) === editingId
              ? { ...item, name: name.trim(), status }
              : item
          ),
        }));
        toast.success("Master record updated successfully.");
      } else {
        // Add new item to MongoDB
        const res = await fetch("/api/master", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            module: activeTab,
            name: name.trim(),
            status,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Failed to create record.");
        }

        const result = await res.json();
        if (result.data) {
          setMasterData((prev) => ({
            ...prev,
            [activeTab]: [...prev[activeTab], result.data],
          }));
        } else {
          fetchMasterRecords();
        }
        toast.success("New Master record added successfully.");
      }

      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Item Handler
  const handleEdit = (item) => {
    setName(item.name || "");
    setStatus(item.status || "Active");
    setEditingId(item._id || item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Handlers
  const openDeleteModal = (item) => {
    setDeletingItem(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    const targetId = deletingItem._id || deletingItem.id;

    try {
      const res = await fetch("/api/master", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: targetId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to delete record.");
      }

      setMasterData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(
          (i) => (i._id || i.id) !== targetId
        ),
      }));

      if (editingId === targetId) {
        resetForm();
      }
      toast.success("Master record deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete record.");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingItem(null);
    }
  };

  // ── Reorder (persisted to MongoDB via PATCH) ────────────────────────────
  const handleSaveOrder = async (newOrderedItems) => {
    try {
      const orderedIds = newOrderedItems.map((item) => item._id || item.id);
      const res = await fetch("/api/master", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to save sequence.");
      }

      setMasterData((prev) => {
        const orderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
        return {
          ...prev,
          [activeTab]: prev[activeTab]
            .map((item) => ({
              ...item,
              order: orderMap.has(item._id || item.id) ? orderMap.get(item._id || item.id) : item.order,
            }))
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        };
      });

      toast.success("Master sequence updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save sequence.");
      throw err;
    }
  };

  const items = masterData[activeTab] || [];

  const tabConfig = [
    { key: "services", label: "Services Master", icon: LuShip },
    { key: "projects", label: "Projects Master", icon: LuFolderOpen },
    { key: "contact", label: "Contact Form Master", icon: LuMail },
    { key: "careers", label: "Careers Master", icon: LuBriefcaseBusiness },
  ];

  // ── DataTable Columns ────────────────────────────────────────────────────
  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <p className="text-sm font-bold text-gray-900 leading-snug">{row.name}</p>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "w-32",
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-xs ${row.status === "Active"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-gray-100 text-gray-600"
            }`}
        >
          <LuCheck className="text-xs" />
          {row.status || "Active"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "w-28 text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 bg-slate-100 hover:bg-secondary hover:text-white text-secondary-dark border border-secondary transition-colors cursor-pointer"
            title="Edit Record"
          >
            <LuPencil className="text-sm" />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="p-1.5 bg-slate-100 hover:bg-primary hover:text-white text-primary border border-primary transition-colors cursor-pointer"
            title="Delete Record"
          >
            <LuTrash2 className="text-sm" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-5 space-y-5">
      {/* ═══════════════════════════════════════════════════
          TAB NAVIGATION BAR
         ═══════════════════════════════════════════════════ */}
      <div className="bg-white border border-gray-200 p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {tabConfig.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${isActive
                  ? "border border-primary bg-primary text-white shadow-xs"
                  : "border border-gray-200 bg-slate-50 text-secondary-dark hover:bg-slate-100"
                  }`}
              >
                <TabIcon className="text-base" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT GRID (Form Left + DataTable Right)
         ═══════════════════════════════════════════════════ */}
      <div className="flex flex-col xl:flex-row gap-5">
        {/* ─── LEFT PANEL: Add / Edit Form (Only Name & Status) ─── */}
        <div className="w-full xl:w-[360px] xl:min-w-[360px] flex-shrink-0">
          <div className="bg-white border border-gray-200 shadow-xs">
            <div className="px-5 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
              <h2 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wide">
                {editingId ? "Edit Record" : "Add Record"}
                <span className="text-primary">.</span>
              </h2>
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

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name Field */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm text-gray-900 font-medium placeholder-gray-400"
                  required
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary outline-none px-4 py-2.5 text-sm text-gray-900 font-medium cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Submit / Clear Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <LuPlus className="text-sm" />
                  <span>
                    {isSubmitting
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                        ? "Update Record"
                        : "Add Record"}
                  </span>
                </button>
                {name && (
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

        {/* ─── RIGHT PANEL: DataTable with Drag & Drop Reordering ─── */}
        <div className="flex-1 min-w-0">
          <DataTable
            data={items}
            loading={loading}
            error={error}
            onRefresh={fetchMasterRecords}
            columns={columns}
            reorderable={true}
            onSaveOrder={handleSaveOrder}
            onReorder={handleSaveOrder}
            title={`${tabConfig.find((t) => t.key === activeTab)?.label || "Master Records"}`}
            searchPlaceholder="Search records by name..."
            exportFilename={`${activeTab}_master_export.csv`}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
         ═══════════════════════════════════════════════════ */}
      {deleteModalOpen && deletingItem && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 md:p-8 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 border border-red-100 text-primary flex items-center justify-center flex-shrink-0">
                <LuShieldAlert className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-oswald text-xl font-bold text-secondary uppercase tracking-wide">
                  Delete Master Record<span className="text-primary">?</span>
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  Are you sure you want to delete this master record?
                </p>
                <div className="mt-3 p-3 bg-slate-50 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Item Name
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {deletingItem.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingItem(null);
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

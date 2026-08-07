"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import DataTable from "@/components/DataTable/DataTable";
import { hasPermission } from "@/lib/permissions";
import {
  LuPencil,
  LuTrash2,
  LuShieldAlert,
  LuX,
} from "react-icons/lu";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canCreate = hasPermission(null, "faqs:create");
  const canEdit = hasPermission(null, "faqs:edit");
  const canDelete = hasPermission(null, "faqs:delete");

  // Form state
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingFaq, setDeletingFaq] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Fetch FAQs from MongoDB ────────────────────────────
  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/faqs", { cache: "no-store" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || `Error ${res.status}: Failed to fetch FAQs`);
      }
      const data = await res.json();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load FAQs from database.");
      toast.error(err.message || "Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // ─── Form Handlers ───────────────────────────────────────
  const resetForm = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill in both Question and Answer fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update existing FAQ
        const res = await fetch("/api/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, question, answer }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Failed to update FAQ.");
        }

        setFaqs((prev) =>
          prev.map((faq) =>
            faq._id === editingId ? { ...faq, question, answer } : faq
          )
        );
        toast.success("FAQ updated successfully.");
      } else {
        // Add new FAQ
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answer }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData?.error || "Failed to add FAQ.");
        }

        const result = await res.json();
        if (result.data) {
          setFaqs((prev) => [...prev, result.data]);
        } else {
          fetchFaqs();
        }
        toast.success("New FAQ added successfully.");
      }

      resetForm();
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (faq) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingId(faq._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteModal = (faq) => {
    setDeletingFaq(faq);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingFaq) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/faqs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingFaq._id }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to delete FAQ.");
      }

      setFaqs((prev) => prev.filter((f) => f._id !== deletingFaq._id));
      if (editingId === deletingFaq._id) {
        resetForm();
      }
      toast.success("FAQ deleted successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to delete FAQ.");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeletingFaq(null);
    }
  };

  // ─── Sequence Reordering Handler ──────────────────────────
  const handleSaveOrder = async (newOrderedFaqs) => {
    try {
      const orderedIds = newOrderedFaqs.map((faq) => faq._id);
      const res = await fetch("/api/faqs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || "Failed to save sequence.");
      }

      setFaqs(newOrderedFaqs);
      toast.success("FAQ sequence updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save sequence.");
      throw err;
    }
  };

  // ─── DataTable Columns Schema ───────────────────────────
  const columns = [
    {
      header: "Question",
      accessor: "question",
      className: "min-w-[220px]",
      cell: (row) => (
        <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-3">
          {row.question}
        </p>
      ),
    },
    {
      header: "Answer",
      accessor: "answer",
      className: "min-w-[300px]",
      cell: (row) => (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3" title={row.answer}>
          {row.answer}
        </p>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      className: "w-[120px]",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => handleEdit(row)}
              className="p-1.5 bg-slate-100 hover:bg-secondary hover:text-white text-secondary-dark border border-secondary transition-colors cursor-pointer"
              title="Edit FAQ"
            >
              <LuPencil className="text-sm" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => openDeleteModal(row)}
              className="p-1.5 bg-slate-100 hover:bg-primary hover:text-white text-primary border border-primary transition-colors cursor-pointer"
              title="Delete FAQ"
            >
              <LuTrash2 className="text-sm" />
            </button>
          )}
          {!canEdit && !canDelete && (
            <span className="text-[11px] text-gray-400 font-semibold italic">View Only</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-5">
      <div className="flex flex-col xl:flex-row gap-5">
        {/* ═══════════════════════════════════════════════════
            LEFT PANEL — Add / Edit FAQ Form (Requires Permission)
           ═══════════════════════════════════════════════════ */}
        {(canCreate || (editingId && canEdit)) && (
          <div className="w-full xl:w-[340px] xl:min-w-[340px] flex-shrink-0">
          <div className="bg-white border border-gray-200 shadow-xs">
            {/* Form Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wide">
                  {editingId ? "Edit FAQ" : "Add New FAQ"}
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
              {/* Question Field */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Question <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the FAQ question..."
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
                  required
                />
              </div>

              {/* Answer Field */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Answer <span className="text-primary">*</span>
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the FAQ answer..."
                  rows={6}
                  className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none"
                  required
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
                        ? "Update FAQ"
                        : "Add FAQ"}
                  </span>
                </button>
                {(question || answer) && (
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
        )}

        {/* ═══════════════════════════════════════════════════
            RIGHT PANEL — Reusable DataTable Component with Drag & Drop Reordering
           ═══════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          <DataTable
            data={faqs}
            loading={loading}
            error={error}
            onRefresh={fetchFaqs}
            columns={columns}
            title="FAQs List"
            detailTitle="FAQ Details"
            renderDrawerDetail={(faq) => (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Question
                  </label>
                  <p className="text-base font-bold text-gray-900 leading-snug">
                    {faq.question}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Answer
                  </label>
                  <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>

                {(faq.createdAt || faq.updatedAt) && (
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
                      Timestamp Info
                    </label>
                    <p className="text-xs font-medium text-gray-500 font-mono">
                      {faq.createdAt &&
                        `Created: ${new Date(faq.createdAt).toLocaleString()}`}
                      {faq.updatedAt &&
                        ` | Updated: ${new Date(faq.updatedAt).toLocaleString()}`}
                    </p>
                  </div>
                )}
              </>
            )}
            exportFilename="faqs_export.csv"
            searchPlaceholder="Search FAQs..."
            reorderable={true}
            onSaveOrder={handleSaveOrder}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
         ═══════════════════════════════════════════════════ */}
      {deleteModalOpen && deletingFaq && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 md:p-8 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 border border-red-100 text-primary flex items-center justify-center flex-shrink-0">
                <LuShieldAlert className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-oswald text-xl font-bold text-secondary uppercase tracking-wide">
                  Delete FAQ<span className="text-primary">?</span>
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  Are you sure you want to delete this FAQ? This action cannot
                  be undone.
                </p>
                <div className="mt-3 p-3 bg-slate-50 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Question
                  </p>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">
                    {deletingFaq.question}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingFaq(null);
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

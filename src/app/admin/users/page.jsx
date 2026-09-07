"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  LuUsers,
  LuPlus,
  LuShieldCheck,
  LuClock,
  LuPhone,
  LuMail,
  LuCircleCheck,
  LuPencil,
  LuX,
  LuHistory,
  LuRefreshCw,
  LuBan,
  LuShieldAlert,
  LuCheck,
  LuTrash2,
} from "react-icons/lu";
import { PERMISSION_MODULES, SYSTEM_ROLES } from "@/lib/permissions";

const SESSION_DURATION_OPTIONS = [
  { value: 1, label: "1 Hour" },
  { value: 3, label: "3 Hours" },
  { value: 6, label: "6 Hours" },
  { value: 12, label: "12 Hours (Default)" },
  { value: 18, label: "18 Hours" },
  { value: 24, label: "24 Hours (1 Day)" },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // "users" | "logs"

  // Inline Add User Card Toggle
  const [showAddForm, setShowAddForm] = useState(false);

  // Inline Form Edit Mode & Modals (Restrict Access, Delete User)
  const [editingUserId, setEditingUserId] = useState(null);
  const [restrictingUser, setRestrictingUser] = useState(null);
  const [isRestricting, setIsRestricting] = useState(false);

  // Double Confirmation Delete User States
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // New / Edit User Form State (No username, No plain password)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    role: SYSTEM_ROLES.ASSOCIATE,
    sessionDurationHours: 12,
    permissions: ["services:view", "projects:view", "careers:view", "faqs:view", "submissions:view"],
  });

  // Action states for Email sending
  const [sendingMailUserId, setSendingMailUserId] = useState(null);
  const [sentMailMap, setSentMailMap] = useState({});

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) void fetchUsersData();
    });
    return () => {
      ignore = true;
    };
  }, [fetchUsersData]);

  // Form helpers
  const handlePermissionToggle = (permKey, currentPerms, setPermsFn) => {
    if (currentPerms.includes(permKey)) {
      setPermsFn(currentPerms.filter((p) => p !== permKey));
    } else {
      setPermsFn([...currentPerms, permKey]);
    }
  };

  const handleSelectAllModule = (moduleKey, currentPerms, setPermsFn) => {
    const mod = PERMISSION_MODULES.find((m) => m.key === moduleKey);
    if (!mod) return;
    const modPermKeys = mod.actions.map((a) => a.key);
    const hasAll = modPermKeys.every((k) => currentPerms.includes(k));

    if (hasAll) {
      setPermsFn(currentPerms.filter((p) => !modPermKeys.includes(p)));
    } else {
      const combined = Array.from(new Set([...currentPerms, ...modPermKeys]));
      setPermsFn(combined);
    }
  };

  // Start Editing User in Top Form Area
  const handleStartEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      role: user.role || SYSTEM_ROLES.ASSOCIATE,
      sessionDurationHours: user.sessionDurationHours || 12,
      permissions: user.permissions || [],
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel Form
  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingUserId(null);
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      role: SYSTEM_ROLES.ASSOCIATE,
      sessionDurationHours: 12,
      permissions: ["services:view", "projects:view", "careers:view", "faqs:view", "submissions:view"],
    });
  };

  // Create or Update User Handler
  const handleSaveUserAccount = async (e) => {
    e.preventDefault();

    const targetEmail = formData.email.trim().toLowerCase();

    // Client-side uniqueness validation against loaded users list
    const duplicateUser = users.find((u) => {
      if (editingUserId && u._id === editingUserId) return false;
      return u.email?.toLowerCase() === targetEmail;
    });

    if (duplicateUser) {
      toast.error("An account with this email address already exists.");
      return;
    }

    if (editingUserId) {
      // Edit User Account
      try {
        const res = await fetch(`/api/users/${editingUserId}/permissions`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingUserId,
            fullName: formData.fullName,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            role: formData.role,
            sessionDurationHours: formData.sessionDurationHours,
            permissions: formData.permissions,
            updatedByName: "Super Admin",
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || "User account updated successfully.");
          handleCancelForm();
          fetchUsersData();
        } else {
          toast.error(data.error || "Failed to update user account.");
        }
      } catch (err) {
        toast.error("Error updating user account.");
      }
    } else {
      // Create New User Account
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, createdByName: "Super Admin" }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Failed to create user.");
        } else {
          toast.success(data.message || "User created successfully.");
          handleCancelForm();
          fetchUsersData();
        }
      } catch (err) {
        toast.error("Error creating user account.");
      }
    }
  };

  // Restrict Login / Restore Access Handler
  const handleToggleAccessDeny = (user) => {
    setRestrictingUser(user);
  };

  const confirmToggleAccess = async () => {
    if (!restrictingUser) return;
    setIsRestricting(true);
    const newStatus = restrictingUser.isActive === false; // Toggle
    try {
      const res = await fetch(`/api/users/${restrictingUser._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: newStatus,
          performedBy: "Super Admin",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setRestrictingUser(null);
        fetchUsersData();
      } else {
        toast.error(data.error || "Failed to update user status.");
      }
    } catch (err) {
      toast.error("Network error updating user status.");
    } finally {
      setIsRestricting(false);
    }
  };

  // Delete User Double Step Handlers
  const handleStartDelete = (user) => {
    setDeletingUser(user);
    setDeleteStep(1);
    setDeleteConfirmText("");
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;
    if (deleteConfirmText !== "Delete") {
      toast.error("Please type 'Delete' exactly to confirm.");
      return;
    }
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deletingUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `User ${deletingUser.fullName || deletingUser.email} deleted.`);
        setDeletingUser(null);
        setDeleteStep(1);
        setDeleteConfirmText("");
        fetchUsersData();
      } else {
        toast.error(data.error || "Failed to delete user.");
      }
    } catch (err) {
      toast.error("Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Send Access Instructions / Password Setup Email via Pooled Nodemailer
  const handleSendCredentialsEmail = async (user) => {
    if (!user || !user._id) return;
    if (!user.email) {
      toast.error("This user account does not have a valid email address.");
      return;
    }

    setSendingMailUserId(user._id);
    const toastId = toast.loading(`Sending access instructions to ${user.email}...`);

    try {
      const res = await fetch("/api/users/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || `Access email sent to ${user.email}`, { id: toastId });
        setSentMailMap((prev) => ({ ...prev, [user._id]: true }));
        setTimeout(() => {
          setSentMailMap((prev) => ({ ...prev, [user._id]: false }));
        }, 3000);
        fetchUsersData();
      } else {
        toast.error(data.error || "Failed to send access email.", { id: toastId });
      }
    } catch (err) {
      console.error("Error sending access email:", err);
      toast.error("Failed to connect to email service.", { id: toastId });
    } finally {
      setSendingMailUserId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center">
              <LuUsers className="text-base" />
            </div>
            <h2 className="font-oswald text-xl font-bold text-secondary-dark uppercase tracking-wider">
              Staff & User Management
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Create, manage, and configure role-based access for administrative staff and team members.
          </p>
        </div>

        {/* Action Toggle Button */}
        <button
          onClick={() => {
            if (showAddForm) {
              handleCancelForm();
            } else {
              setShowAddForm(true);
            }
          }}
          className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs self-start md:self-auto"
        >
          <LuPlus className="text-sm" />
          <span>{showAddForm && !editingUserId ? "Hide User Form" : "Add New User"}</span>
        </button>
      </div>

      {/* ── 1. INLINE TOP AREA: ADD / EDIT USER ACCOUNT FORM CARD ─────────────────── */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 shadow-md p-6 transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {editingUserId ? <LuPencil /> : "+"}
              </div>
              <h3 className="font-oswald text-lg font-bold text-secondary-dark uppercase tracking-wider">
                {editingUserId ? `Edit User Account: ${formData.fullName || formData.email}` : "Add New User Account"}
              </h3>
            </div>
            <button
              onClick={handleCancelForm}
              className="text-xs text-gray-400 hover:text-gray-700 font-semibold flex items-center gap-1 uppercase cursor-pointer"
            >
              <LuX /> Close
            </button>
          </div>

          <form onSubmit={handleSaveUserAccount} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address (Login Identifier)
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                  placeholder="john@pmvmaritime.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Assign Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                >
                  <option value={SYSTEM_ROLES.ADMIN}>ADMIN (Content Manager)</option>
                  <option value={SYSTEM_ROLES.ASSOCIATE}>ASSOCIATE (Helper / Staff)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Session Duration Expiry
                </label>
                <select
                  value={formData.sessionDurationHours}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionDurationHours: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                >
                  {SESSION_DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password Security Notice */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <LuShieldCheck className="text-base text-emerald-600 shrink-0" />
              <span>
                Account passwords are protected with bcrypt encryption. New users can set their initial password securely via the <strong>&quot;Forgot Password?&quot;</strong> option on the login portal.
              </span>
            </div>

            {/* PERMISSIONS MATRIX CHECKBOXES INLINE */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-oswald text-sm font-bold text-secondary uppercase tracking-wider mb-3">
                Permission Toggles Matrix
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PERMISSION_MODULES.filter((m) => m.key !== "users").map((mod) => (
                  <div key={mod.key} className="p-3 bg-slate-50 border border-gray-200">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
                      <span className="text-xs font-bold text-gray-900 uppercase">
                        {mod.label}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelectAllModule(
                            mod.key,
                            formData.permissions,
                            (newP) => setFormData({ ...formData, permissions: newP })
                          )
                        }
                        className="text-[11px] font-bold text-secondary hover:text-secondary-dark"
                      >
                        Toggle All
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {mod.actions.map((act) => {
                        const isChecked = formData.permissions.includes(act.key);
                        return (
                          <label
                            key={act.key}
                            className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 select-none hover:text-gray-900"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                handlePermissionToggle(
                                  act.key,
                                  formData.permissions,
                                  (newP) => setFormData({ ...formData, permissions: newP })
                                )
                              }
                              className="accent-[#007BA7] rounded-sm"
                            />
                            <span>{act.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                {editingUserId ? "Update User Account" : "Create User Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Navigation Tab Pills: Accounts vs Security Logs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 font-oswald text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === "users"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
        >
          All Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`pb-3 px-4 font-oswald text-sm font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${activeTab === "logs"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
        >
          Security Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USERS TABLE */}
      {activeTab === "users" && (
        <div className="bg-white border border-gray-200">
          {loading ? (
            <div className="py-16 text-center text-xs text-gray-400 animate-pulse">
              Loading system accounts matrix...
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-xs text-gray-400">
              No custom user accounts created yet. Use the top area form to create an account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                    <th className="py-3 px-4 whitespace-nowrap">User Details</th>
                    <th className="py-3 px-4 whitespace-nowrap">Role</th>
                    <th className="py-3 px-4 whitespace-nowrap">Contact & Mobile</th>
                    <th className="py-3 px-4 whitespace-nowrap">Session Duration</th>
                    <th className="py-3 px-4 whitespace-nowrap">Granted Permissions</th>
                    <th className="py-3 px-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{u.fullName}</div>
                        <span className="text-[11px] text-gray-400">{u.email}</span>
                      </td>

                      <td className="flex items-center gap-1.5 py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${u.role === SYSTEM_ROLES.SUPER_ADMIN
                            ? "bg-purple-50 text-purple-800 border-purple-200"
                            : u.role === SYSTEM_ROLES.ADMIN
                              ? "bg-sky-50 text-[#005978] border-sky-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                            }`}
                        >
                          {u.role}
                        </span>
                        {u.isActive === false && (
                          <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-300">
                            Restricted
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[13px] text-gray-800">
                        <div className="flex items-center gap-2">
                          <LuMail className="text-primary" /> {u.email}
                        </div>
                        {u.mobileNumber && (
                          <div className="flex items-center gap-2 text-[11px] text-gray-800 mt-0.5">
                            <LuPhone className="text-secondary-dark" /> {u.mobileNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-gray-700">
                        <div className="flex items-center gap-2">
                          <LuClock className="text-secondary" />
                          <span>{u.sessionDurationHours || 12} Hours</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 border border-gray-200 text-[11px] font-black text-gray-700">
                          {u.role === SYSTEM_ROLES.SUPER_ADMIN
                            ? "ALL (Super Admin)"
                            : `${(u.permissions || []).length} Actions Granted`}
                        </span>
                      </td>

                      {/* Consolidated React Icon-Only Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {/* 1. Edit */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(u)}
                            className="p-2 bg-slate-100 hover:bg-primary text-gray-600 hover:text-white border border-gray-200 transition-colors cursor-pointer"
                            title={`Edit ${u.fullName}`}
                          >
                            <LuPencil className="text-sm" />
                          </button>

                          {/* 2. Send Access Email */}
                          <button
                            type="button"
                            onClick={() => handleSendCredentialsEmail(u)}
                            disabled={sendingMailUserId === u._id}
                            className="p-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
                            title={
                              sentMailMap[u._id]
                                ? `Access Instructions Sent to ${u.email}!`
                                : `Send Access / Setup Email to ${u.email}`
                            }
                          >
                            {sendingMailUserId === u._id ? (
                              <LuRefreshCw className="text-sm animate-spin" />
                            ) : sentMailMap[u._id] ? (
                              <LuCheck className="text-sm text-emerald-600 font-bold" />
                            ) : (
                              <LuMail className="text-sm" />
                            )}
                          </button>

                          {/* 3. Restrict / Restore Access */}
                          <button
                            type="button"
                            onClick={() => handleToggleAccessDeny(u)}
                            className={`p-2 border transition-colors cursor-pointer ${u.isActive === false
                              ? "bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border-emerald-200"
                              : "bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white border-amber-200"
                              }`}
                            title={
                              u.isActive === false
                                ? "Restore Login Access"
                                : "Restrict Login Access (Access Denied)"
                            }
                          >
                            {u.isActive === false ? (
                              <LuCircleCheck className="text-sm" />
                            ) : (
                              <LuBan className="text-sm" />
                            )}
                          </button>

                          {/* 4. Delete Account (Not for Super Admin) */}
                          {u.role !== SYSTEM_ROLES.SUPER_ADMIN && u._id !== "super-admin-root" && (
                            <button
                              type="button"
                              onClick={() => handleStartDelete(u)}
                              className="p-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 transition-colors cursor-pointer"
                              title={`Delete ${u.fullName} (2-Step Confirmation)`}
                            >
                              <LuTrash2 className="text-sm" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SECURITY & AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
            <LuHistory className="text-primary text-base" /> Chronological Security Event Stream
          </h3>

          <div className="divide-y divide-gray-100 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 break-all">
                <div>
                  <span className="font-bold text-secondary uppercase tracking-wider mr-2">
                    [{log.action}]
                  </span>
                  <span className="text-gray-800 font-semibold">{log.details}</span>
                  <span className="text-gray-400 text-[11px] ml-2">by {log.performedBy}</span>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <LuClock /> {new Date(log.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: DELETE USER WITH 2-STEP CONFIRMATION */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <h3 className="font-oswald text-base font-bold uppercase tracking-wider flex items-center gap-2">
                <LuTrash2 className="text-lg" />
                {deleteStep === 1 ? "Confirm Delete User" : "Final Deletion Confirmation"}
              </h3>
              <button
                onClick={() => {
                  setDeletingUser(null);
                  setDeleteStep(1);
                  setDeleteConfirmText("");
                }}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {deleteStep === 1 ? (
                <>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                    Are you sure you want to delete the user account for{" "}
                    <span className="font-bold text-gray-900">{deletingUser.fullName}</span> ({deletingUser.email})?
                  </p>
                  <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 font-semibold">
                    ⚠ Proceeding to Step 2 will ask for final confirmation before permanent removal.
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingUser(null);
                        setDeleteStep(1);
                        setDeleteConfirmText("");
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteStep(2)}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Proceed to Step 2 →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                    <span className="font-bold text-red-600 uppercase">PERMANENT DELETION WARNING:</span> Are you absolutely sure you want to permanently delete user{" "}
                    <span className="font-bold text-gray-900">{deletingUser.fullName}</span> ({deletingUser.email})?
                  </p>
                  <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 font-bold space-y-1">
                    • Account details will be permanently removed from MongoDB.<br />
                    • All active user sessions will be forcibly terminated immediately.<br />
                    • This action CANNOT be undone.
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-bold text-gray-700 tracking-wider">
                      To confirm, type <span className="font-mono text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded border border-red-200">Delete</span> in the box below:
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type Here"
                      disabled={isDeleting}
                      className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 font-semibold focus:outline-none transition-colors duration-150"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteStep(1);
                        setDeleteConfirmText("");
                      }}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      ← Back to Step 1
                    </button>
                    <button
                      type="button"
                      onClick={confirmDeleteUser}
                      disabled={isDeleting || deleteConfirmText !== "Delete"}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Permanently Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESTRICT ACCESS / RESTORE ACCESS CONFIRMATION */}
      {restrictingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div
              className={`p-4 text-white flex items-center justify-between ${restrictingUser.isActive === false ? "bg-emerald-600" : "bg-red-600"
                }`}
            >
              <h3 className="font-oswald text-base font-bold uppercase tracking-wider flex items-center gap-2">
                {restrictingUser.isActive === false ? (
                  <>
                    <LuCircleCheck className="text-lg" /> Restore User Login Access
                  </>
                ) : (
                  <>
                    <LuShieldAlert className="text-lg" /> Restrict User Access
                  </>
                )}
              </h3>
              <button
                onClick={() => setRestrictingUser(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {restrictingUser.isActive === false ? (
                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Are you sure you want to{" "}
                  <span className="font-bold text-emerald-600">RESTORE LOGIN ACCESS</span> for{" "}
                  <span className="font-bold text-gray-900">
                    {restrictingUser.fullName || restrictingUser.email}
                  </span>
                  ?
                </p>
              ) : (
                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Are you sure you want to{" "}
                  <span className="font-bold text-red-600">RESTRICT LOGIN (ACCESS DENIED)</span> for{" "}
                  <span className="font-bold text-gray-900">
                    {restrictingUser.fullName || restrictingUser.email}
                  </span>
                  ?
                </p>
              )}

              <div className="p-3 bg-slate-50 border border-gray-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">User:</span>
                  <span className="font-bold text-gray-900">{restrictingUser.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">Email:</span>
                  <span className="font-mono text-gray-800">{restrictingUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">Role:</span>
                  <span className="font-bold text-secondary">{restrictingUser.role}</span>
                </div>
              </div>

              {restrictingUser.isActive === false ? (
                <p className="text-[11px] text-emerald-600 font-bold">
                  ✓ The user will immediately be able to log back into the admin panel.
                </p>
              ) : (
                <p className="text-[11px] text-red-500 font-bold">
                  ⚠ The user will be immediately logged out from all active sessions and future login attempts will be blocked.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setRestrictingUser(null)}
                  disabled={isRestricting}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmToggleAccess}
                  disabled={isRestricting}
                  className={`px-5 py-2 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer ${restrictingUser.isActive === false
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {isRestricting
                    ? "Updating..."
                    : restrictingUser.isActive === false
                      ? "Yes, Restore Access"
                      : "Yes, Restrict Access"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

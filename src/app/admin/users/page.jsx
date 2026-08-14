"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  LuUsers,
  LuPlus,
  LuShieldCheck,
  LuClock,
  LuKey,
  LuPhone,
  LuMail,
  LuCircleCheck,
  LuXCircle,
  LuUserX,
  LuPencil,
  LuX,
  LuLock,
  LuHistory,
  LuEye,
  LuEyeOff,
  LuChevronDown,
  LuChevronUp,
  LuCopy,
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

  // Inline Form Edit Mode & Modals (Pass Reset, Restrict Access, Delete User)
  const [editingUserId, setEditingUserId] = useState(null);
  const [resettingPassUser, setResettingPassUser] = useState(null);
  const [restrictingUser, setRestrictingUser] = useState(null);
  const [isRestricting, setIsRestricting] = useState(false);

  // Double Confirmation Delete User States
  const [deletingUser, setDeletingUser] = useState(null);
  const [deleteStep, setDeleteStep] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // New / Edit User Form State
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: SYSTEM_ROLES.ASSOCIATE,
    sessionDurationHours: 12,
    permissions: ["services:view", "projects:view", "careers:view", "faqs:view", "submissions:view"],
  });

  // Pass Reset State
  const [newPassword, setNewPassword] = useState("");
  const [showPlainPassMap, setShowPlainPassMap] = useState({});
  const [copiedMap, setCopiedMap] = useState({});

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
      username: user.username || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      password: "",
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
      username: "",
      email: "",
      mobileNumber: "",
      password: "",
      role: SYSTEM_ROLES.ASSOCIATE,
      sessionDurationHours: 12,
      permissions: ["services:view", "projects:view", "careers:view", "faqs:view", "submissions:view"],
    });
  };

  // Create or Update User Handler
  const handleSaveUserAccount = async (e) => {
    e.preventDefault();

    const targetEmail = formData.email.trim().toLowerCase();
    const targetUsername = formData.username.trim();

    // Client-side uniqueness validation against loaded users list
    const duplicateUser = users.find((u) => {
      if (editingUserId && u._id === editingUserId) return false;
      return u.email?.toLowerCase() === targetEmail || u.username === targetUsername;
    });

    if (duplicateUser) {
      if (duplicateUser.email?.toLowerCase() === targetEmail) {
        toast.error("An account with this email address already exists.");
        return;
      }
      if (duplicateUser.username === targetUsername) {
        toast.error("An account with this username already exists.");
        return;
      }
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
            username: formData.username,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            password: formData.password || undefined,
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
          toast.success(data.message);
          handleCancelForm();
          fetchUsersData();
        }
      } catch (err) {
        toast.error("Error creating user account.");
      }
    }
  };

  // Delete User Double Confirmation Handlers
  const handleStartDelete = (user) => {
    if (!user || !user._id) return;
    if (user.role === SYSTEM_ROLES.SUPER_ADMIN || user._id === "super-admin-root") {
      toast.error("Super Administrator root accounts cannot be deleted.");
      return;
    }
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
        toast.success(data.message || `User ${deletingUser.username} deleted.`);
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

  // Super Admin Direct Reset Password
  const handleSuperAdminResetPassword = async () => {
    if (!resettingPassUser || !newPassword.trim()) return;
    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resettingPassUser._id,
          newPassword,
          isSuperAdminReset: true,
          performedBy: "Super Admin",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setResettingPassUser(null);
        setNewPassword("");
        fetchUsersData();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Password reset failed.");
    }
  };

  // Copy password to clipboard (Shows checkmark icon temporarily instead of toast)
  const handleCopyPassword = (userId, pass) => {
    if (!pass) return;
    try {
      navigator.clipboard.writeText(pass);
      setCopiedMap((prev) => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setCopiedMap((prev) => ({ ...prev, [userId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
    }
  };

  // Restrict Login / Access Denied Toggle Modal Trigger
  const handleToggleAccessDeny = (user) => {
    if (!user || !user._id) return;

    if (user.role === SYSTEM_ROLES.SUPER_ADMIN || user._id === "super-admin-root") {
      toast.error("Super Administrator accounts cannot be restricted.");
      return;
    }

    setRestrictingUser(user);
  };

  // Confirm Access Toggle Handler
  const confirmToggleAccess = async () => {
    if (!restrictingUser) return;
    const newStatus = restrictingUser.isActive === false ? true : false;
    setIsRestricting(true);

    try {
      const res = await fetch(`/api/users/${restrictingUser._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: restrictingUser._id,
          isActive: newStatus,
          performedBy: "Super Admin",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || `User access ${newStatus ? "restored" : "restricted"}.`);
        setRestrictingUser(null);
        fetchUsersData();
      } else {
        toast.error(data.error || "Failed to update access status.");
      }
    } catch (err) {
      toast.error("Error updating user status.");
    } finally {
      setIsRestricting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="font-oswald text-2xl font-bold text-secondary-dark uppercase tracking-wider flex items-center gap-2">
            <LuUsers className="text-primary text-2xl" />
            User & Role Permission Matrix
          </h2>
        </div>

        <button
          onClick={() => {
            if (showAddForm && !editingUserId) {
              setShowAddForm(false);
            } else {
              handleCancelForm();
              setShowAddForm(true);
            }
          }}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
        >
          {showAddForm && !editingUserId ? <LuChevronUp className="text-base" /> : <LuPlus className="text-base" />}
          <span>{showAddForm && !editingUserId ? "Hide Add User Form" : "Add New User Account"}</span>
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
                {editingUserId ? `Edit User Account: ${formData.fullName || formData.username}` : "Add New User Account"}
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
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                  placeholder="e.g. john_doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
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

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  {editingUserId ? "New Password (Leave blank to keep current)" : "Initial Password"}
                </label>
                <input
                  type="password"
                  required={!editingUserId}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                  placeholder={editingUserId ? "Leave blank to keep current password" : "Enter initial password"}
                />
              </div>
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
                        className="text-[10px] font-bold text-secondary hover:underline uppercase cursor-pointer"
                      >
                        Toggle All
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {mod.actions.map((act) => {
                        const checked = formData.permissions.includes(act.key);
                        return (
                          <label
                            key={act.key}
                            className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 hover:text-gray-900"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                handlePermissionToggle(
                                  act.key,
                                  formData.permissions,
                                  (newP) => setFormData({ ...formData, permissions: newP })
                                )
                              }
                              className="text-primary rounded-none focus:ring-0"
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

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-600 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {editingUserId ? "Save User Changes" : "Save & Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${activeTab === "users"
            ? "border-secondary text-secondary font-extrabold bg-slate-50"
            : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
        >
          <LuShieldCheck className="text-base" /> Users & Permissions ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${activeTab === "logs"
            ? "border-secondary text-secondary font-extrabold bg-slate-50"
            : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
        >
          <LuHistory className="text-base" /> Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USERS & PERMISSION MATRIX */}
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
                    <th className="py-3 px-4 whitespace-nowrap">Password Ref</th>
                    <th className="py-3 px-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{u.fullName}</div>
                        <span className="text-[11px] text-gray-400">@{u.username}</span>
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

                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="flex flex-col justify-start w-fit">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="w-full text-center">
                              {showPlainPassMap[u._id] ? u.plainRef || "••••••" : "••••••••"}
                            </span>
                            <div className="flex items-center gap-0.5 pt-0.5">
                              <button
                                onClick={() =>
                                  setShowPlainPassMap((prev) => ({
                                    ...prev,
                                    [u._id]: !prev[u._id],
                                  }))
                                }
                                className="text-secondary p-1 transition-colors cursor-pointer"
                                title="Toggle Password View"
                              >
                                {showPlainPassMap[u._id] ? <LuEyeOff className="text-[15px]" /> : <LuEye className="text-[15px]" />}
                              </button>

                              <button
                                onClick={() => handleCopyPassword(u._id, u.plainRef || u.password)}
                                className="text-sky-600 p-1 transition-colors cursor-pointer"
                                title={copiedMap[u._id] ? "Copied!" : "Copy Password to Clipboard"}
                              >
                                {copiedMap[u._id] ? (
                                  <LuCheck className="text-[15px] text-emerald-600 font-bold animate-in zoom-in duration-100" />
                                ) : (
                                  <LuCopy className="text-[15px]" />
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  setResettingPassUser(u);
                                  setNewPassword("");
                                }}
                                className="text-amber-600 p-1 transition-colors cursor-pointer"
                                title="Reset Password"
                              >
                                <LuRefreshCw className="text-[15px]" />
                              </button>

                              <button
                                onClick={() => handleToggleAccessDeny(u)}
                                className={`p-1 transition-colors cursor-pointer ${u.isActive === false
                                  ? "text-emerald-600"
                                  : "text-red-600"
                                  }`}
                                title={u.isActive === false ? "Restore Access" : "Restrict Login Access (Access Denied)"}
                              >
                                {u.isActive === false ? <LuCircleCheck className="text-[15px] text-red-600" /> : <LuBan className="text-[15px]" />}
                              </button>
                            </div>
                          </div>
                        </div>

                      </td>

                      <td className="py-3.5 px-4 flex whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleStartEdit(u)}
                          className="ps-2 pe-2.5 py-1 bg-slate-100 hover:bg-primary text-gray-700 hover:text-white text-[11px] font-bold uppercase tracking-wider border border-gray-200 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <LuPencil /> <span className="leading-3 pt-0.5">Edit</span>
                        </button>
                        {u.role !== SYSTEM_ROLES.SUPER_ADMIN && u._id !== "super-admin-root" && (
                          <button
                            onClick={() => handleStartDelete(u)}
                            className="ps-2 pe-2.5 py-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-[11px] font-bold uppercase tracking-wider border border-red-200 hover:border-red-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                            title="Delete User Account (2-Step Confirmation)"
                          >
                            <LuTrash2 className="text-xs" /> <span className="leading-3 pt-0.5">Delete</span>
                          </button>
                        )}
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
              <div key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

      {/* MODAL: DELETE USER ACCOUNT (2-STEP CONFIRMATION) */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <h3 className="font-oswald text-base font-bold uppercase tracking-wider flex items-center gap-2">
                <LuTrash2 className="text-lg" />
                {deleteStep === 1 ? "Delete User Account (Step 1 of 2)" : "FINAL WARNING: Delete Account (Step 2 of 2)"}
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
                    <span className="font-bold text-gray-900">{deletingUser.fullName}</span> (@{deletingUser.username})?
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
                    <span className="font-bold text-gray-900">{deletingUser.fullName}</span> (@{deletingUser.username})?
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

      {/* MODAL: SUPER ADMIN DIRECT PASSWORD RESET */}
      {resettingPassUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 bg-secondary-dark text-white flex items-center justify-between">
              <h3 className="font-oswald text-lg font-bold uppercase tracking-wider">
                Reset Password: {resettingPassUser.username}
              </h3>
              <button onClick={() => setResettingPassUser(null)} className="text-gray-300 hover:text-white">
                <LuX className="text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  New Password for {resettingPassUser.fullName}
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary font-mono"
                    placeholder="Type or generate random password"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setResettingPassUser(null)}
                  className="px-3 py-1.5 bg-slate-100 text-gray-600 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#@!";
                    let rand = "";
                    for (let i = 0; i < 9; i++) {
                      rand += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    setNewPassword(rand);
                  }}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Generate Random Password"
                >
                  <LuRefreshCw className="text-xs" /> Random
                </button>
                <button
                  onClick={handleSuperAdminResetPassword}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>
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
                    {restrictingUser.fullName || restrictingUser.username}
                  </span>
                  ?
                </p>
              ) : (
                <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                  Are you sure you want to{" "}
                  <span className="font-bold text-red-600">RESTRICT LOGIN (ACCESS DENIED)</span> for{" "}
                  <span className="font-bold text-gray-900">
                    {restrictingUser.fullName || restrictingUser.username}
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
                  <span className="text-gray-500 font-bold uppercase">Username:</span>
                  <span className="font-mono text-gray-800">@{restrictingUser.username}</span>
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

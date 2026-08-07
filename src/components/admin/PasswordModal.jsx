"use client";

import React, { useState } from "react";
import { LuX, LuLock, LuEye, LuEyeOff, LuCircleCheck } from "react-icons/lu";

export default function PasswordModal({ isOpen, onClose, userSession }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError("Please fill in both current and new passwords.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userSession?.user?.username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update password.");
      } else {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          onClose();
          setSuccess("");
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-4 bg-secondary-dark text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuLock className="text-secondary text-lg" />
            <h3 className="font-oswald text-lg font-bold uppercase tracking-wider">
              Change Account Password
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <LuX className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
              <LuCircleCheck className="text-base" /> {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-gray-200 text-xs font-semibold focus:outline-none focus:border-secondary"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-xs font-bold text-gray-500 hover:text-secondary flex items-center gap-1"
            >
              {showPass ? <LuEyeOff /> : <LuEye />} {showPass ? "Hide" : "Show"} Passwords
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-100 text-gray-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Save Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

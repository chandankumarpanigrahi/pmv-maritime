"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LuBell, LuCheck, LuTrash2, LuX, LuClock, LuMail, LuShieldAlert, LuUserCheck } from "react-icons/lu";

export default function NotificationDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("unread"); // "unread" | "read"
  const [unreadList, setUnreadList] = useState([]);
  const [readList, setReadList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUnreadList(data.unread || []);
        setReadList(data.read || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const clearAllRead = async () => {
    try {
      const res = await fetch("/api/notifications/clear", { method: "DELETE" });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "LOGIN":
        return <LuUserCheck className="text-emerald-500" />;
      case "TERMINATE":
        return <LuShieldAlert className="text-red-500" />;
      case "SUBMISSION":
        return <LuMail className="text-sky-500" />;
      default:
        return <LuBell className="text-secondary" />;
    }
  };

  return (
    <div className="relative">
      {/* Top Bar Notification Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-secondary hover:bg-slate-100 transition-colors focus:outline-none"
        title="Activity Notifications"
      >
        <LuBell className="text-xl" />
        {unreadList.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-black flex items-center justify-center rounded-full animate-pulse">
            {unreadList.length > 9 ? "9+" : unreadList.length}
          </span>
        )}
      </button>

      {/* Slide-over Drawer / Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-4 bg-secondary-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LuBell className="text-lg text-secondary" />
              <h3 className="font-oswald text-base font-bold uppercase tracking-wider">
                Notifications
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <LuX className="text-lg" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 bg-slate-50 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("unread")}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === "unread"
                  ? "border-primary text-primary bg-white font-extrabold"
                  : "border-transparent text-gray-500 hover:text-slate-800"
              }`}
            >
              Unread ({unreadList.length})
            </button>
            <button
              onClick={() => setActiveTab("read")}
              className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
                activeTab === "read"
                  ? "border-primary text-primary bg-white font-extrabold"
                  : "border-transparent text-gray-500 hover:text-slate-800"
              }`}
            >
              Read ({readList.length})
            </button>
          </div>

          {/* List Content */}
          <div className="p-3 overflow-y-auto flex-1 divide-y divide-gray-100 min-h-[250px]">
            {loading && (
              <div className="py-8 text-center text-xs text-gray-400 animate-pulse">
                Updating activity stream...
              </div>
            )}

            {activeTab === "unread" && unreadList.length === 0 && !loading && (
              <div className="py-12 text-center text-gray-400 text-xs">
                <LuCheck className="text-3xl text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-gray-600">All caught up!</p>
                <p className="text-[11px] text-gray-400 mt-0.5">No unread notifications.</p>
              </div>
            )}

            {activeTab === "read" && readList.length === 0 && !loading && (
              <div className="py-12 text-center text-gray-400 text-xs">
                <p className="font-bold text-gray-600">No read notifications</p>
              </div>
            )}

            {/* Render Items */}
            {(activeTab === "unread" ? unreadList : readList).map((item) => (
              <div key={item._id} className="py-3 flex items-start gap-3 hover:bg-slate-50 p-2 transition-colors">
                <div className="mt-0.5 text-base flex-shrink-0">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-normal">{item.message}</p>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                    <LuClock className="text-[10px]" />
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Mark as Read Tick Action Button */}
                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item._id)}
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 transition-colors flex items-center justify-center flex-shrink-0"
                    title="Mark as Read (Tick)"
                  >
                    <LuCheck className="text-sm font-bold" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer Controls */}
          {activeTab === "read" && readList.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={clearAllRead}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                <LuTrash2 className="text-xs" /> Clear All Read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

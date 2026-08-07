"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LuBellDot,
  LuCheck,
  LuTrash2,
  LuClock,
  LuMail,
  LuShieldAlert,
  LuUserCheck,
  LuLayers,
} from "react-icons/lu";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("unread"); // "unread" | "read"
  const [unreadList, setUnreadList] = useState([]);
  const [readList, setReadList] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const interval = setInterval(fetchNotifications, 10000);
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

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PUT" });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
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
        return <LuUserCheck className="text-emerald-500 text-lg" />;
      case "TERMINATE":
        return <LuShieldAlert className="text-red-500 text-lg" />;
      case "SUBMISSION":
        return <LuMail className="text-sky-500 text-lg" />;
      default:
        return <LuLayers className="text-secondary text-lg" />;
    }
  };

  return (
    <div className="p-2 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="font-oswald text-lg md:text-2xl font-bold text-secondary-dark uppercase tracking-wider flex items-center gap-2">
            <LuBellDot className="text-primary text-2xl" />
            All Notifications
          </h2>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row border-b items-center border-gray-200 bg-white">
        <div className="flex flex-row">
          <button
            onClick={() => setActiveTab("unread")}
            className={`w-full md:w-fit justify-center px-3 md:px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${activeTab === "unread"
              ? "border-primary text-primary font-extrabold bg-slate-50"
              : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            Unread ({unreadList.length})
          </button>

          <button
            onClick={() => setActiveTab("read")}
            className={`w-full md:w-fit justify-center px-3 md:px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${activeTab === "read"
              ? "border-primary text-primary font-extrabold bg-slate-50"
              : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            Read ({readList.length})
          </button>
        </div>
        {activeTab === "unread" && unreadList.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="w-full md:w-fit justify-center mt-3 md:mt-0 ms-auto px-2 py-1.5 h-fit bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LuCheck className="text-sm font-black" /> Mark All Read
          </button>
        )}
        {activeTab === "read" && readList.length > 0 && (
          <button
            onClick={clearAllRead}
            className="w-full md:w-fit justify-center mt-3 md:mt-0 ms-auto px-2 py-1.5 h-fit bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LuTrash2 className="text-sm" /> Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-gray-200 px-0 py-2 md:p-3">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400 animate-pulse">
            Fetching latest notifications stream...
          </div>
        ) : (activeTab === "unread" ? unreadList : readList).length === 0 ? (
          <div className="py-16 border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
            <LuBellDot className="text-4xl text-gray-300 mb-3" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {activeTab === "unread" ? "No Unread Notifications" : "No Read Notifications"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {activeTab === "unread"
                ? "You're all caught up! New activity will appear here."
                : "Your read notification archive is empty."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {(activeTab === "unread" ? unreadList : readList).map((item) => (
              <div
                key={item._id}
                className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 px-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-slate-100 border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-900 leading-snug">{item.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{item.message}</p>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-1 font-semibold">
                      <LuClock className="text-xs" />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item._id)}
                    className="w-full md:w-fit flex justify-center px-1.5 py-1 cursor-pointer bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 text-xs font-bold uppercase tracking-wider transition-colors items-center gap-1.5 flex-shrink-0 self-start sm:self-center"
                    title="Mark as Read (Tick)"
                  >
                    <LuCheck className="text-sm font-black" />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

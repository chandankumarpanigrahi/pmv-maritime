"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  LuCircleGauge,
  LuShieldAlert,
  LuLaptop,
  LuGlobe,
  LuRefreshCw,
  LuX,
  LuTrash2,
} from "react-icons/lu";

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [terminatingTarget, setTerminatingTarget] = useState(null);
  const [isTerminating, setIsTerminating] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [currentSessionToken] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const sessionStr = localStorage.getItem("pmv_admin_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          return parsed?.sessionToken || "";
        }
      } catch (e) {
        console.error("Error reading current session token:", e);
      }
    }
    return "";
  });

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sessions", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) void fetchSessions();
    });
    const interval = setInterval(fetchSessions, 8000); // refresh every 8s
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [fetchSessions]);

  const confirmTerminateSession = async () => {
    if (!terminatingTarget) return;

    setIsTerminating(true);
    try {
      const res = await fetch("/api/sessions/terminate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: terminatingTarget._id,
          sessionToken: terminatingTarget.sessionToken,
          terminatedByName: "Super Admin",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Session terminated successfully.");
        setTerminatingTarget(null);
        fetchSessions();
      } else {
        toast.error(data.error || "Failed to terminate session.");
      }
    } catch (err) {
      toast.error("Failed to terminate session.");
    } finally {
      setIsTerminating(false);
    }
  };

  const handleClearEndedSessions = async () => {
    setIsClearing(true);
    try {
      const res = await fetch("/api/sessions", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Ended sessions history cleared.");
        setShowClearModal(false);
        fetchSessions();
      } else {
        toast.error(data.error || "Failed to clear ended sessions.");
      }
    } catch (err) {
      toast.error("Failed to clear ended sessions.");
    } finally {
      setIsClearing(false);
    }
  };

  const activeCount = sessions.filter(
    (s) => !s.isTerminated && new Date() < new Date(s.expiresAt)
  ).length;

  const endedCount = sessions.filter(
    (s) => s.isTerminated || new Date() > new Date(s.expiresAt)
  ).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="font-oswald text-2xl font-bold text-secondary-dark uppercase tracking-wider flex items-center gap-2">
            <LuCircleGauge className="text-primary text-2xl" />
            Live Active Sessions Monitor
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            Active Sessions: {activeCount}
          </span>

          {endedCount > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-red-600 text-gray-700 hover:text-white border border-gray-200 hover:border-red-600 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Clear terminated and logged out session history"
            >
              <LuTrash2 className="text-sm" /> Clear History ({endedCount})
            </button>
          )}

          <button
            onClick={fetchSessions}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
            title="Refresh Sessions"
          >
            <LuRefreshCw className="text-base" />
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white border border-gray-200">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400 animate-pulse">
            Loading active sessions telemetry...
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-400">
            No active session logs recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-black text-gray-500 uppercase tracking-widest">
                  <th className="py-3 px-4">Logged In User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Login Time</th>
                  <th className="py-3 px-4">Expected Expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {sessions.map((s) => {
                  const isExpired = new Date() > new Date(s.expiresAt);
                  const isLive = !s.isTerminated && !isExpired;

                  return (
                    <tr key={s._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{s.fullName || s.username}</div>
                        <span className="text-[11px] text-gray-400">{s.email || `@${s.username}`}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-slate-100 border border-gray-200 text-gray-700">
                          {s.role || "ADMIN"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 font-semibold text-[11px]">
                        {new Date(s.loginTime).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-gray-600 font-semibold text-[11px]">
                        {new Date(s.expiresAt).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {(() => {
                          const isCurrentSession = s.sessionToken === currentSessionToken;
                          const isSelfLogout = s.endReason === "LOGOUT" || s.terminatedBy === "Self Logout";

                          if (isCurrentSession && isLive) {
                            return (
                              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-sky-50 text-[#005978] border border-sky-300 flex items-center gap-1.5 w-fit shadow-xs">
                                <span className="w-2 h-2 bg-sky-500 rounded-full animate-ping"></span>
                                Current Session
                              </span>
                            );
                          }

                          if (s.isTerminated) {
                            if (isSelfLogout) {
                              return (
                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-300">
                                  Logged Out
                                </span>
                              );
                            }
                            return (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                                Terminated
                              </span>
                            );
                          }

                          if (isExpired) {
                            return (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-gray-100 text-gray-500 border border-gray-200">
                                Expired
                              </span>
                            );
                          }

                          return (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                              Active
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isLive &&
                          (s.sessionToken === currentSessionToken ? (
                            <span className="text-[10px] font-bold text-[#005978] uppercase tracking-wider bg-sky-50 px-2.5 py-1 border border-sky-200">
                              Current Active Session
                            </span>
                          ) : (
                            <button
                              onClick={() => setTerminatingTarget(s)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <LuShieldAlert className="text-xs" /> Terminate Session
                            </button>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TERMINATE SESSION CONFIRMATION MODAL */}
      {terminatingTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <h3 className="font-oswald text-base font-bold uppercase tracking-wider flex items-center gap-2">
                <LuShieldAlert className="text-lg" /> Force Terminate User Session
              </h3>
              <button
                onClick={() => setTerminatingTarget(null)}
                className="text-white/80 hover:text-white"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                Are you sure you want to force disconnect and terminate the active session for{" "}
                <span className="font-bold text-gray-900">
                  {terminatingTarget.fullName || terminatingTarget.username}
                </span>
                ?
              </p>

              <div className="p-3 bg-slate-50 border border-gray-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">Role:</span>
                  <span className="font-bold text-secondary">{terminatingTarget.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">IP Address:</span>
                  <span className="font-mono text-gray-800">{terminatingTarget.ipAddress || "127.0.0.1"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-bold uppercase">Login Time:</span>
                  <span className="text-gray-800">{new Date(terminatingTarget.loginTime).toLocaleTimeString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-red-500 font-bold">
                The user will be immediately logged out and redirected to the login screen on their next request.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTerminatingTarget(null)}
                  disabled={isTerminating}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmTerminateSession}
                  disabled={isTerminating}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isTerminating ? "Terminating..." : "Yes, Terminate Session"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR SESSION HISTORY CONFIRMATION MODAL */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <h3 className="font-oswald text-base font-bold uppercase tracking-wider flex items-center gap-2">
                <LuTrash2 className="text-lg" /> Clear Session History
              </h3>
              <button
                onClick={() => setShowClearModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                Are you sure you want to remove all{" "}
                <span className="font-bold text-red-600">{endedCount} terminated / logged out</span> session records from the table?
              </p>

              <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                ✓ All active user sessions ({activeCount}) will remain untouched and stay online.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClearModal(false)}
                  disabled={isClearing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearEndedSessions}
                  disabled={isClearing}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isClearing ? "Clearing..." : "Yes, Clear History"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

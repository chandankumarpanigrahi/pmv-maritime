"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LuSearch,
  LuFilter,
  LuDownload,
  LuShieldAlert,
  LuMail,
  LuMessageSquare,
  LuRotateCw,
  LuUser,
  LuChevronLeft,
  LuCompass,
  LuAnchor,
  LuInfo
} from "react-icons/lu";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/submissions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.statusText}`);
        }

        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        } else {
          throw new Error("Invalid data format received from SheetDB.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedQuery]);

  // Add sheet order indexing (#1, #2...) based on raw API order and sort newest on top
  const sortedData = data
    .map((row, idx) => ({ ...row, originalIndex: idx + 1 }))
    .reverse();

  // Filtering logic
  const filteredData = sortedData.filter((row) => {
    const nameMatch = row.fullName?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = row.email?.toLowerCase().includes(search.toLowerCase());
    const messageMatch = row.message?.toLowerCase().includes(search.toLowerCase());
    const matchesSearch = nameMatch || emailMatch || messageMatch;

    const matchesQuery = selectedQuery === "" || row.query === selectedQuery;

    return matchesSearch && matchesQuery;
  });

  // Pagination calculations
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Calculate statistics (on raw sheet data)
  const totalSubmissions = data.length;
  const totalGeneral = data.filter((row) => row.query === "general").length;
  const totalTechnical = data.filter((row) => row.query === "consultancy").length;
  const totalTraining = data.filter((row) => row.query === "training").length;

  // Export to CSV helper
  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ["Submission #", "Full Name", "Email", "Query Type", "Message"];
    const rows = filteredData.map((row) => [
      `#${row.originalIndex}`,
      row.fullName || "",
      row.email || "",
      row.query || "",
      row.message || ""
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pmv_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans pt-42 pb-16">
      <div className="container max-w-7xl mx-auto px-4 md:px-0">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-oswald text-3xl md:text-4xl font-bold text-secondary tracking-wide">
              Contact <span className="text-secondary-dark">Submissions</span><span className="text-primary">.</span>
            </h1>
            <span className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> Google Sheet Connected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRefreshTrigger(prev => prev + 1)}
              className="p-2.5 bg-white border border-gray-200 text-gray-600 hover:text-primary hover:border-primary transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center rounded-sm"
              title="Refresh Data"
            >
              <LuRotateCw className={`text-lg ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={exportToCSV}
              disabled={filteredData.length === 0}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none rounded-sm flex items-center gap-2"
            >
              <LuDownload className="text-md" /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white border border-gray-200 p-4 rounded-sm shadow-xs flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full lg:w-auto">
            {/* Search bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by name, email, query..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none pl-10 pr-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium rounded-sm"
              />
              <LuSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
            </div>

            {/* Filter query */}
            <div className="relative w-full md:w-56">
              <select
                value={selectedQuery}
                onChange={(e) => setSelectedQuery(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-2.5 pr-10 text-sm transition-all text-gray-900 font-medium appearance-none cursor-pointer rounded-sm"
              >
                <option value="">All Query Types</option>
                <option value="general">General Inquiry</option>
                <option value="consultancy">Technical Consultancy</option>
                <option value="training">Maritime DP Training</option>
                <option value="fleet">Fleet Management</option>
                <option value="crew">Crew Management</option>
                <option value="digital">Digital Solutions</option>
                <option value="others">Others</option>
              </select>
              <LuFilter className="absolute right-3.5 top-3.5 text-gray-400 text-sm pointer-events-none" />
            </div>
          </div>

          {/* Rows per page selector */}
          <div className="flex items-center gap-2.5 text-sm text-gray-500 font-bold w-full lg:w-auto">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-gray-200 outline-none px-3 py-2 text-sm font-bold rounded-sm cursor-pointer text-gray-700 focus:border-secondary"
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={20}>20 entries</option>
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
            </select>
          </div>
        </div>

        {/* Submissions Data Table */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-secondary rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-gray-500">Loading sheets data from SheetDB...</p>
            </div>
          ) : error ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <LuShieldAlert className="text-2xl" />
              </div>
              <h3 className="text-base font-bold text-gray-900">API Connection Failed</h3>
              <p className="text-xs text-red-500 mt-1 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => setRefreshTrigger(prev => prev + 1)}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">No submissions found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200 font-oswald text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-bold">Client / Name</th>
                    <th className="px-6 py-4 font-bold">Email Address</th>
                    <th className="px-6 py-4 font-bold">Query Type</th>
                    <th className="px-6 py-4 font-bold">Message Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4.5 whitespace-nowrap align-top">
                        <div className="flex items-center gap-3">
                          {/* Circle displaying submission number */}
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold border border-slate-200">
                            {row.originalIndex}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-gray-900 block">{row.fullName || "N/A"}</span>
                            <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Client</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap align-top">
                        <a
                          href={`mailto:${row.email}`}
                          className="flex items-center gap-1.5 text-sm text-secondary hover:text-secondary-dark font-semibold hover:underline transition-colors mt-1"
                        >
                          <LuMail className="text-sm" /> {row.email || "N/A"}
                        </a>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap align-top">
                        <span className={`text-center block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-sm mt-0.5 ${row.query === "general"
                          ? "bg-sky-50 text-sky-700 border border-sky-100"
                          : row.query === "consultancy"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : row.query === "training"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                          {row.query || "others"}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 align-top">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium max-w-xl" title={row.message}>
                          {row.message || "N/A"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="p-4 bg-slate-50 border-t border-gray-200 flex justify-center items-center text-xs font-semibold text-gray-500">
            <span>
              Showing {totalEntries === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, totalEntries)} of {totalEntries} entries {filteredData.length !== data.length && `(filtered from ${data.length} total)`}
            </span>
          </div>
        </div>

        {/* Pagination controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider bg-white text-gray-700 hover:bg-slate-100 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-sm cursor-pointer shadow-xs"
            >
              Previous
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-sm text-xs font-bold transition-all cursor-pointer shadow-xs ${currentPage === page
                    ? "bg-primary text-white font-extrabold"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-slate-100"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider bg-white text-gray-700 hover:bg-slate-100 hover:text-primary transition-colors disabled:opacity-40 disabled:pointer-events-none rounded-sm cursor-pointer shadow-xs"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

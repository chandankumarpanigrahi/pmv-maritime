"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";

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
  LuInfo,
  LuLogOut,
  LuLock,
  LuEye,
  LuEyeOff
} from "react-icons/lu";

import logo from "../../../public/assets/images/logo.png"
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

const sliderImages = [image1, image2, image3];

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const MAX_ATTEMPTS = 3;
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

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

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [isCurrentlyLocked, setIsCurrentlyLocked] = useState(false);
  const [minsLeft, setMinsLeft] = useState(0);
  const [loginError, setLoginError] = useState("");

  // Slider states
  const [sliderIndex, setSliderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Initialize and check session + lockout
  useEffect(() => {
    const sessionStr = localStorage.getItem("pmv_admin_session");
    let authenticated = false;
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.loggedIn && Date.now() < session.expiresAt) {
          authenticated = true;
        } else {
          localStorage.removeItem("pmv_admin_session");
        }
      } catch (e) {
        localStorage.removeItem("pmv_admin_session");
      }
    }

    const savedAttempts = localStorage.getItem("pmv_admin_attempts");
    const savedLockout = localStorage.getItem("pmv_admin_lockout_until");

    setTimeout(() => {
      if (authenticated) {
        setIsLoggedIn(true);
      }
      if (savedAttempts) {
        setAttempts(Number(savedAttempts));
      }
      if (savedLockout) {
        setLockoutTime(Number(savedLockout));
      }
      setIsCheckingAuth(false);
    }, 0);
  }, []);

  // Lockout tick / auto-reset
  useEffect(() => {
    if (lockoutTime > 0) {
      const checkLockout = () => {
        const now = Date.now();
        if (now < lockoutTime) {
          setIsCurrentlyLocked(true);
          setMinsLeft(Math.ceil((lockoutTime - now) / 60000));
        } else {
          setIsCurrentlyLocked(false);
          setMinsLeft(0);
          setLockoutTime(0);
          setAttempts(0);
          localStorage.removeItem("pmv_admin_lockout_until");
          localStorage.removeItem("pmv_admin_attempts");
        }
      };

      checkLockout();
      const interval = setInterval(checkLockout, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    if (lockoutTime > 0 && Date.now() < lockoutTime) {
      const currentNow = Date.now();
      const remainingMins = Math.ceil((lockoutTime - currentNow) / 60000);
      setLoginError(`Too many failed attempts. Try again in ${remainingMins} minutes.`);
      return;
    }

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError("Please enter both username and password.");
      return;
    }

    if (usernameInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setAttempts(0);
      setLockoutTime(0);
      setIsCurrentlyLocked(false);
      setMinsLeft(0);
      localStorage.setItem(
        "pmv_admin_session",
        JSON.stringify({
          loggedIn: true,
          expiresAt: Date.now() + SESSION_DURATION
        })
      );
      localStorage.removeItem("pmv_admin_attempts");
      localStorage.removeItem("pmv_admin_lockout_until");
      setUsernameInput("");
      setPasswordInput("");
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      localStorage.setItem("pmv_admin_attempts", nextAttempts.toString());

      if (nextAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + LOCKOUT_DURATION;
        setLockoutTime(until);
        localStorage.setItem("pmv_admin_lockout_until", until.toString());
        setLoginError(`Too many failed attempts. Access locked for 15 minutes.`);
      } else {
        setLoginError(`Invalid username or password. ${MAX_ATTEMPTS - nextAttempts} attempts remaining.`);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("pmv_admin_session");
  };

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


  // Export to CSV helper
  const exportToCSV = () => {
    if (filteredData.length === 0) return;

    const headers = ["Submission #", "Full Name", "Email", "Query Type", "Message", "Submitted At"];
    const rows = filteredData.map((row) => [
      `#${row.originalIndex}`,
      row.fullName || "",
      row.email || "",
      row.query || "",
      row.message || "",
      row.dateTime || ""
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

  if (isCheckingAuth) {
    return (
      <div className="container max-w-7xl mx-auto pt-44 bg-slate-50 text-gray-800 flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verifying Session...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container max-w-7xl mx-auto pt-44 md:px-0">
        <div className="w-full flex flex-col md:flex-row items-stretch border border-gray-200 bg-white shadow-xs overflow-hidden rounded-sm">

          {/* Left Column: Image Auto Slider */}
          <div className="hidden md:block md:w-1/2 relative overflow-hidden min-h-[450px]">
            {sliderImages.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`login-slider-image-${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === sliderIndex ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}

            {/* Soft overlay */}
            <div className="absolute inset-0 bg-secondary-dark/10 pointer-events-none"></div>

            {/* Carousel Navigation Dots */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5 bg-white/40 backdrop-blur-md p-1.5 border border-white/10 rounded-full">
              {sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSliderIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${idx === sliderIndex
                    ? "w-8 h-3 bg-primary"
                    : "w-3 h-3 bg-white/70 hover:bg-white"
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className={`${styles.adminbg} w-full md:w-1/2 bg-white px-6 py-10 md:px-22 md:py-16 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200`}>

            {/* Logo / Header */}
            <div className="flex flex-col items-center mb-8">
              <Image src={logo} width={70} alt="Logo" className="mb-2" />
              <h2 className="font-oswald text-3xl md:text-4xl font-bold text-center tracking-wider text-secondary">
                PMV <span className="text-secondary-dark">Maritime</span> Solutions<span className="text-primary">.</span>
              </h2>
              <p className="text-[16px] md:text-lg text-gray-400 font-bold uppercase tracking-widest mt-1">
                Admin Portal Login
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 text-xs rounded-sm font-semibold flex items-center gap-2">
                  <LuShieldAlert className="text-base flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter ID"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={isCurrentlyLocked}
                  className="w-full bg-white border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-3 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium rounded-sm disabled:bg-slate-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isCurrentlyLocked}
                    className="w-full bg-white border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none pl-4 pr-10 py-3 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium rounded-sm disabled:bg-slate-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    disabled={isCurrentlyLocked}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {showPassword ? <LuEyeOff className="text-base" /> : <LuEye className="text-base" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCurrentlyLocked}
                className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-xs cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:pointer-events-none rounded-sm flex items-center justify-center gap-2"
              >
                {isCurrentlyLocked ? (
                  <>
                    <LuLock className="text-sm animate-pulse" /> Locked out ({minsLeft}m left)
                  </>
                ) : (
                  <>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Additional visual details */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center md:justify-between text-[10px] text-gray-500 font-bold uppercase">
              <span className="hidden md:flex items-center text-[12px] gap-1.5 font-bold">
                <LuCompass className="text-sm text-gray-400 animate-spin-slow" /> Admin Authentication
              </span>
              <span className="font-bold text-[14px] md:text-[12px]">Attempts: {attempts} / {MAX_ATTEMPTS}</span>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-gray-800 font-sans pt-42">
      <div className="container max-w-7xl mx-auto px-4 md:px-0">

        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-col items-center md:items-start w-full">
            <h1 className="font-oswald text-3xl md:text-4xl font-bold text-secondary tracking-wide">
              Contact <span className="text-secondary-dark">Submissions</span><span className="text-primary">.</span>
            </h1>
            <span className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> Google Sheet Connected
            </span>
          </div>
          <div className="w-full md:w-auto flex justify-center items-center gap-3">
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
              className="h-[40px] px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:pointer-events-none rounded-sm flex items-center gap-2"
            >
              <LuDownload className="text-md" /> <span className="hidden md:block whitespace-nowrap">Export CSV</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-white border border-gray-200 text-red-600 hover:text-primary hover:border-primary hover:bg-slate-50 transition-all duration-300 shadow-xs cursor-pointer flex items-center justify-center rounded-sm"
              title="Logout"
            >
              <LuLogOut className="text-lg" />
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-50 border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none pl-10 pr-4 py-2.5 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium rounded-sm"
              />
              <LuSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
            </div>

            {/* Filter query */}
            <div className="relative w-full md:w-56">
              <select
                value={selectedQuery}
                onChange={(e) => {
                  setSelectedQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
                            <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">{row.dateTime || "N/A"}</span>
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

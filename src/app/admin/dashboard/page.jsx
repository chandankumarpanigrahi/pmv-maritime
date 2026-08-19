"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LuShip,
  LuFolderOpen,
  LuBriefcaseBusiness,
  LuMessageCircleQuestion,
  LuMail,
  LuPlus,
  LuArrowUpRight,
  LuClock,
  LuSparkles,
  LuExternalLink,
  LuChartBar,
} from "react-icons/lu";
import { hasPermission, canViewPage } from "@/lib/permissions";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeChartTab, setActiveChartTab] = useState("categories");

  // Permission States (evaluates on mount)
  const [canViewSubmissions] = useState(() => canViewPage(null, "contact"));
  const [canCreateServices] = useState(() => hasPermission(null, "services:create"));
  const [canCreateProjects] = useState(() => hasPermission(null, "projects:create"));
  const [canCreateCareers] = useState(() => hasPermission(null, "careers:create"));
  const [canCreateFaqs] = useState(() => hasPermission(null, "faqs:create"));

  // Data state
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [careers, setCareers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [servicesRes, projectsRes, careersRes, faqsRes, submissionsRes] =
        await Promise.all([
          fetch("/api/services?all=true", { cache: "no-store" }),
          fetch("/api/projects?all=true", { cache: "no-store" }),
          fetch("/api/careers", { cache: "no-store" }),
          fetch("/api/faqs", { cache: "no-store" }),
          fetch("/api/submissions", { cache: "no-store" }),
        ]);

      if (servicesRes.ok) {
        const data = await servicesRes.json();
        setServices(Array.isArray(data) ? data : []);
      }
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(Array.isArray(data) ? data : []);
      }
      if (careersRes.ok) {
        const data = await careersRes.json();
        setCareers(Array.isArray(data) ? data : []);
      }
      if (faqsRes.ok) {
        const data = await faqsRes.json();
        setFaqs(Array.isArray(data) ? data : []);
      }
      if (submissionsRes.ok) {
        const data = await submissionsRes.json();
        setSubmissions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching dashboard analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) void fetchDashboardData();
    });
    return () => {
      ignore = true;
    };
  }, [fetchDashboardData]);

  // Derived metrics
  const activeServicesCount = services.filter((s) => !s.archived).length;
  const archivedServicesCount = services.filter((s) => s.archived).length;

  const activeProjectsCount = projects.filter((p) => !p.archived).length;
  const archivedProjectsCount = projects.filter((p) => p.archived).length;

  const seaJobsCount = careers.filter((c) => c.category === "sea").length;
  const shoreJobsCount = careers.filter((c) => c.category === "shore").length;

  // Compute Category Breakdown for Chart
  const categoryCounts = submissions.reduce(
    (acc, sub) => {
      const q = (sub.query || "General").toUpperCase();
      if (q.includes("FLEET")) acc.fleet += 1;
      else if (q.includes("CREW")) acc.crew += 1;
      else if (q.includes("TRAIN")) acc.training += 1;
      else if (q.includes("DIGITAL")) acc.digital += 1;
      else acc.general += 1;
      return acc;
    },
    { fleet: 0, crew: 0, training: 0, digital: 0, general: 0 }
  );

  const totalInquiries = submissions.length || 1;
  const categoriesData = [
    { label: "General Inquiries", count: categoryCounts.general, color: "bg-[#005978]" },
    { label: "Fleet Management", count: categoryCounts.fleet, color: "bg-[#007BA7]" },
    { label: "Crewing & Manning", count: categoryCounts.crew, color: "bg-amber-600" },
    { label: "Maritime Training", count: categoryCounts.training, color: "bg-indigo-600" },
    { label: "Digital Solutions", count: categoryCounts.digital, color: "bg-purple-600" },
  ];

  const maxCategoryCount = Math.max(...categoriesData.map((c) => c.count), 1);

  return (
    <div className="p-3 md:p-6 space-y-6">

      {/* ── Executive Welcome Banner ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002B49] via-[#004B75] to-[#AD1D41] text-white p-6 shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-center sm:text-left flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-1">
            Executive Overview & Operations Control
          </div>
          <h1 className="text-center sm:text-left font-oswald text-2xl md:text-3xl font-bold tracking-wide uppercase">
            PMV Maritime Management Hub
          </h1>
        </div>
        <div className="flex w-full sm:w-fit flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="w-full sm:w-fit px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all flex justify-center sm:justify-start items-center gap-2"
          >
            <span>Live Site</span>
            <LuExternalLink className="text-sm" />
          </Link>
          {canViewSubmissions && (
            <Link
              href="/admin/contact"
              className="w-full sm:w-fit px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-xs font-bold uppercase tracking-wider transition-all flex justify-center sm:justify-start items-center gap-2 shadow-sm"
            >
              <LuMail className="text-sm" />
              <span>Inbox ({submissions.length})</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── 1. Top KPI Stat Cards Grid (4 Permission-Controlled Cards) ────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Services Engine */}
        <div className="bg-gradient-to-br from-[#003853] via-[#005978] to-[#007BA7] text-white p-4 pb-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group border border-white/15">
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-200">
                Services Engine
              </span>
              <div className="w-9 h-9 bg-white/15 border border-white/20 text-white flex items-center justify-center text-lg group-hover:bg-white group-hover:text-[#005978] transition-colors duration-200">
                <LuShip />
              </div>
            </div>

            <Link
              href="/admin/services"
              className="font-oswald text-5xl sm:text-6xl font-black text-white hover:text-cyan-200 transition-colors inline-block tracking-tight -mt-2"
            >
              {loading ? "..." : services.length}
            </Link>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 border border-white/20 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {activeServicesCount} Active Services
              </span>
              {archivedServicesCount > 0 && (
                <span className="text-xs text-cyan-200/80 font-semibold">
                  {archivedServicesCount} Archived
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/15 flex items-center justify-between z-10">
            <Link
              href="/admin/services"
              className="text-xs font-extrabold uppercase tracking-wider text-cyan-100 hover:text-white flex items-center gap-1 group/btn"
            >
              <span>Manage</span>
              <LuArrowUpRight className="text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
            {canCreateServices && (
              <Link
                href="/admin/services/create"
                className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-white text-[#005978] hover:bg-cyan-50 transition-colors flex items-center gap-1"
              >
                <LuPlus className="text-sm" /> New
              </Link>
            )}
          </div>
        </div>

        {/* Card 2: Projects Hub */}
        <div className="bg-gradient-to-br from-[#4a0817] via-[#85132f] to-[#AD1D41] text-white p-4 pb-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group border border-white/15">
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-rose-200">
                Projects Hub
              </span>
              <div className="w-9 h-9 bg-white/15 border border-white/20 text-white flex items-center justify-center text-lg group-hover:bg-white group-hover:text-[#AD1D41] transition-colors duration-200">
                <LuFolderOpen />
              </div>
            </div>

            <Link
              href="/admin/projects"
              className="font-oswald text-5xl sm:text-6xl font-black text-white hover:text-rose-200 transition-colors inline-block tracking-tight -mt-2"
            >
              {loading ? "..." : projects.length}
            </Link>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 border border-white/20 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                {activeProjectsCount} Published
              </span>
              {archivedProjectsCount > 0 && (
                <span className="text-xs text-rose-200/80 font-semibold">
                  {archivedProjectsCount} Archived
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/15 flex items-center justify-between z-10">
            <Link
              href="/admin/projects"
              className="text-xs font-extrabold uppercase tracking-wider text-rose-100 hover:text-white flex items-center gap-1 group/btn"
            >
              <span>Manage</span>
              <LuArrowUpRight className="text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
            {canCreateProjects && (
              <Link
                href="/admin/projects/create"
                className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-white text-[#AD1D41] hover:bg-rose-50 transition-colors flex items-center gap-1"
              >
                <LuPlus className="text-sm" /> New
              </Link>
            )}
          </div>
        </div>

        {/* Card 3: Talent Pipeline */}
        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white p-4 pb-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group border border-white/15">
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                Talent Pipeline
              </span>
              <div className="w-9 h-9 bg-white/15 border border-white/20 text-white flex items-center justify-center text-lg group-hover:bg-white group-hover:text-slate-900 transition-colors duration-200">
                <LuBriefcaseBusiness />
              </div>
            </div>

            <Link
              href="/admin/careers"
              className="font-oswald text-5xl sm:text-6xl font-black text-white hover:text-slate-200 transition-colors inline-block tracking-tight -mt-2"
            >
              {loading ? "..." : careers.length}
            </Link>

            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 border border-white/20 text-xs font-bold text-white">
                Sea: {seaJobsCount}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/15 border border-white/20 text-xs font-bold text-white">
                Shore: {shoreJobsCount}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/15 flex items-center justify-between z-10">
            <Link
              href="/admin/careers"
              className="text-xs font-extrabold uppercase tracking-wider text-slate-200 hover:text-white flex items-center gap-1 group/btn"
            >
              <span>Manage</span>
              <LuArrowUpRight className="text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
            {canCreateCareers && (
              <Link
                href="/admin/careers"
                className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-white text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                <LuPlus className="text-sm" /> Add Job
              </Link>
            )}
          </div>
        </div>

        {/* Card 4: Knowledge Base */}
        <div className="bg-gradient-to-br from-[#044e54] via-[#0d6e6e] to-[#0f766e] text-white p-4 pb-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group border border-white/15">
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-teal-200">
                Knowledge Base
              </span>
              <div className="w-9 h-9 bg-white/15 border border-white/20 text-white flex items-center justify-center text-lg group-hover:bg-white group-hover:text-[#0f766e] transition-colors duration-200">
                <LuMessageCircleQuestion />
              </div>
            </div>

            <Link
              href="/admin/faqs"
              className="font-oswald text-5xl sm:text-6xl font-black text-white hover:text-teal-200 transition-colors inline-block tracking-tight -mt-2"
            >
              {loading ? "..." : faqs.length}
            </Link>

            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 border border-white/20 text-xs font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-teal-300"></span>
                {faqs.length} Live FAQs
              </span>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/15 flex items-center justify-between z-10">
            <Link
              href="/admin/faqs"
              className="text-xs font-extrabold uppercase tracking-wider text-teal-100 hover:text-white flex items-center gap-1 group/btn"
            >
              <span>Manage</span>
              <LuArrowUpRight className="text-sm group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>
            {canCreateFaqs && (
              <Link
                href="/admin/faqs"
                className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-white text-[#0f766e] hover:bg-teal-50 transition-colors flex items-center gap-1"
              >
                <LuPlus className="text-sm" /> Add FAQ
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── 2. Form Submissions Section (Gated by Forms/Submissions Permission) ───────── */}
      {canViewSubmissions && (
        <div className="space-y-6">

          {/* Table: Recent Customer & Vessel Inquiries Stream */}
          <div className="bg-white border border-gray-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center">
                  <LuMail className="text-lg" />
                </div>
                <div>
                  <h2 className="font-oswald text-lg font-bold text-secondary-dark uppercase tracking-wider">
                    Recent Customer & Vessel Inquiries
                  </h2>
                </div>
              </div>

              <Link
                href="/admin/contact"
                className="px-3.5 py-1.5 bg-secondary hover:bg-secondary-dark text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <span>Full Inbox</span>
                <LuArrowUpRight className="text-sm" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-400 text-xs animate-pulse">
                Loading inquiries stream...
              </div>
            ) : submissions.length === 0 ? (
              <div className="py-12 border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                <LuMail className="text-3xl text-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">No Inquiries Found</p>
                <p className="text-xs text-gray-400 mt-0.5">There are no contact form submissions available at this time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-gray-200 text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Message Snippet</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {submissions.slice(0, 6).map((sub) => {
                      const queryType = (sub.query || "General").toUpperCase();
                      const initial = (sub.fullName || "C").charAt(0).toUpperCase();

                      let tagStyle = "bg-slate-100 text-slate-700 border-slate-200";
                      if (queryType.includes("FLEET")) {
                        tagStyle = "bg-sky-50 text-[#005978] border-sky-200";
                      } else if (queryType.includes("CREW")) {
                        tagStyle = "bg-amber-50 text-amber-800 border-amber-200";
                      } else if (queryType.includes("TRAIN")) {
                        tagStyle = "bg-indigo-50 text-indigo-800 border-indigo-200";
                      } else if (queryType.includes("DIGITAL")) {
                        tagStyle = "bg-purple-50 text-purple-800 border-purple-200";
                      }

                      return (
                        <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div>
                                <h4 className="font-bold text-gray-900 leading-tight text-xs">{sub.fullName}</h4>
                                <span className="text-[10px] text-gray-400 block">{sub.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 border text-[10px] font-black uppercase tracking-wider inline-block ${tagStyle}`}>
                              {sub.query || "General"}
                            </span>
                          </td>

                          <td className="py-3 px-3 max-w-md">
                            <p className="text-gray-600 line-clamp-1 text-[12px] font-medium italic">
                              {sub.message}
                            </p>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap text-gray-400 font-semibold text-[11px]">
                            <div className="flex items-center gap-1">
                              <LuClock className="text-gray-400 text-xs" />
                              <span>{sub.dateTime || "Recent"}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Analytics Chart: Customer Inquiry Categories Breakdown (Interactive Bar Chart) */}
          <div className="bg-white border border-gray-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
              <div className="flex items-center gap-2">
                <LuChartBar className="text-secondary text-xl" />
                <div>
                  <h3 className="font-oswald text-base font-bold text-secondary-dark uppercase tracking-wider">
                    Inquiry Category Analytics & Distribution
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 border border-gray-200 text-xs font-bold">
                <button
                  onClick={() => setActiveChartTab("categories")}
                  className={`px-3 py-1 transition-all ${activeChartTab === "categories" ? "bg-white text-secondary shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setActiveChartTab("volume")}
                  className={`px-3 py-1 transition-all ${activeChartTab === "volume" ? "bg-white text-secondary shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Relative Volume
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {categoriesData.map((item, idx) => {
                const pct = Math.round((item.count / totalInquiries) * 100);
                const barWidthPct = Math.max(Math.round((item.count / maxCategoryCount) * 100), item.count > 0 ? 8 : 4);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-800 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 ${item.color}`}></span>
                        {item.label}
                      </span>
                      <span className="text-gray-600 font-mono">
                        {item.count} inquiries ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 border border-gray-200 overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${item.color}`}
                        style={{ width: `${barWidthPct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

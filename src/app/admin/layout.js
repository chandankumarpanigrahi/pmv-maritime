"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./style.module.css";
import LoginPage from "./LoginPage";
import AdminLoading from "./loading";
import {
  LuShieldAlert,
  LuCompass,
  LuLogOut,
  LuLock,
  LuEye,
  LuEyeOff,
  LuLayoutDashboard,
  LuShip,
  LuFolderOpen,
  LuMessageCircleQuestion,
  LuMail,
  LuSettings,
  LuBellDot,
  LuChevronRight,
  LuMenu,
  LuX,
  LuDatabase,
  LuCircleGauge,
  LuLayers,
  LuFileText,
} from "react-icons/lu";
import { TbLockPassword } from "react-icons/tb";

import logo from "../../../public/assets/images/logo.png";
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

const sliderImages = [image1, image2, image3];

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
const MAX_ATTEMPTS = 3;
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const AUTH_LOADER_DELAY = 100;
const DEFAULT_LAUNCH_PAGE = "/admin/dashboard";

// Navigation structure
const NAV_ITEMS = [
  {
    type: "item",
    key: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    type: "group",
    key: "cms",
    label: "CMS",
    icon: LuLayers,
    children: [
      { key: "services", label: "Services", href: "/admin/services", icon: LuShip },
      { key: "projects", label: "Projects", href: "/admin/projects", icon: LuFolderOpen },
      { key: "faqs", label: "FAQs", href: "/admin/faqs", icon: LuMessageCircleQuestion },
    ],
  },
  {
    type: "group",
    key: "forms",
    label: "Forms",
    icon: LuFileText,
    children: [
      { key: "contact", label: "Contact Us", href: "/admin/contact", icon: LuMail },
    ],
  },
  {
    type: "item",
    key: "notifications",
    label: "Notifications",
    href: "/admin/notifications",
    icon: LuBellDot,
  },
  {
    type: "group",
    key: "settings",
    label: "Settings",
    icon: LuSettings,
    children: [
      { key: "master", label: "Master", href: "/admin/master", icon: LuDatabase },
      { key: "session", label: "Session", href: "/admin/session", icon: LuCircleGauge },
      { key: "password", label: "Password", href: "/admin/password", icon: TbLockPassword },
    ],
  },
];

// Page titles for header
const PAGE_TITLES = {
  dashboard: "Dashboard",
  services: "Services",
  projects: "Projects",
  faqs: "FAQs",
  contact: "Contact Us",
  master: "Master Settings",
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

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

  // Sidebar states (Open by default on desktop)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Live clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setSliderIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Set initial sidebar state based on screen width
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  // Close mobile sidebar on route change & expand ONLY group containing current child route
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }

    // Find if the current pathname belongs to any group
    const activeGroupKeys = NAV_ITEMS.filter(
      (item) =>
        item.type === "group" &&
        item.children &&
        item.children.some((child) => child.href === pathname)
    ).map((item) => item.key);

    if (activeGroupKeys.length > 0) {
      setExpandedGroups(activeGroupKeys);
    } else {
      // Top-level pages like Dashboard start with all groups closed
      setExpandedGroups([]);
    }
  }, [pathname]);

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
    }, AUTH_LOADER_DELAY);
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
      if (typeof window !== "undefined") {
        setSidebarOpen(window.innerWidth >= 1024);
      }
      setAttempts(0);
      setLockoutTime(0);
      setIsCurrentlyLocked(false);
      setMinsLeft(0);
      localStorage.setItem(
        "pmv_admin_session",
        JSON.stringify({
          loggedIn: true,
          expiresAt: Date.now() + SESSION_DURATION,
        })
      );
      localStorage.removeItem("pmv_admin_attempts");
      localStorage.removeItem("pmv_admin_lockout_until");
      setUsernameInput("");
      setPasswordInput("");

      // Redirect to default launch page after successful login
      router.push(DEFAULT_LAUNCH_PAGE);
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
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setIsLoggedIn(false);
    setSidebarOpen(false);
    setShowLogoutModal(false);
    localStorage.removeItem("pmv_admin_session");
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) =>
      prev.includes(groupKey) ? prev.filter((k) => k !== groupKey) : [...prev, groupKey]
    );
  };

  // Determine active nav item from pathname
  const getActiveKey = () => {
    const segment = pathname.replace("/admin/", "").split("/")[0];
    return segment || "dashboard";
  };

  const activeKey = getActiveKey();

  // ========================
  // LOGIN SCREEN (UNAUTHENTICATED)
  // ========================
  if (!isCheckingAuth && !isLoggedIn) {
    return (
      <LoginPage
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isCurrentlyLocked={isCurrentlyLocked}
        minsLeft={minsLeft}
        loginError={loginError}
        handleLogin={handleLogin}
        attempts={attempts}
        maxAttempts={MAX_ATTEMPTS}
        sliderIndex={sliderIndex}
        setSliderIndex={setSliderIndex}
      />
    );
  }

  // ========================
  // WEB APP SHELL (WITH FLOATING LOADER OVERLAY)
  // ========================
  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      {/* Floating Loader Over Live Web App */}
      {isCheckingAuth && <AdminLoading />}

      {/* Mobile Overlay */}
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarVisible : styles.sidebarHidden}`}
      >
        {/* Logo Section */}
        <div className="p-5 pb-4 border-b bg-white border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logo} width={45} height={45} alt="PMV Logo" />
            <div className="flex flex-col gap-3">
              <h1 className="font-oswald text-[22px] font-bold text-secondary tracking-wide leading-5">
                PMV Maritime Solutions<span className="text-primary">.</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] leading-0">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <LuX className="text-lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 relative">
          <div className={`${styles.bachgroundAnchor} absolute inset-0 opacity-3`}></div>
          {NAV_ITEMS.map((item) => {
            if (item.type === "item") {
              const isActive = activeKey === item.key;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                >
                  <item.icon className="text-base flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            if (item.type === "group") {
              const isExpanded = expandedGroups.includes(item.key);
              const GroupIcon = item.icon;

              return (
                <div key={item.key}>
                  <button
                    onClick={() => toggleGroup(item.key)}
                    className={`${styles.groupLabel} w-full text-left`}
                  >
                    <div className="flex items-center gap-2.5">
                      {GroupIcon && <GroupIcon className="text-base flex-shrink-0" />}
                      <span>{item.label}</span>
                    </div>
                    <LuChevronRight
                      className={`${styles.groupChevron} ${isExpanded ? styles.groupChevronOpen : ""}`}
                    />
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-250 ease-in-out bg-white/5"
                    style={{
                      maxHeight: isExpanded ? `${item.children.length * 50 + 16}px` : "0px",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    {item.children.map((child) => {
                      const isChildActive = activeKey === child.key;
                      return (
                        <Link
                          key={child.key}
                          href={child.href}
                          className={`${styles.navSubItem} ${isChildActive ? styles.navSubItemActive : ""}`}
                        >
                          <child.icon className="text-lg pb-1 flex-shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </nav>

        {/* Logout */}
        <div className="border-t bg-white hover:bg-red-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-md font-bold uppercase tracking-widest text-red-600 hover:text-white transition-all cursor-pointer"
          >
            <LuLogOut className="text-md" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className={`${styles.content} ${sidebarOpen ? "" : styles.contentFull}`}>
        {/* Common Page Header */}
        <div className="bg-white border-b border-gray-200 px-3 md:px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 bg-slate-50 border border-gray-200 hover:border-secondary text-secondary hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center rounded-none"
              title={sidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
              aria-label="Toggle navigation sidebar"
            >
              <LuMenu className="text-xl" />
            </button>
            <h1 className="font-oswald text-xl md:text-2xl font-bold text-secondary tracking-wide">
              {PAGE_TITLES[activeKey] || "Dashboard"}
            </h1>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="text-lg font-bold text-primary">
              {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
            </span>
            <span className="text-[11px] font-semibold text-gray-400 uppercase leading-0 tracking-wider">
              {currentTime.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
        {children}
      </main>

      {/* Custom Designed Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 md:p-8 relative">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 border border-red-100 text-primary flex items-center justify-center flex-shrink-0">
                <LuShieldAlert className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-oswald text-xl font-bold text-secondary uppercase tracking-wide">
                  Logout Confirmation<span className="text-primary">.</span>
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1 leading-relaxed">
                  Are you sure you want to log out from the PMV Admin Portal?
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
              >
                <LuLogOut className="text-sm" />
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

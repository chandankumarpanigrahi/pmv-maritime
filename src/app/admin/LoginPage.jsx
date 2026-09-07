"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./login.module.css";

import {
  LuShieldAlert,
  LuLock,
  LuEye,
  LuEyeOff,
  LuMail,
  LuArrowLeft,
  LuRefreshCw,
  LuCircleCheck,
  LuKeyRound,
} from "react-icons/lu";

import logo from "../../../public/assets/images/logo.png";
import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";

const sliderImages = [image1, image2, image3];

export default function LoginPage({
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  showPassword,
  setShowPassword,
  isCurrentlyLocked,
  minsLeft,
  loginError,
  handleLogin,
  sliderIndex,
  setSliderIndex,
}) {
  // Reset Flow States: 0 = Normal Login, 1 = Request OTP, 2 = Verify OTP & Set Password
  const [resetStep, setResetStep] = useState(0);
  const [resetEmail, setResetEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Auto-focus first OTP digit field when entering Step 2
  useEffect(() => {
    if (resetStep === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 120);
    }
  }, [resetStep]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // 6-Digit OTP Handlers
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, "");
    const newDigits = [...otpDigits];

    // If multiple digits pasted or autofilled into single field
    if (cleaned.length > 1) {
      const slice = cleaned.slice(0, 6);
      for (let i = 0; i < slice.length && index + i < 6; i++) {
        newDigits[index + i] = slice[i];
      }
      setOtpDigits(newDigits);
      const nextIdx = Math.min(index + slice.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        // If current box is empty, clear previous box and jump back
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = "";
        setOtpDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIdx]?.focus();
  };

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetEmail.trim()) {
      setResetError("Please enter your registered email address.");
      return;
    }

    setIsSubmittingReset(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to send verification code.");
        if (data.retryAfterSeconds) {
          setCooldown(data.retryAfterSeconds);
        }
      } else {
        setMaskedEmail(data.maskedEmail || resetEmail);
        // Only set resetSuccess banner if already on Step 2 (i.e. clicked "Resend Code").
        // On initial step transition from Step 1 to Step 2, the Step 2 subtitle already
        // states "Verification code sent to <email>. Valid for 10 minutes."
        // Keeping resetSuccess empty here prevents showing the duplicate email sent banner!
        if (resetStep === 2) {
          setResetSuccess("A new 6-digit verification code has been dispatched.");
        } else {
          setResetSuccess("");
        }
        setCooldown(60);
        setResetStep(2);
      }
    } catch (err) {
      setResetError("Network error. Please check your internet connection.");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  // Handle Step 2: Verify OTP & Reset Password
  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    const otpCode = otpDigits.join("").trim();
    if (!otpCode || otpCode.length !== 6) {
      setResetError("Please enter all 6 digits of the verification code.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setResetError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match. Please re-check.");
      return;
    }

    setIsSubmittingReset(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resetEmail.trim(),
          otp: otpCode,
          newPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResetError(data.error || "Failed to reset password.");
      } else {
        setResetSuccess(data.message || "Password reset successfully!");
        // Update login email field with reset email and return to login screen after 1.8s
        setUsernameInput(resetEmail.trim());
        setPasswordInput("");
        setTimeout(() => {
          setResetStep(0);
          setOtpDigits(["", "", "", "", "", ""]);
          setNewPassword("");
          setConfirmPassword("");
          setResetSuccess("");
          setResetError("");
        }, 1800);
      }
    } catch (err) {
      setResetError("Network error. Please check your internet connection.");
    } finally {
      setIsSubmittingReset(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      {/* Decorative ambient background glows */}
      <div className={styles.ambientGlow1} />
      <div className={styles.ambientGlow2} />
      <div className={styles.patternOverlay} />

      {/* Main Login Card */}
      <div className={styles.loginCard}>
        {/* Left Column: Image Slider */}
        <div className={styles.sliderCol}>
          {sliderImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`login-slider-image-${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                idx === sliderIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Soft overlay */}
          <div className={styles.sliderOverlay} />

          {/* Slider Navigation Dots */}
          <div className="absolute bottom-6 right-6 z-20 rounded-full flex items-center gap-1.5 bg-white/40 backdrop-blur-md p-1.5 border border-white/10">
            {sliderImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSliderIndex(idx)}
                className={`transition-all rounded-full duration-300 cursor-pointer focus:outline-none ${
                  idx === sliderIndex
                    ? "w-8 h-3 bg-primary"
                    : "w-3 h-3 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className={`${styles.formCol} ${styles.adminbg}`}>
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <Image src={logo} width={65} height={65} alt="Logo" className="mb-2" />
            <h2 className="font-oswald text-2xl md:text-3xl font-bold text-center tracking-wider text-secondary">
              PMV <span className="text-secondary-dark">Maritime</span> Solutions<span className="text-primary">.</span>
            </h2>
            <p className="text-[14px] md:text-[15px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
              {resetStep === 0 ? "Admin Portal Login" : "Account Recovery Portal"}
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 0: MAIN SIGN IN FORM
             ══════════════════════════════════════════════════════════════════════ */}
          {resetStep === 0 && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <LuShieldAlert className="text-base flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Email Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. admin@pmvmaritime.com"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={isCurrentlyLocked}
                  className={styles.inputField}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(1);
                      setResetEmail(usernameInput || "");
                      setResetError("");
                      setResetSuccess("");
                    }}
                    className="text-[11px] font-bold text-secondary hover:text-secondary-dark hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isCurrentlyLocked}
                    className={`${styles.inputField} pr-10`}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isCurrentlyLocked}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-40"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <LuEyeOff className="text-base" /> : <LuEye className="text-base" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCurrentlyLocked}
                className={`${styles.submitBtn} flex items-center justify-center gap-2 mt-2`}
              >
                {isCurrentlyLocked ? (
                  <>
                    <LuLock className="text-sm animate-pulse" /> Locked out ({minsLeft}m left)
                  </>
                ) : (
                  <>Sign In</>
                )}
              </button>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 1: FORGOT PASSWORD - STEP 1 (REQUEST OTP)
             ══════════════════════════════════════════════════════════════════════ */}
          {resetStep === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-in fade-in duration-200">
              <div className="text-center pb-1">
                <h3 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <LuKeyRound className="text-primary text-base" /> Reset Account Password
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your registered email address to receive a secure 6-digit verification code.
                </p>
              </div>

              {resetError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
                  <LuShieldAlert className="text-base flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <LuCircleCheck className="text-base flex-shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="e.g. name@pmvmaritime.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    disabled={isSubmittingReset}
                    className={styles.inputField}
                    required
                    autoFocus
                  />
                  <LuMail className="absolute right-3 top-3.5 text-gray-400 text-base pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReset || cooldown > 0}
                className={`${styles.submitBtn} flex items-center justify-center gap-2`}
              >
                {isSubmittingReset ? (
                  <>
                    <LuRefreshCw className="text-sm animate-spin" /> Sending Code...
                  </>
                ) : cooldown > 0 ? (
                  `Wait (${cooldown}s)`
                ) : (
                  <>Send Verification Code</>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResetStep(0);
                    setResetError("");
                    setResetSuccess("");
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LuArrowLeft className="text-sm" /> Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              VIEW 2: FORGOT PASSWORD - STEP 2 (VERIFY OTP & ENTER NEW PASSWORD)
             ══════════════════════════════════════════════════════════════════════ */}
          {resetStep === 2 && (
            <form onSubmit={handleConfirmReset} className="space-y-3.5 animate-in fade-in duration-200">
              <div className="text-center pb-1">
                <h3 className="font-oswald text-lg font-bold text-secondary uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <LuKeyRound className="text-primary text-base" /> Set New Password
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Verification code sent to <strong className="text-gray-700">{maskedEmail || resetEmail}</strong>. Valid for 10 minutes.
                </p>
              </div>

              {resetError && (
                <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
                  <LuShieldAlert className="text-base flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <LuCircleCheck className="text-base flex-shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
                  6-Digit Verification Code
                </label>
                <div className={styles.otpContainer} onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onFocus={(e) => e.target.select()}
                      disabled={isSubmittingReset}
                      className={styles.otpBox}
                      aria-label={`Digit ${idx + 1}`}
                      required
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isSubmittingReset}
                    className={`${styles.inputField} pr-10`}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title={showNewPass ? "Hide Password" : "Show Password"}
                  >
                    {showNewPass ? <LuEyeOff className="text-base" /> : <LuEye className="text-base" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmittingReset}
                    className={`${styles.inputField} pr-10`}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title={showConfirmPass ? "Hide Password" : "Show Password"}
                  >
                    {showConfirmPass ? <LuEyeOff className="text-base" /> : <LuEye className="text-base" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingReset}
                className={`${styles.submitBtn} flex items-center justify-center gap-2 mt-2`}
              >
                {isSubmittingReset ? (
                  <>
                    <LuRefreshCw className="text-sm animate-spin" /> Verifying & Updating...
                  </>
                ) : (
                  <>Confirm & Reset Password</>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={cooldown > 0 || isSubmittingReset}
                  className="font-semibold text-secondary hover:text-secondary-dark disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetStep(0);
                    setResetError("");
                    setResetSuccess("");
                    setOtpDigits(["", "", "", "", "", ""]);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="font-semibold text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <LuArrowLeft className="text-xs" /> Back to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

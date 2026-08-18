"use client";

import React from "react";
import Image from "next/image";
import styles from "./login.module.css";

import {
  LuShieldAlert,
  LuCompass,
  LuLock,
  LuEye,
  LuEyeOff,
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
              className={`object-cover transition-opacity duration-1000 ease-in-out ${idx === sliderIndex ? "opacity-100" : "opacity-0"
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
                className={`transition-all rounded-full duration-300 cursor-pointer focus:outline-none ${idx === sliderIndex
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
          <div className="flex flex-col items-center mb-8">
            <Image src={logo} width={70} height={70} alt="Logo" className="mb-2" />
            <h2 className="font-oswald text-3xl md:text-4xl font-bold text-center tracking-wider text-secondary">
              PMV <span className="text-secondary-dark">Maritime</span> Solutions<span className="text-primary">.</span>
            </h2>
            <p className="text-[16px] md:text-lg text-gray-400 font-bold uppercase tracking-widest mt-1">
              Admin Portal Login
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold flex items-center gap-2">
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
                className={styles.inputField}
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
                  className={styles.inputField}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
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
              className={`${styles.submitBtn} flex items-center justify-center gap-2`}
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

        </div>

      </div>
    </div>
  );
}

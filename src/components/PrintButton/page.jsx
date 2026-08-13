"use client";

import React from "react";
import { LuPrinter } from "react-icons/lu";

export default function PrintButton({
  label = "",
  className = "",
  variant = "primary",
}) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const baseStyles =
    "no-print inline-flex items-center px-2 py-2 relative z-2 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-xs hover:shadow cursor-pointer border";

  const variantStyles =
    variant === "secondary"
      ? "bg-white hover:bg-slate-50 text-secondary border-gray-300 hover:border-secondary"
      : "bg-primary hover:bg-primary-hover text-white border-primary";

  return (
    <button
      onClick={handlePrint}
      type="button"
      className={`${baseStyles} ${variantStyles} ${className}`}
      title="Print page contents"
      aria-label="Print page contents"
    >
      <LuPrinter className="text-base md:text-lg" />
      <span className="">{label}</span>
    </button>
  );
}

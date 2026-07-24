"use client";

import React, { useState } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import { LuPhone, LuMail, LuMapPin, LuUsers, LuShieldCheck } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";

export default function ContactUs(props) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    query: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.query || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }

    setIsSubmitting(true); // <-- Set to true here

    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, "0");

      const payload = {
        ...formData,
        dateTime: `${day}-${month}-${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`
      };

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [payload],
        }),
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Thank you! Your message has been sent successfully." });
        setFormData({ fullName: "", email: "", query: "", message: "" }); // reset form

        // Hide success message after 3 seconds
        setTimeout(() => {
          setStatus({ type: "", message: "" });
        }, 3000);
      } else {
        const errorData = await res.json();
        setStatus({ type: "error", message: "Error: " + (errorData?.error || res.statusText) });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Error: " + error.message });
    } finally {
      setIsSubmitting(false); // <-- Set back to false here
    }
  };


  return (
    <div className="container max-w-7xl mx-auto">
      <div className="w-full flex flex-col md:flex-row items-stretch border border-t-0 border-gray-200 bg-white shadow-xs overflow-hidden">

        {/* Left Column: Contact Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-between bg-white">
          <div>
            <SubHeading title="Contact Us" className="mb-4" />
            <h2 className="font-oswald text-3xl md:text-4xl lg:text-5xl font-bold text-secondary leading-tight mt-6">
              Let&apos;s <span className="text-secondary-dark font-bold">Connect</span> and<br />Create <span className="text-secondary-dark font-bold">Impact Together</span><span className="text-primary">.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium mt-4 leading-relaxed max-w-[90%]">
              From complex operations to innovative solutions, explore how PMV Maritime creates value across the globe.
            </p>

            {/* Contact Information Cards */}
            <div className="mt-8 md:mt-10 flex flex-col gap-5">
              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <LuPhone className="text-xl" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Call Us</span>
                  <a href="tel:+971505342726" className="text-base text-gray-900 font-bold hover:text-primary transition-colors">
                    +97 15053 42726
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <LuMail className="text-xl" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Email Us</span>
                  <a href="mailto:info@pmvmaritime.com" className="text-base text-gray-900 font-bold hover:text-primary transition-colors">
                    info@pmvmaritime.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  <LuMapPin className="text-xl" />
                </div>
                <div>
                  <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider">Visit Us</span>
                  <a className="text-base text-gray-900 font-bold hover:text-primary transition-colors" href="https://maps.app.goo.gl/sjK7qhMfaVj9Rvm66" target="_blank">
                    IFZA Properties, Dubai Silicon Oasis, UAE
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Help Card */}
          <Link
            href="/contact"
            className={`mt-12 p-4 md:p-5 bg-blue-50 border border-blue-100 hover:border-blue-200 transition-all duration-300 flex items-center justify-between group ${props.className || ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center border border-blue-50 shadow-xs flex-shrink-0">
                <LuUsers className="text-lg" />
              </div>
              <div>
                <h4 className="text-[14px] md:text-[15px] font-bold text-secondary-dark">
                  Looking for more ways to reach us?
                </h4>
                <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-0.5">
                  Visit our Contact Page for department directories and more details.
                </p>
              </div>
            </div>
            <FaArrowRight className="text-primary text-base transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0 ml-4" />
          </Link>
        </div>

        {/* Right Column: Contact Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 bg-slate-50/50 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Name Field */}
            <div>
              <label htmlFor="fullName" className="text-[13px] md:text-sm font-bold text-gray-800 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-3 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="text-[13px] md:text-sm font-bold text-gray-800 mb-2 block">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="jane@pmvmaritime.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-3 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            {/* Query Field */}
            <div>
              <label htmlFor="query" className="text-[13px] md:text-sm font-bold text-gray-800 mb-2 block">
                Select your Query
              </label>
              <div className="relative">
                <select
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-3 text-sm transition-all text-gray-900 font-medium appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your Query</option>
                  <option value="general">General Inquiry</option>
                  <option value="consultancy">Technical Consultancy</option>
                  <option value="training">Maritime Training</option>
                  <option value="fleet">Fleet Management</option>
                  <option value="crew">Crew Management</option>
                  <option value="digital">Digital Solutions</option>
                  <option value="others">Others</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="text-[13px] md:text-sm font-bold text-gray-800 mb-2 block">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Type your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none px-4 py-3 text-sm transition-all text-gray-900 placeholder-gray-400 font-medium resize-none h-32"
              />
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`p-3 text-xs font-semibold ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {status.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer disabled:bg-primary/70 disabled:pointer-events-none shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>

            {/* Privacy Policy Disclaimer */}
            <div className="flex items-center justify-center text-gray-500 mt-2">
              <LuShieldCheck className="text-secondary text-base flex-shrink-0" />
              <span className="text-[11px] md:text-xs text-gray-500 font-medium ml-1.5 leading-tight text-center">
                We respect your privacy. Your information will only be used to respond to your inquiry.
              </span>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

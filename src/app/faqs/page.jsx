"use client";

import React, { useState, useEffect } from "react";
import SubBanner from "@/components/Sub Banner/page";
import SubHeading from "@/design/sub-heading/page";
import ContactUs from "@/components/Contact Us/page";
import Image from "next/image";
import {
  LuPlus,
  LuMinus,
  LuMessageCircleQuestion,
  LuRotateCw,
} from "react-icons/lu";

import bannerBg from "../../../public/assets/images/map-bg.png";

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await fetch("/api/faqs", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load FAQs.");
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
          setExpandedId(data[0]._id || 0);
        } else {
          setFaqs([]);
        }
      } catch (err) {
        setError(err.message || "Could not fetch FAQs.");
      } finally {
        setLoading(false);
      }
    }

    fetchFaqs();
  }, []);

  const toggleAccordion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <SubBanner
        Heading="Frequently Asked Questions"
        breadcrumbItems={[{ label: "FAQs", href: "/faqs" }]}
      />

      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 top-0"
        />

        {/* Header Section */}
        <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
          <div className="flex-col md:flex-row py-8 px-4 md:px-8 overflow-hidden">
            <div className="flex flex-col w-full md:w-7/12">
              <SubHeading title="Knowledge Base & Support" className="mb-4 md:mb-6" />
              <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
                Maritime Insights <span className="text-secondary-dark">& Answers</span>
                <span className="text-primary">.</span>
                <br />
                Clear Solutions for <span className="text-secondary-dark">Complex Operations</span>
                <span className="text-primary">.</span>
              </h1>

              <p className="text-sm md:text-[15px] max-w-full md:max-w-[80%] text-gray-600 font-medium">
                Find authoritative answers to common questions about PMV Maritime Solutions&apos;s port infrastructure, fleet technical management, maritime consultancy, shipbuilding, digitisation, and regulatory compliance solutions.
              </p>
            </div>
            <div className="w-full md:w-5/12 hidden flex-col mt-6 md:mt-0"></div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto bg-white border border-gray-200 border-t-0 items-stretch relative overflow-hidden p-4 md:p-10 min-h-[300px]">
        {loading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <LuRotateCw className="text-3xl text-secondary animate-spin" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
              Loading FAQs...
            </span>
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-12">
            <p className="text-sm font-semibold text-red-500">{error}</p>
          </div>
        ) : faqs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-100 border border-gray-200 flex items-center justify-center mx-auto mb-3">
              <LuMessageCircleQuestion className="text-2xl text-gray-300" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              No FAQs Available Right Now
            </p>
          </div>
        ) : (
          /* Dynamic Accordion List */
          <div className="w-full mx-auto flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const faqKey = faq._id || idx;
              const isOpen = expandedId === faqKey;

              return (
                <div
                  key={faqKey}
                  className={`border transition-all duration-200 rounded-none overflow-hidden ${
                    isOpen ? "border-primary" : "border-gray-200/80 hover:border-secondary"
                  }`}
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(faqKey)}
                    className={`w-full text-left p-3 md:p-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none group ${
                      isOpen ? "bg-primary/4" : "bg-white"
                    }`}
                    aria-expanded={isOpen}
                  >
                    <h3
                      className={`text-md md:text-lg font-semibold group-hover:text-primary transition-colors ${
                        isOpen ? "text-primary" : "text-gray-800"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    {/* Plus/Minus Icon Indicator */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center border transition-colors flex-shrink-0 rounded-none ${
                        isOpen
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-50 text-secondary border-gray-300 group-hover:border-primary group-hover:text-primary"
                      }`}
                    >
                      {isOpen ? <LuMinus className="text-lg" /> : <LuPlus className="text-lg" />}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-4 pb-4 md:px-6 md:pb-5 pt-0 border-t border-gray-100 bg-white">
                      <p className="text-sm md:text-[15px] text-gray-500 font-medium leading-relaxed mt-4 whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ContactUs />
    </>
  );
}

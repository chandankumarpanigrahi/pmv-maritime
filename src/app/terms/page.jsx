"use client";

import React from "react";
import SubBanner from "@/components/Sub Banner/page";
import ContactUs from "@/components/Contact Us/page";
import Image from "next/image";
import LegalContent from "@/components/LegalContent/page";
import PrintButton from "@/components/PrintButton/page";

import bannerBg from "../../../public/assets/images/map-bg.png";

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      {
        type: "paragraph",
        text: "By accessing this website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions, as well as our Privacy Policy.",
      },
    ],
  },
  {
    title: "2. Use of the Website",
    content: [
      {
        type: "paragraph",
        text: "You agree to use this website only for lawful purposes and in a manner that does not infringe upon the rights of others or restrict their use of the website. You must not misuse the website by introducing malicious software, attempting unauthorized access, or engaging in activities that could damage or disrupt its functionality.",
      },
    ],
  },
  {
    title: "3. Intellectual Property",
    content: [
      {
        type: "paragraph",
        text: "All content on this website, including text, graphics, logos, images, icons, designs, documents, and software, is the property of PMV Maritime Solutions Limited or its licensors and is protected by applicable intellectual property laws. Unauthorized reproduction, modification, distribution, or commercial use is strictly prohibited without prior written permission.",
      },
    ],
  },
  {
    title: "4. Services Information",
    content: [
      {
        type: "paragraph",
        text: "The information provided on this website is for general informational purposes only. While we strive to ensure accuracy, PMV Maritime Solutions Limited does not guarantee that all information is complete, current, or free from errors. Service offerings may be modified or updated without prior notice.",
      },
    ],
  },
  {
    title: "5. User Submissions",
    content: [
      {
        type: "paragraph",
        text: "Any information submitted through contact forms, inquiry forms, or other communication channels must be accurate and lawful. By submitting information, you grant PMV Maritime Solutions Limited the right to use it solely for responding to your inquiry or providing requested services.",
      },
    ],
  },
  {
    title: "6. Third-Party Links",
    content: [
      {
        type: "paragraph",
        text: "This website may contain links to third-party websites for your convenience. PMV Maritime Solutions Limited does not endorse or accept responsibility for the content, policies, or practices of any third-party websites.",
      },
    ],
  },
  {
    title: "7. Limitation of Liability",
    content: [
      {
        type: "paragraph",
        text: "PMV Maritime Solutions Limited shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or inability to use this website, including any errors, interruptions, or loss of data.",
      },
    ],
  },
  {
    title: "8. Indemnification",
    content: [
      {
        type: "paragraph",
        text: "You agree to indemnify and hold harmless PMV Maritime Solutions Limited, its employees, directors, partners, and affiliates from any claims, liabilities, damages, or expenses resulting from your misuse of the website or violation of these Terms & Conditions.",
      },
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      {
        type: "paragraph",
        text: "These Terms & Conditions shall be governed by and interpreted in accordance with the applicable laws and regulations of the United Arab Emirates, without regard to conflict of law principles.",
      },
    ],
  },
  {
    title: "10. Changes to These Terms",
    content: [
      {
        type: "paragraph",
        text: "PMV Maritime Solutions Limited reserves the right to modify or update these Terms & Conditions at any time. Continued use of the website following any updates constitutes acceptance of the revised terms.",
      },
    ],
  },
  {
    title: "10. Contact Us",
    content: [
      {
        type: "paragraph",
        text: "If you have any questions regarding this Privacy Policy or how your personal information is handled, please contact us:",
      },
      {
        type: "contact",
        items: [
          { label: "PMV Maritime Solutions Limited" },
          { label: "Email:", value: "info@pmvmaritime.com" },
          { label: "Phone:", value: "+971 52353 62726" },
          { label: "Address:", value: "FZA Properties, Dubai Silicon Oasis, UAE" },
        ],
      },
    ],
  },
];

export default function Terms() {
  return (
    <>
      <div className="no-print">
        <SubBanner
          Heading="Terms & Conditions"
          breadcrumbItems={[{ label: "Terms & Conditions", href: "/terms" }]}
        />
      </div>

      <main className="printable-content">
        <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
          <Image
            src={bannerBg}
            alt="Banner Background"
            className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 top-0 no-print"
          />

          {/* Header Section */}
          <div className="w-full flex flex-col border border-t-0 border-gray-200 bg-[#f7f5f8]">
            <div className="flex flex-col md:flex-row py-8 px-4 md:px-8 overflow-hidden justify-between items-start md:items-center gap-4">
              <div className="flex flex-col w-full md:w-8/12">
                <h1 className="font-oswald text-2xl md:text-4xl text-secondary font-bold mb-3 md:mb-6">
                  Terms & <span className="text-secondary-dark">Conditions</span>
                  <span className="text-primary">.</span>
                </h1>

                <p className="text-sm md:text-[16px] max-w-full text-gray-600 font-medium">
                  Welcome to PMV Maritime Solutions Limited. By accessing or using this website, you agree to comply with and be bound by the following Terms & Conditions. If you do not agree with any part of these terms, please refrain from using our website.
                </p>
                <p className="text-sm md:text-[16px] max-w-full text-gray-600 font-medium mt-3">
                  Effective Date: <span className="text-primary font-semibold">20-Jan-2026</span>
                </p>
              </div>
              <div className="no-print shrink-0 self-start md:self-end mt-2 md:mt-0">
                <PrintButton />
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto bg-white border border-gray-200 border-t-0 items-stretch relative overflow-hidden p-4 md:p-10">
          <LegalContent sections={termsSections} />
        </div>
      </main>

      <div className="no-print">
        <ContactUs />
      </div>
    </>
  );
}


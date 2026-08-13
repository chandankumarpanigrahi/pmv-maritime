"use client";

import React from "react";
import SubBanner from "@/components/Sub Banner/page";
import ContactUs from "@/components/Contact Us/page";
import Image from "next/image";
import LegalContent from "@/components/LegalContent/page";
import PrintButton from "@/components/PrintButton/page";

import bannerBg from "../../../public/assets/images/map-bg.png";

const copyrightSections = [
  {
    id: "copyright-intro",
    title: "",
    content: [
      {
        type: "paragraph",
        text: "All content available on this website, including but not limited to text, images, graphics, photographs, logos, icons, videos, designs, documents, illustrations, software, and other materials, is the property of PMV Maritime Solutions Limited or is used with the appropriate authorization.",
      },
      {
        type: "paragraph",
        text: "The content of this website is protected by applicable copyright, intellectual property, and other relevant laws. No part of this website may be copied, reproduced, modified, distributed, republished, transmitted, displayed, or commercially exploited without prior written permission from PMV Maritime Solutions Limited.",
      },
      {
        type: "paragraph",
        text: "You may access and use the website for legitimate personal or business-related purposes, provided that you do not remove, alter, or obscure any copyright, trademark, or other proprietary notices.",
      },
      {
        type: "paragraph",
        text: "Any unauthorized use, reproduction, distribution, or modification of the website's content may violate applicable intellectual property laws and may result in legal action.",
      },
    ],
  },
  {
    title: "Trademarks",
    content: [
      {
        type: "paragraph",
        text: "The PMV Maritime Solutions Limited name, logo, branding, and other related marks are the property of PMV Maritime Solutions Limited unless otherwise stated. They may not be used, reproduced, or represented without prior written authorization.",
      },
    ],
  },
  {
    title: "Third-Party Content",
    content: [
      {
        type: "paragraph",
        text: "Any third-party trademarks, logos, images, or other intellectual property displayed on this website remain the property of their respective owners. Their appearance on this website does not necessarily imply endorsement or affiliation.",
      },
    ],
  },
  {
    title: "Contact Us",
    content: [
      {
        type: "paragraph",
        text: "For permissions, copyright inquiries, or requests to use any content from this website, please contact:",
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

export default function CopyRights() {
  return (
    <>
      <div className="no-print">
        <SubBanner
          Heading="Copyrights"
          breadcrumbItems={[{ label: "Copyrights", href: "/copyright" }]}
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
                  Copyrights
                  <span className="text-primary">.</span>
                </h1>

                <p className="text-sm md:text-[16px] max-w-full text-gray-600 font-medium">
                  © 2026 PMV Maritime Solutions Limited. All Rights Reserved.
                </p>
              </div>
              <div className="no-print shrink-0 self-start md:self-end mt-2 md:mt-0">
                <PrintButton />
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto bg-white border border-gray-200 border-t-0 items-stretch relative overflow-hidden p-4 md:p-10">
          <LegalContent sections={copyrightSections} />
        </div>
      </main>

      <div className="no-print">
        <ContactUs />
      </div>
    </>
  );
}


"use client";

import React from "react";
import SubBanner from "@/components/Sub Banner/page";
import ContactUs from "@/components/Contact Us/page";
import Image from "next/image";
import LegalContent from "@/components/LegalContent/page";
import PrintButton from "@/components/PrintButton/page";

import bannerBg from "../../../public/assets/images/map-bg.png";

const privacySections = [
  {
    title: "1. Information We Collect",
    content: [
      { type: "paragraph", text: "We may collect the following types of information:" },
      {
        type: "list",
        items: [
          "Personal information such as your name, email address, phone number, company name, and job title when you submit an inquiry or contact form.",
          "Information provided through recruitment or career applications.",
          "Technical information such as IP address, browser type, device information, operating system, and website usage data.",
          "Cookies and similar technologies that help improve website functionality and user experience.",
        ],
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      { type: "paragraph", text: "The information collected is used to:" },
      {
        type: "list",
        items: [
          "Respond to inquiries and service requests.",
          "Provide information about our maritime services and solutions.",
          "Process recruitment applications.",
          "Improve website functionality and user experience.",
          "Maintain website security and prevent unauthorized access.",
          "Comply with applicable legal and regulatory requirements.",
        ],
      },
    ],
  },
  {
    title: "3. Cookies and Tracking Technologies",
    content: [
      {
        type: "paragraph",
        text: "Our website may use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and improve our services. You may choose to disable cookies through your browser settings; however, some features of the website may not function properly.",
      },
    ],
  },
  {
    title: "4. Information Sharing",
    content: [
      {
        type: "paragraph",
        text: "PMV Maritime Solutions Limited does not sell, rent, or trade your personal information.",
      },
      { type: "paragraph", text: "We may share your information only:" },
      {
        type: "list",
        items: [
          "With trusted service providers assisting us in delivering our services.",
          "When required by applicable laws or legal authorities.",
          "To protect our legal rights, property, or the safety of our users and business operations.",
        ],
      },
    ],
  },
  {
    title: "5. Data Security",
    content: [
      {
        type: "paragraph",
        text: "We implement appropriate administrative, technical, and organizational security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. While we strive to use commercially acceptable means to safeguard your data, no method of electronic transmission or storage is completely secure.",
      },
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      {
        type: "paragraph",
        text: "We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.",
      },
    ],
  },
  {
    title: "7. Third-Party Websites",
    content: [
      {
        type: "paragraph",
        text: "Our website may contain links to third-party websites for your convenience. PMV Maritime Solutions Limited is not responsible for the privacy practices, content, or security of these external websites. We encourage users to review the privacy policies of any third-party websites they visit.",
      },
    ],
  },
  {
    title: "8. Your Rights",
    content: [
      {
        type: "paragraph",
        text: "Depending on your jurisdiction, you may have the right to:",
      },
      {
        type: "list",
        items: [
          "Request access to your personal information.",
          "Request correction of inaccurate or incomplete information.",
          "Request deletion of your personal data where legally applicable.",
          "Withdraw consent for data processing where permitted by law.",
          "Request information regarding how your data is processed.",
        ],
      },
      {
        type: "paragraph",
        text: "Requests may be submitted using the contact details provided below.",
      },
    ],
  },
  {
    title: "9. Changes to This Privacy Policy",
    content: [
      {
        type: "paragraph",
        text: "PMV Maritime Solutions Limited reserves the right to update or modify this Privacy Policy at any time to reflect changes in legal requirements, business practices, or our services. Any updates will be published on this page with a revised effective date.",
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

export default function PrivacyPolicy() {
  return (
    <>
      <div className="no-print">
        <SubBanner
          Heading="Privacy Policy"
          breadcrumbItems={[{ label: "Privacy Policy", href: "/privacy" }]}
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
                  Privacy <span className="text-secondary-dark">Policy</span>
                  <span className="text-primary">.</span>
                </h1>

                <p className="text-sm md:text-[16px] max-w-full text-gray-600 font-medium">
                  At PMV Maritime Solutions Limited, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, store, and protect your information when you visit our website or use our services.
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
          <LegalContent sections={privacySections} />
        </div>
      </main>

      <div className="no-print">
        <ContactUs />
      </div>
    </>
  );
}


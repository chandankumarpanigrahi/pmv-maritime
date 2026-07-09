"use client";
import React from "react";

import SubBanner from "@/components/Sub Banner/page";

export default function Projects() {
  return (
    <>
      <SubBanner
        Heading="Smart Container Tracking System"
        breadcrumbItems={[
          { label: "Our Projects", href: "/projects" },
          { label: "Container Tracking", href: "/projects/container-tracking" }
        ]}
      />

    </>
  );
}
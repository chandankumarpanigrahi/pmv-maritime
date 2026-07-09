"use client";

import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubBanner from "@/components/Sub Banner/page";
import Link from "next/link";
import Image from "next/image";


export default function Projects() {
  return (
    <>
      <SubBanner Heading="About Us" breadcrumbItems={[{ label: "About Us", href: "/about" }]} />
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative">
        About
      </div >
    </>
  );
}
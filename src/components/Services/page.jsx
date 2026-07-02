import styles from "./style.module.css";
import React, { useState, useEffect } from "react";
import SubHeading from "@/design/sub-heading/page";
import Link from "next/link";
import Image from "next/image";

// Icons
import { FaArrowRight } from "react-icons/fa";
import { TbShip } from "react-icons/tb";


import bannerBg from "../../../public/assets/images/map-bg.png";

import image1 from "../../../public/assets/images/about-image-1.jpg";
import image2 from "../../../public/assets/images/about-image-2.jpg";
import image3 from "../../../public/assets/images/about-image-3.jpg";


const images = [image1, image2, image3];
export default function Services() {
  return (
    <div className="flex flex-col md:flex-row container mx-auto items-stretch relative">
      <Image
        src={bannerBg}
        alt="Banner Background"
        className="object-cover opacity-50 pointer-events-none z-0 absolute right-0"
      />
      <div className="w-full flex flex-col border border-gray-200">
        <div className="flex flex-col md:flex-row py-8 px-4 md:px-8">
          <div className="flex flex-col w-full md:w-7/12">
            <SubHeading title="Services" />
            <h1 className="font-oswald text-2xl md:text-4xl text-sky-700 font-bold mb-3 md:mb-6">End-to-End <span className="text-sky-900">Maritime Solutions</span><span className="text-rose-700">.</span><br />Driven by Expertise<span className="text-rose-700">.</span> <span className="text-sky-900">Delivered with Care</span><span className="text-rose-700">.</span></h1>
            <p className="text-sm md:text-[15px] max-w-[90%] md:max-w-[60%] text-gray-600 font-medium">We combine expertise, technology and global reach to deliver safe, efficient and sustainable maritime solutions.</p>
          </div>
          <div className="w-full md:w-5/12 flex flex-col mt-6 md:mt-0 justify-end items-start md:items-end">
            <Link
              href="/services"
              className="group w-fit text-[14px] flex gap-5 items-center mb-3 pl-3 md:pl-4 pr-2 md:pr-3 py-1.5 md:py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold tracking-wider uppercase shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              View All Services <FaArrowRight className="group-hover:-rotate-45 transition-all duration-300 ease-in-out" />
            </Link>
          </div>
        </div>
        <div>
          <div className="hidden flex-row">
            <div className="flex flex-row">
              <TbShip />
              <p className="w-[175px]">Maritime Consultancy</p>
            </div>
          </div>
        </div>
      </div>

    </div >
  );
}

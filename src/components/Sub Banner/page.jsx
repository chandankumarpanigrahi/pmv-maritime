import React from "react";
import styles from "./style.module.css";
import Breadcrumb from "@/design/breadcrumb/page";
import Image from "next/image";

// Images
import BannerImage from "../../../public/assets/images/banner-ship.png"
import LightTriangle from "../../../public/assets/images/banner-triangle-light.png"
import DarkTriangle from "../../../public/assets/images/banner-triangle-dark.png"

export default function SubBanner({ Heading, breadcrumbItems, ...breadcrumbProps }) {
  return (
    <div className="container max-w-7xl mx-auto mt-[140px]">
      <div className="w-full h-[300px] bg-primary relative">
        <div className={`${styles.bachgroundAnchor} absolute inset-0 opacity-6`}></div>
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col relative z-5 h-auto p-10 my-auto justify-center">
            <h2 className="text-5xl font-semibold text-white font-oswald">{Heading}</h2>
          </div>
          <div className="bg-white w-full h-11 border border-gray-200 relative z-2"></div>
          <Breadcrumb items={breadcrumbItems} {...breadcrumbProps} />
          <Image src={BannerImage} alt="Ship Sub Banner Image" fill className="hidden md:flex object-contain object-right relative z-4" />
          <Image src={LightTriangle} alt="Ship Sub Banner Image" fill className="hidden md:flex object-contain object-right relative z-1" />
          <Image src={DarkTriangle} alt="Ship Sub Banner Image" fill className="hidden md:flex object-contain object-right relative z-3" />
        </div>
      </div>
    </div>
  );
}

import styles from "./style.module.css";
import React from "react";
import SubHeading from "@/design/sub-heading/page";
import Image from "next/image";

import bannerBg from "../../../public/assets/images/map-bg.png";

// Brands
import brandLogo1 from "../../../public/assets/brands/brand_1.png"
import brandLogo2 from "../../../public/assets/brands/brand_2.png"
import brandLogo3 from "../../../public/assets/brands/brand_3.png"
import brandLogo4 from "../../../public/assets/brands/brand_4.png"
import brandLogo5 from "../../../public/assets/brands/brand_5.png"
import brandLogo6 from "../../../public/assets/brands/brand_6.png"
import brandLogo7 from "../../../public/assets/brands/brand_7.png"
import brandLogo8 from "../../../public/assets/brands/brand_8.png"
import brandLogo9 from "../../../public/assets/brands/brand_9.png"
import brandLogo10 from "../../../public/assets/brands/brand_10.png"
import brandLogo11 from "../../../public/assets/brands/brand_11.png"
import brandLogo12 from "../../../public/assets/brands/brand_12.png"
import brandLogo13 from "../../../public/assets/brands/brand_13.png"
import brandLogo14 from "../../../public/assets/brands/brand_14.png"
import brandLogo15 from "../../../public/assets/brands/brand_15.png"
import brandLogo16 from "../../../public/assets/brands/brand_16.png"
import brandLogo17 from "../../../public/assets/brands/brand_17.png"
import brandLogo18 from "../../../public/assets/brands/brand_18.png"
import ContactUs from "../Contact Us/page";

const brandLogos = [
  brandLogo1, brandLogo2, brandLogo3, brandLogo4, brandLogo5, brandLogo6,
  brandLogo7, brandLogo8, brandLogo9, brandLogo10, brandLogo11, brandLogo12,
  brandLogo13, brandLogo14, brandLogo15, brandLogo16, brandLogo17, brandLogo18
];

export default function Accreditation() {
  return (
    <>
      <div className="flex flex-col md:flex-row container max-w-7xl mx-auto items-stretch relative overflow-hidden">
        <Image
          src={bannerBg}
          alt="Banner Background"
          className="object-cover opacity-40 pointer-events-none z-0 absolute right-0 -top-1/2"
        />
        <div className="w-full flex flex-col border border-t-0 border-gray-200">
          <div className="flex flex-col md:flex-row py-6 px-4 md:px-8">
            <div className="flex flex-row w-full items-center justify-between">
              <SubHeading title="Approvals & Accreditation" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col container max-w-7xl mx-auto border border-t-0 border-gray-200 overflow-hidden">
        <div className={styles.marqueeContainer}>
          <div className={`${styles.marqueeTrack} ${styles.scrollRightToLeft}`}>
            {brandLogos.map((logo, index) => (
              <div key={`logo-1-${index}`} className={styles.marqueeItem}>
                <Image
                  src={logo}
                  alt={`Brand Logo ${index + 1}`}
                  className="w-auto h-8 md:h-12 object-contain"
                />
              </div>
            ))}
            {brandLogos.map((logo, index) => (
              <div key={`logo-2-${index}`} className={styles.marqueeItem}>
                <Image
                  src={logo}
                  alt={`Brand Logo ${index + 1}`}
                  className="w-auto h-8 md:h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <div className={styles.marqueeContainer}>
          <div className={`${styles.marqueeTrack} ${styles.scrollLeftToRight}`}>
            {brandLogos.map((logo, index) => (
              <div key={`logo-1-${index}`} className={styles.marqueeItem}>
                <Image
                  src={logo}
                  alt={`Brand Logo ${index + 1}`}
                  className="w-auto h-8 md:h-12 object-contain"
                />
              </div>
            ))}
            {brandLogos.map((logo, index) => (
              <div key={`logo-2-${index}`} className={styles.marqueeItem}>
                <Image
                  src={logo}
                  alt={`Brand Logo ${index + 1}`}
                  className="w-auto h-8 md:h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ContactUs />
    </>
  );
}

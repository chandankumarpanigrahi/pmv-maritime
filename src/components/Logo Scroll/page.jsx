import React from "react";
import styles from "./style.module.css";
import Image from "next/image";

import logo1 from "../../../public/assets/logos/dlogo-1.png"
import logo2 from "../../../public/assets/logos/dlogo-2.png"
import logo3 from "../../../public/assets/logos/dlogo-3.png"
import logo4 from "../../../public/assets/logos/dlogo-4.png"

const partnerLogos = [logo1, logo2, logo3, logo4];

export default function LogoScroll() {
  // Manual Speed Control: Adjust this duration to control speed (e.g. '15s' for fast, '35s' for slow)
  const scrollSpeed = "60s";

  // Repeat logos 4 times to span wide screens, then double it to form a seamless loop track
  const repeatedLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos];
  const doubleList = [...repeatedLogos, ...repeatedLogos];

  return (
    <div className={`${styles.slider} w-full container mx-auto border border-gray-200 border-t-0`}>
      <div
        className={`${styles.track} flex gap-12 md:gap-20`}
        style={{ "--speed": scrollSpeed }}
      >
        {doubleList.map((logo, idx) => (
          <div key={idx} className="flex items-center justify-center h-[55px] w-[140px] shrink-0">
            <Image
              src={logo}
              alt={`Partner Logo ${idx + 1}`}
              className="max-h-full max-w-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

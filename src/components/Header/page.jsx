import React from "react";
import styles from "./style.module.css";
import Image from "next/image";
import Link from "next/link";

// Icons
import { LuMenu } from "react-icons/lu";

// Images
import logoLight from "../../../public/assets/images/logo-light.png"
import logoDark from "../../../public/assets/images/logo.png"
import CtaHeader from "../Cta Header/page";


export default function Header() {
  return (
    <div className="fixed top-0 w-full z-50">
      <CtaHeader />
      <header className={`${styles.header} bg-white w-full shadow-lg`}>
        <div className="container mx-auto flex flex-row justify-between items-center py-3">
          <Image src={logoDark} alt="logo" className="w-[70px]" />
          <div className="flex flex-row gap-8 items-center">
            <Link href="/" className="uppercase text-sky-700 hover:text-rose-700 font-bold text-xl">Home</Link>
            <Link href="/about" className="uppercase text-sky-700 hover:text-rose-700 font-bold text-xl">About</Link>
            <Link href="/services" className="uppercase text-sky-700 hover:text-rose-700 font-bold text-xl">Services</Link>
            <div className="flex flex-row items-center gap-3">
              <Link href="/contact" className="uppercase text-sky-700 text-lg hover:text-rose-700 border border-sky-700/60 hover:border-rose-700/60 px-4 py-1 font-bold bg-sky-700/10 hover:bg-rose-700/5">Contact Us</Link>
              <div className="bg-sky-700 hover:bg-rose-700 p-1.5 cursor-pointer"><LuMenu className="text-white text-2xl" /></div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

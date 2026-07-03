import React from "react";
import styles from "./style.module.css";
import Link from "next/link";

// icons
import { IoMdMail, IoMdCall } from "react-icons/io";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

export default function CtaHeader() {
  return (
    <div className="bg-sky-950">
      <div className="container max-w-7xl mx-auto flex justify-between px-2 md:px-0 py-1">
        <div className="flex flex-row gap-2 md:gap-5 items-center text-white">
          <a className="flex flex-row gap-2 items-center opacity-70 text-[20px] md:text-[12px] hover:opacity-100" href="mailto:info@pmvmaritime.com" target="_blank" rel="noopener noreferrer"><IoMdMail /> <span className="hidden md:inline-block">info@pmvmaritime.com</span></a>
          <a className="flex flex-row gap-2 items-center opacity-70 text-[20px] md:text-[12px] hover:opacity-100" href="tel:+971505342726" target="_blank" rel="noopener noreferrer"><IoMdCall /> <span className="hidden md:inline-block">+97 15053 42726</span></a>
        </div>
        <div className="flex text-white gap-2">
          <a className="opacity-80 text-[18px] hover:opacity-100" href="#" target="_blank" rel="noopener noreferrer"><FaFacebookSquare /></a>
          <a className="opacity-80 text-[18px] hover:opacity-100" href="#" target="_blank" rel="noopener noreferrer"><FaInstagramSquare /></a>
          <a className="opacity-80 text-[18px] hover:opacity-100" href="#" target="_blank" rel="noopener noreferrer"><FaSquareXTwitter /></a>
          <a className="opacity-80 text-[18px] hover:opacity-100" href="#" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
        </div>
      </div>
    </div>
  );
}

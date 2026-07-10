import Link from "next/link";
import React from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export default function Breadcrumb({
  items = [],
  separator = <MdOutlineKeyboardArrowRight className="text-gray-400 shrink-0" />,
  showHome = true,
  className = "",
  homeElement = <BiHomeAlt2 className="text-lg" />,
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`absolute left-0 bottom-0 z-6 w-full h-fit px-4 py-3 items-center flex text-sm select-none ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {showHome && (
          <li className="flex items-center gap-2">
            <Link
              href="/"
              className="cursor-pointer text-primary hover:text-secondary-dark transition-colors flex items-center justify-center"
              aria-label="Home"
              id="breadcrumb-home"
            >
              {homeElement}
            </Link>
            {items.length > 0 && separator}
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `breadcrumb-item-${index}`;

          return (
            <li key={key} className="flex items-center gap-2">
              {isLast || !item.href ? (
                <span
                  className="text-primary font-medium cursor-default"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-primary transition-colors font-normal"
                  id={`breadcrumb-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {item.label}
                </Link>
              )}
              {!isLast && separator}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
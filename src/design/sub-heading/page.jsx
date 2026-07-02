import React from "react";

export default function SubHeading(props) {
  return (
    <div className="flex w-fit gap-3 mb-4 md:mb-8 items-center">
      <div className="relative h-[3px]">
        <div className="w-[35px] h-[2px] bg-rose-700"></div>
        <div className="w-[7px] h-[7px] bg-rose-700 rounded-full absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <h3 className="uppercase font-oswald text-rose-700 text-xl font-semibold">{props.title}</h3>
    </div>
  );
}
"use client";

import { LuShip } from "react-icons/lu";

export default function ServicesPage() {
  return (
    <div className="p-3 md:p-5">
      <div className="bg-white border border-gray-200 p-12 md:p-20 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-14 h-14 bg-slate-100 border border-gray-200 flex items-center justify-center mb-4">
          <LuShip className="text-2xl text-gray-300" />
        </div>
        <h2 className="font-oswald text-xl md:text-2xl font-bold text-gray-300 uppercase tracking-wider">
          Services
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
          This section is under development. Content will be available soon.
        </p>
      </div>
    </div>
  );
}

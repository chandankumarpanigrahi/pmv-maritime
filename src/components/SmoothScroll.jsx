"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,       // scroll animation duration (seconds) — increase for slower/smoother
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      smoothWheel: true,   // enables smooth mouse wheel scrolling
      wheelMultiplier: 1,  // mouse scroll speed multiplier
      touchMultiplier: 2,  // touch scroll speed multiplier
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null; // This component renders nothing, just runs the effect
}

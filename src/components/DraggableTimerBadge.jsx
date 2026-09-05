"use client";

import React, { useState, useRef } from "react";
import { LuGripVertical, LuLogOut } from "react-icons/lu";

export default function DraggableTimerBadge({ timeLeft, onLogout }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const badgeRef = useRef(null);
  const dragInfoRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    untranslatedLeft: 0,
    untranslatedRight: 0,
    untranslatedTop: 0,
    untranslatedBottom: 0,
  });

  const handlePointerDown = (e) => {
    // Only respond to primary click/touch
    if (e.button !== undefined && e.button !== 0) return;

    if (!badgeRef.current) return;

    const rect = badgeRef.current.getBoundingClientRect();
    const untranslatedLeft = rect.left - position.x;
    const untranslatedRight = rect.right - position.x;
    const untranslatedTop = rect.top - position.y;
    const untranslatedBottom = rect.bottom - position.y;

    dragInfoRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
      untranslatedLeft,
      untranslatedRight,
      untranslatedTop,
      untranslatedBottom,
    };

    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragInfoRef.current.isDragging) return;

    const {
      startX,
      startY,
      initialX,
      initialY,
      untranslatedLeft,
      untranslatedRight,
      untranslatedTop,
      untranslatedBottom,
    } = dragInfoRef.current;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let targetX = initialX + deltaX;
    let targetY = initialY + deltaY;

    // Viewport bounding checks
    const minX = -untranslatedLeft + 8;
    const maxX = window.innerWidth - untranslatedRight - 8;
    const minY = -untranslatedTop + 8;
    const maxY = window.innerHeight - untranslatedBottom - 8;

    targetX = Math.max(minX, Math.min(maxX, targetX));
    targetY = Math.max(minY, Math.min(maxY, targetY));

    setPosition({ x: targetX, y: targetY });
  };

  const handlePointerUpOrCancel = (e) => {
    if (dragInfoRef.current.isDragging) {
      dragInfoRef.current.isDragging = false;
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore if pointer capture already released
      }
    }
  };

  return (
    <div
      ref={badgeRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`fixed bottom-8 right-4 z-99999 flex items-center gap-2.5 bg-slate-900/95 hover:bg-slate-900 border border-slate-700/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl select-none touch-none cursor-grab active:cursor-grabbing ${
        isDragging ? "transition-none shadow-emerald-500/20 ring-2 ring-emerald-500/30" : "transition-transform duration-75"
      }`}
      title="Click and drag to move"
    >
      <LuGripVertical className="text-slate-400 hover:text-white text-xs flex-shrink-0" />
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-mono font-bold text-emerald-400">{timeLeft}</span>
      </div>
      <div className="w-px h-3 bg-slate-700"></div>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onLogout();
        }}
        title="Logout"
        className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer flex items-center justify-center"
      >
        <LuLogOut className="text-xs" />
      </button>
    </div>
  );
}

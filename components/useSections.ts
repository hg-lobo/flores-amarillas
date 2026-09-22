"use client";

import { useEffect, useRef, useState } from "react";

export default function useSections(totalSections: number) {
  const [section, setSection] = useState(0);
  const cooldownRef = useRef(false);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    const COOLDOWN_MS = 1200;
    const THRESHOLD = 25;

    const triggerChange = (direction: 1 | -1) => {
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setTimeout(() => {
        cooldownRef.current = false;
      }, COOLDOWN_MS);

      setSection((prev) => {
        const next = prev + direction;
        if (next < 0) return 0;
        if (next >= totalSections) return totalSections - 1;
        return next;
      });
    };

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < THRESHOLD) return;
      e.preventDefault();
      triggerChange(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 60) return;
      triggerChange(deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        triggerChange(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        triggerChange(-1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [totalSections]);

  const goTo = (n: number) => {
    if (n < 0 || n >= totalSections) return;
    setSection(n);
  };

  return { section, goTo };
}
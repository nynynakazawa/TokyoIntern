// app/components/PageTransition.tsx
"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const FADE_MS = 500;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
    } else {
      setShow(true);
      setFade(false);
    }
    const t1 = setTimeout(() => setFade(true), 20);
    const t2 = setTimeout(() => setShow(false), FADE_MS + 20);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return (
    <div className="relative">
      {children}
      {show && (
        <div
          className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-500 z-50 ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
}
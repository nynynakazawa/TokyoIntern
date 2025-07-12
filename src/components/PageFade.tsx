"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [fadeIn, setFadeIn] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setFadeIn(false);
      setTimeout(() => {
        setFadeIn(true);
        setIsFirstRender(false);
      }, 500); // 500ms後にフェードイン開始
    } else {
      setDisplayedChildren(children);
      setFadeIn(true); // ページ遷移時は即座に表示
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, children]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {displayedChildren}
    </div>
  );
} 
"use client";
import React, { useEffect, useState } from "react";

const TOTAL_MS = 1000;  // ローディングを見せる長さ
const FADE_MS  = 300;   // フェードアウト時間

export default function LoadingAnimation() {
  const [fadeOut, setFadeOut] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    /* ① TOTAL_MS - FADE_MS 後に opacity を 0 へ */
    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_MS - FADE_MS);

    /* ② TOTAL_MS 後にコンポーネント自体をアンマウント */
    const hideTimer = setTimeout(() => setHide(true), TOTAL_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (hide) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white
                    transition-opacity duration-[${FADE_MS}ms]
                    ${fadeOut ? "opacity-0" : "opacity-100"}`}
      >
        <div className="loader-container">
          <div className="loader-circle" />
          <div className="loader-circle" />
          <div className="loader-circle" />
          <div className="loader-shadow" />
          <div className="loader-shadow" />
          <div className="loader-shadow" />
        </div>
      </div>
      <style jsx>{`
        .loader-container {
          position: relative;
          width: 120px;
          height: 60px;
        }
        .loader-circle {
          position: absolute;
          bottom: 20px;
          width: 15px;
          height: 15px;
          background: #000;
          border-radius: 50%;
          background-color: pink; 
          animation: loader-bounce 1s infinite;
        }
        .loader-shadow {
          position: absolute;
          bottom: 0;
          width: 15px;
          height: 3px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          transform-origin: center;
          animation: loader-shadow 1s infinite;
        }
        /* 1・2・3 番目の circle に時間差 */
        .loader-circle:nth-child(1) { left: 0;   animation-delay: 0s;   }
        .loader-circle:nth-child(2) { left: 40px; animation-delay: 0.1s; }
        .loader-circle:nth-child(3) { left: 80px; animation-delay: 0.2s; }
        /* 4・5・6 番目の shadow に時間差 */
        .loader-shadow:nth-child(4) { left: 0;   animation-delay: 0s;   }
        .loader-shadow:nth-child(5) { left: 40px; animation-delay: 0.1s; }
        .loader-shadow:nth-child(6) { left: 80px; animation-delay: 0.2s; }

        @keyframes loader-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-20px); }
        }
        @keyframes loader-shadow {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(0.6); }
        }
      `}</style>
    </>
  );
}
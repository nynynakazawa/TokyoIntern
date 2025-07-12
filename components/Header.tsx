// components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 relative">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2 font-bold text-main-600 text-xl">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
            <circle cx="12" cy="12" r="10" />
          </svg>
          トウキョウインターン
        </Link>

        {/* PCナビ */}
        <nav className="hidden md:flex gap-6 text-xl">
          <Link href="/jobs" className="nav-link">求人検索</Link>
          <Link href="/about" className="nav-link">会社概要</Link>
          <Link href="/contact" className="nav-link">お問い合わせ</Link>
        </nav>

        {/* 右側ボタン */}
        <div className="hidden items-center gap-3 md:flex text-lg">
          <Link href="/login" className="btn-outline">ログイン</Link>
          <Link href="/register" className="btn-primary">会員登録</Link>
        </div>

        {/* SPハンバーガー */}
        <button
          className="block md:hidden"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M3 6h18M3 12h18M3 18h18"
            />
          </svg>
        </button>

        {/* オーバーレイ & SP メニュー */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
        >
          <nav
            className={`
              absolute top-0 right-0 w-64 h-full bg-white p-6 flex flex-col gap-6
              transition-transform duration-300 text-lg
              ${open ? "translate-x-0" : "translate-x-full"}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/jobs" onClick={() => setOpen(false)}>求人検索</Link>
            <Link href="/about" onClick={() => setOpen(false)}>会社概要</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>お問い合わせ</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
// components/Header.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        const token = await currentUser.getIdTokenResult();
        setRole(typeof token.claims.role === "string" ? token.claims.role : null);
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!window.confirm("ログアウトしてよろしいですか?")) return;
    try {
      await signOut(auth);
      console.log("ログアウト成功");
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      // まずPopupで試行
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      // Popup失敗時はRedirectにフォールバック
      if (
        e.code === "auth/popup-blocked" ||
        e.code === "auth/popup-closed-by-user" ||
        e.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, provider);
      } else {
        alert("ログインに失敗しました");
        console.error(e);
      }
    }
  };

  // 管理者ページのリンク先を決定
  const getAdminPageLink = () => {
    if (role === "admin") return "/admin";
    if (role === "owner" || role === "company") return "/company";
    return "/mypage";
  };

  // 管理者ページのボタン名
  const getAdminPageLabel = () => {
    if (role === "admin" || role === "owner" || role === "company") return "管理者ページ";
    return "マイページ";
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 relative">
          <Link href="/" className="flex items-center gap-2 font-bold text-main-600 text-xl">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
              <circle cx="12" cy="12" r="10" />
            </svg>
            トウキョウインターン
          </Link>
        </div>
      </header>
    );
  }

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
          {user ? (
            <>
              <button onClick={handleLogout} className="btn-outline">ログアウト</button>
              <Link href={getAdminPageLink()} className="btn-primary">{getAdminPageLabel()}</Link>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className="btn-outline">ログイン</button>
              <button onClick={handleLogin} className="btn-primary">会員登録</button>
            </>
          )}
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
            {user ? (
              <>
                <Link href={getAdminPageLink()} onClick={() => setOpen(false)}>{getAdminPageLabel()}</Link>
                <button onClick={handleLogout} className="text-left">ログアウト</button>
              </>
            ) : (
              <>
                <button onClick={() => { setOpen(false); handleLogin(); }} className="text-left">ログイン</button>
                <button onClick={() => { setOpen(false); handleLogin(); }} className="text-left">会員登録</button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
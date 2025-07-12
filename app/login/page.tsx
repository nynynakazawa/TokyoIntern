// app/login/page.tsx  ―  Google ログイン（モック）
"use client";

import { useState } from "react";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    // TODO: Firebase Auth / next-auth などへ差し替え
    setTimeout(() => alert("モック：Google OAuth 成功"), 800);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <h1 className="text-2xl font-bold mb-8">Google でログイン</h1>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex items-center gap-2 rounded bg-white border px-6 py-3 shadow hover:bg-gray-50"
      >
        <img src="/google.svg" alt="" className="w-5 h-5" />
        <span>{loading ? "認証中…" : "Sign in with Google"}</span>
      </button>
    </main>
  );
}
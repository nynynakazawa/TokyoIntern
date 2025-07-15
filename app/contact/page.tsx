// app/contact/page.tsx
"use client";

import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-main-700">お問い合わせ</h1>
      {sent ? (
          <p className="text-green-600 text-center font-semibold">送信しました。ありがとうございました！</p>
      ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                お名前
              </label>
          <input
            required
                id="name"
            name="name"
            placeholder="お名前"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
          />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
          <input
            required
            type="email"
                id="email"
            name="email"
            placeholder="メールアドレス"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
          />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                お問い合わせ内容
              </label>
          <textarea
            required
                id="message"
            name="message"
            placeholder="お問い合わせ内容"
            rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none"
          />
            </div>
          <button
            type="submit"
              className="w-full rounded-lg bg-main-600 py-2 px-6 font-semibold text-white shadow hover:bg-main-700 transition active:scale-95"
          >
            送信
          </button>
        </form>
      )}
      </div>
    </main>
  );
}
// app/layout.tsx  ―  全ページ共通レイアウト
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoadingAnimation from "../components/LoadingAnimation";
import PageTransition from "../components/PageTransition";
import type { ReactNode } from "react";

export const metadata = {
  title: "トウキョウインターン｜長期インターン求人サイト",
  description: "東京圏の長期・有給インターン求人を探せるモックアプリ",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased font-body text-black min-h-screen flex flex-col">
      <LoadingAnimation />
      <Header />
        <main className="flex-1">
          {/* 白オーバーレイだけで遷移を隠す */}
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
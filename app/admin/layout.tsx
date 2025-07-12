// app/admin/layout.tsx  ―  管理者 UI 用レイアウト（将来拡張）
import type { ReactNode } from "react";
import "../../styles/globals.css";

export const metadata = { title: "Admin｜TokyoIntern" };

// ✅ 本番ではここで認可チェック（session / role）を挟む
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen bg-gray-50">
        <aside className="w-60 shrink-0 border-r bg-white p-4">
          <h2 className="font-bold mb-6">管理メニュー</h2>
          <nav className="space-y-2 text-sm">
            <a href="/admin" className="block hover:underline">
              ダッシュボード
            </a>
            <a href="/admin/jobs" className="block hover:underline">
              求人管理
            </a>
            <a href="/admin/companies" className="block hover:underline">
              企業管理
            </a>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
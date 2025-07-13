// app/admin/layout.tsx  ―  管理者 UI 用レイアウト（将来拡張）
import type { ReactNode } from "react";
import "../../styles/globals.css";

export const metadata = { title: "Admin｜TokyoIntern" };

// ✅ 本番ではここで認可チェック（session / role）を挟む
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="flex min-h-screen bg-gray-50">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
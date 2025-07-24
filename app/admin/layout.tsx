// app/admin/layout.tsx  ―  管理者 UI 用レイアウト（将来拡張）
import type { ReactNode } from "react";
import "../../styles/globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "Admin｜TokyoIntern" };

// ✅ 本番ではここで認可チェック（session / role）を挟む
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-gray-100 border-r flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">管理者メニュー</h2>
        <nav className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/admin">ダッシュボード</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/admin/companies">企業管理</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/admin/jobs">求人管理</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/admin/users">ユーザー管理</Link>
          </Button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-8">
        <div className="w-full max-w-4xl px-6">
      {children}
        </div>
    </main>
    </div>
  );
}
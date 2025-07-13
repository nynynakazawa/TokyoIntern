// src/app/admin/(dashboard)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn/ui

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">管理者メニュー</h2>
        <nav className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/admin/dashboard">ダッシュボード</Link>
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
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
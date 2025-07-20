// src/app/company/(dashboard)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // shadcn/ui

export default function CompanyDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sidebar w-64 bg-blue-50 border-r flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">企業メニュー</h2>
        <nav className="flex flex-col gap-2">
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/company">ダッシュボード</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/company/jobs">自社求人管理</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/company/applicants">応募者管理</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/company/profile">企業プロフィール</Link>
          </Button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-50 border-r flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">マイメニュー</h2>
        <nav className="flex flex-col gap-2">
        <Button asChild variant="ghost" className="justify-start">
            <Link href="/mypage">マイページ</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/mypage/profile">プロフィール</Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start">
            <Link href="/mypage/applied">応募した企業</Link>
          </Button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
} 
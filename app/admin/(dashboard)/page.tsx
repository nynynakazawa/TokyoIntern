"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        const role = idTokenResult.claims.role;
        
        if (role !== "admin") {
          alert("admin権限が必要です");
          router.push("/login");
          return;
        }
        
        setUser(currentUser);
        setLoading(false);
      } else {
        setLoading(false);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 border-b-2 border-main-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Adminダッシュボード</h1>
        <p className="text-gray-600 text-lg mb-1">ようこそ、{user.displayName}さん</p>
        <p className="text-gray-500 text-sm">ユーザーID: {user.uid}</p>
        <p className="text-gray-500 text-sm mb-2">ロール: admin</p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3 mb-6">管理機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/companies" className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300 cursor-pointer block">
            <h3 className="font-semibold text-gray-800 group-hover:text-main-700 transition-colors mb-1">企業管理</h3>
            <p className="text-sm text-gray-600">企業情報の管理</p>
          </Link>
          <Link href="/admin/jobs" className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300 cursor-pointer block">
            <h3 className="font-semibold text-gray-800 group-hover:text-main-700 transition-colors mb-1">求人管理</h3>
            <p className="text-sm text-gray-600">求人の編集・削除</p>
          </Link>
          <Link href="/admin/users" className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300 cursor-pointer block">
            <h3 className="font-semibold text-gray-800 group-hover:text-main-700 transition-colors mb-1">ユーザー管理</h3>
            <p className="text-sm text-gray-600">ユーザー権限の管理</p>
          </Link>
        </div>
      </div>
    </>
  );
}

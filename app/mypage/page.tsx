"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function MyPageDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-4 mb-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="ユーザーアイコン" className="w-16 h-16 rounded-full border" />
          ) : (
            <div className="w-16 h-16 rounded-full border bg-gray-200 flex items-center justify-center text-gray-400">未設定</div>
          )}
          <div>
            <div className="font-bold text-lg">{user.displayName || "未設定"}</div>
            <div className="text-sm text-gray-600">{user.email || "未設定"}</div>
          </div>
        </div>
      </div>
      <p>ようこそ、{user.displayName}さん</p>
      <p>ユーザーID: {user.uid}</p>
      <p>ロール: 一般ユーザー</p>
      {/* ダッシュボードの内容 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">マイページ機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">プロフィール</h3>
            <p className="text-sm text-gray-600">ユーザー情報の編集</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">応募した企業</h3>
            <p className="text-sm text-gray-600">応募履歴の確認</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";

export default function CompanyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [iconUrl, setIconUrl] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        const role = idTokenResult.claims.role;
        const companyId = idTokenResult.claims.companyId;
        if (role !== "owner") {
          alert("企業オーナー権限が必要です");
          router.push("/login");
          return;
        }
        setUser(currentUser);
        setCompanyId(typeof companyId === "string" ? companyId : "");
        // Firestoreから企業プロフィール取得
        if (typeof companyId === "string" && companyId) {
          const db = getFirestore(app);
          const ref = doc(db, "companies", companyId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setCompanyName(data.name || "");
            setProfile(data.profile || "");
            setIconUrl(data.iconUrl || "");
          }
        }
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
      <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center gap-4 mb-2">
          {iconUrl ? (
            <img src={iconUrl} alt="企業アイコン" className="w-16 h-16 rounded-full border" />
          ) : (
            <div className="w-16 h-16 rounded-full border bg-gray-200 flex items-center justify-center text-gray-400">未設定</div>
          )}
          <div>
            <div className="font-bold text-lg">{companyName || "未設定"}</div>
            <div className="text-sm text-gray-600">{profile || "未設定"}</div>
          </div>
        </div>
      </div>
      <p>ようこそ、{user.displayName}さん</p>
      <p>ユーザーID: {user.uid}</p>
      <p>ロール: 企業オーナー</p>
      {/* ダッシュボードの内容 */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">企業管理機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">求人管理</h3>
            <p className="text-sm text-gray-600">自社求人の作成・編集・削除</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">企業プロフィール</h3>
            <p className="text-sm text-gray-600">企業情報の編集</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium">応募者管理</h3>
            <p className="text-sm text-gray-600">応募者の確認・管理</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
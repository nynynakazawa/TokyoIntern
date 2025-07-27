"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import LoadingAnimation from "../../../components/LoadingAnimation";

export default function CompanyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [profile, setProfile] = useState<string>("");
  const [iconUrl, setIconUrl] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        const role = idTokenResult.claims.role;
        const companyId = idTokenResult.claims.companyId;
        if (role !== "company") {
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
            setArea(data.area || "");
            setPhone(data.phone || "");
            setWebsite(data.website || "");
          }
        }
        setLoading(false);
      } else {
        setLoading(false);
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user || loading) {
    return <LoadingAnimation />;
  }

  return (
    <main className="min-h-[60vh] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* ヘッダーセクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {iconUrl ? (
              <img 
                src={iconUrl} 
                alt="企業アイコン" 
                className="w-20 h-20 rounded-full border-4 border-main-100 shadow-lg" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-main-100 bg-gradient-to-br from-main-100 to-main-200 flex items-center justify-center text-main-600 font-bold text-xl shadow-lg">
                {companyName?.charAt(0) || "C"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {companyName || "未設定"}
              </h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
              {profile && (
                <p className="text-gray-700 italic">"{profile}"</p>
              )}
            </div>
          </div>
        </div>

        {/* 企業詳細セクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3">
            企業詳細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-main-500 rounded mr-3"></span>
                基本情報
              </h3>
              <div className="space-y-3">
                {companyName && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">企業名</label>
                    <p className="text-gray-800 text-medium">{companyName}</p>
                  </div>
                )}
                {profile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">企業プロフィール</label>
                    <p className="text-gray-800">{profile}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 連絡先情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-main-500 rounded mr-3"></span>
                連絡先情報
              </h3>
              <div className="space-y-3">
                {area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">所在地</label>
                    <p className="text-gray-800 text-medium">{area}</p>
                  </div>
                )}
                {phone && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">電話番号</label>
                    <p className="text-gray-800 text-medium">{phone}</p>
                  </div>
                )}
                {website && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">企業HP</label>
                    <br></br>
                    <a 
                      href={website.startsWith('http') ? website : `https://${website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-main-600 hover:text-main-700 underline"
                    >
                      {website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 機能カードセクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3">
            企業管理機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300" onClick={() => router.push("/company/profile")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-main-100 rounded-lg flex items-center justify-center group-hover:bg-main-200 transition-colors">
                  <svg className="w-6 h-6 text-main-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-main-700 transition-colors">企業プロフィール編集</h3>
                  <p className="text-sm text-gray-600">企業情報の編集・更新</p>
                </div>
              </div>
            </div>
            <div className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300" onClick={() => router.push("/company/jobs")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-main-100 rounded-lg flex items-center justify-center group-hover:bg-main-200 transition-colors">
                  <svg className="w-6 h-6 text-main-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0v2a2 2 0 002 2h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2M8 6v2a2 2 0 002 2h4a2 2 0 002-2V6m-8 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-main-700 transition-colors">求人管理</h3>
                  <p className="text-sm text-gray-600">自社求人の作成・編集・削除</p>
                </div>
              </div>
            </div>
            <div className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300" onClick={() => router.push("/company/applicants")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-main-100 rounded-lg flex items-center justify-center group-hover:bg-main-200 transition-colors">
                  <svg className="w-6 h-6 text-main-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-main-700 transition-colors">応募者管理</h3>
                  <p className="text-sm text-gray-600">応募者の確認・管理</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
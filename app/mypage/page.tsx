"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function MyPageDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Firestoreからプロフィール情報取得
        const db = getFirestore(app);
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
        setLoading(false); // ←ここで必ず呼ぶ
      } else {
        setLoading(false); // ←ここも必ず呼ぶ
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
    <main className="min-h-[60vh] bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* ヘッダーセクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {profile?.iconUrl || user.photoURL ? (
              <img 
                src={profile?.iconUrl || user.photoURL} 
                alt="ユーザーアイコン" 
                className="w-20 h-20 rounded-full border-4 border-main-100 shadow-lg" 
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-main-100 bg-gradient-to-br from-main-100 to-main-200 flex items-center justify-center text-main-600 font-bold text-xl shadow-lg">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profile?.name || user.displayName || "未設定"}
              </h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
              {profile?.selfIntro && (
                <p className="text-gray-700 italic">"{profile.selfIntro}"</p>
              )}
            </div>
          </div>
        </div>

        {/* プロフィール詳細セクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3">
            プロフィール詳細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 学歴情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-main-500 rounded mr-3"></span>
                学歴情報
              </h3>
              <div className="space-y-3">
                {profile?.university && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">大学</label>
                    <p className="text-gray-800 text-medium">{profile.university}</p>
                  </div>
                )}
                {profile?.faculty && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">学部（研究科）</label>
                    <p className="text-gray-800 text-medium">{profile.faculty}</p>
                  </div>
                )}
                {profile?.department && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">専攻</label>
                    <p className="text-gray-800 text-medium">{profile.department}</p>
                  </div>
                )}
                {profile?.field && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">分野</label>
                    <p className="text-gray-800 text-medium">{profile.field}</p>
                  </div>
                )}
                {profile?.gradYear && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">卒業年</label>
                    <p className="text-gray-800 text-medium">{profile.gradYear}年</p>
                  </div>
                )}
              </div>
            </div>

            {/* 個人情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-main-500 rounded mr-3"></span>
                個人情報
              </h3>
              <div className="space-y-3">
                {profile?.gender && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">性別</label>
                    <p className="text-gray-800 text-medium">{profile.gender}</p>
                  </div>
                )}
                {profile?.area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">居住地</label>
                    <p className="text-gray-800 text-medium">{profile.area}</p>
                  </div>
                )}
                {profile?.phone1 && profile?.phone2 && profile?.phone3 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">電話番号</label>
                    <p className="text-gray-800 text-medium">{profile.phone1}-{profile.phone2}-{profile.phone3}</p>
                  </div>
                )}
                {profile?.profile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">自己紹介</label>
                    <p className="text-gray-800">{profile.profile}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 機能カードセクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3">
            マイページ機能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300" onClick={() => router.push("/mypage/profile")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-main-100 rounded-lg flex items-center justify-center group-hover:bg-main-200 transition-colors">
                  <svg className="w-6 h-6 text-main-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-main-700 transition-colors">プロフィール編集</h3>
                  <p className="text-sm text-gray-600">ユーザー情報の編集</p>
                </div>
              </div>
            </div>
            <div className="group p-6 border border-gray-200 rounded-xl hover:border-main-300 shadow-lg transition-all duration-300" onClick={() => router.push("/mypage/applied")}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-main-100 rounded-lg flex items-center justify-center group-hover:bg-main-200 transition-colors">
                  <svg className="w-6 h-6 text-main-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6-4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 hover:text-main-700 transition-colors">応募した企業</h3>
                  <p className="text-sm text-gray-600">応募履歴の確認</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
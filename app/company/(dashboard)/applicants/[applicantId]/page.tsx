"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFirestore, query, where, getDocs, collectionGroup } from "firebase/firestore";
import app from "../../../../../lib/firebaseClient";
import { getAuth } from "firebase/auth";

type Application = {
  id: string;
  jobId: string;
  applicantId: string;
  applicantProfile: any; // 必要に応じて詳細型を定義
  appeal: string;
  createdAt: any; // Firestore Timestamp型の場合は適宜
  // 他のフィールドも追加
};

export default function ApplicantDetailPage() {
  const params = useParams();
  const applicantId = typeof params.applicantId === "string"
    ? params.applicantId
    : Array.isArray(params.applicantId)
      ? params.applicantId[0]
      : "";
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      const authUser = getAuth().currentUser;
      let companyId = "";
      if (authUser) {
        const token = await authUser.getIdTokenResult();
        companyId = String(token.claims.companyId || "");
      }
      if (!applicantId || !companyId) {
        setApplication(null);
        setLoading(false);
        return;
      }
      // collectionGroupでapplicantIdとcompanyIdが一致する応募を取得
      const appsSnap = await getDocs(
        query(
          collectionGroup(db, "userApplications"),
          where("applicantId", "==", applicantId),
          where("companyId", "==", companyId)
        )
      );
      // createdAt降順で最新の応募を取得
      const sorted = appsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApplication(sorted[0] || null);
      setLoading(false);
    };
    fetchData();
  }, [applicantId]);

  if (loading) return <div>読み込み中...</div>;
  if (!application) return <div>応募情報が見つかりませんでした。</div>;

  const profile = application.applicantProfile || {};

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">応募者詳細</h1>
      <div className="flex items-center gap-4 mb-4">
        {profile.iconUrl && <img src={profile.iconUrl} alt="icon" className="w-16 h-16 rounded-full border" />}
        <div>
          <div className="font-bold text-lg">{profile.name || "No Name"}</div>
          <div className="text-sm text-gray-600">{profile.email || ""}</div>
        </div>
      </div>
      {profile.selfIntro && (
        <div className="mb-4">
          <label className="block font-bold mb-1">自己紹介</label>
          <div className="bg-gray-50 rounded p-2 text-gray-700">{profile.selfIntro}</div>
        </div>
      )}

      {/* プロフィール詳細セクション */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3 mb-6">
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
              {profile.university && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">大学</label>
                  <p className="text-gray-800 text-medium">{profile.university}</p>
                </div>
              )}
              {profile.faculty && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">学部（研究科）</label>
                  <p className="text-gray-800 text-medium">{profile.faculty}</p>
                </div>
              )}
              {profile.department && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">専攻</label>
                  <p className="text-gray-800 text-medium">{profile.department}</p>
                </div>
              )}
              {profile.field && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">分野</label>
                  <p className="text-gray-800 text-medium">{profile.field}</p>
                </div>
              )}
              {profile.gradYear && (
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
              {profile.gender && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">性別</label>
                  <p className="text-gray-800 text-medium">{profile.gender}</p>
                </div>
              )}
              {profile.area && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">居住地</label>
                  <p className="text-gray-800 text-medium">{profile.area}</p>
                </div>
              )}
              {profile.phone1 && profile.phone2 && profile.phone3 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">電話番号</label>
                  <p className="text-gray-800 text-medium">{profile.phone1}-{profile.phone2}-{profile.phone3}</p>
                </div>
              )}
              {profile.profile && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-sm font-medium text-gray-600">自己紹介</label>
                  <p className="text-gray-800">{profile.profile}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ここまでプロフィール詳細セクション */}

      <div className="mb-4">
        <label className="block font-bold mb-1">アピール内容</label>
        <div className="bg-gray-50 rounded p-2 text-gray-700">{application.appeal || ""}</div>
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">応募日時</label>
        <div className="text-gray-600">
          {application.createdAt?.toDate ? application.createdAt.toDate().toLocaleString() : ""}
        </div>
      </div>
    </div>
  );
} 
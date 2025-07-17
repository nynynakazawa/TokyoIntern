"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFirestore, collection, getDocs, query, where, getDoc } from "firebase/firestore";
import app from "../../../../../lib/firebaseClient";

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
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore(app);
      // applicantIdでapplicationsコレクションから最新の応募を取得
      const q = query(collection(db, "applications"), where("applicantId", "==", params.applicantId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        // 最新の応募を表示（複数応募があれば一番新しいもの）
        const applicationDoc = await getDoc(snap.docs[0].ref);
        const application = {
          id: applicationDoc.id,
          ...applicationDoc.data(),
        } as Application;
        setApplication(application);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.applicantId]);

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
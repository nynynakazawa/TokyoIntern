"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import { getFirestore, doc, getDoc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JobApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [appeal, setAppeal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Firestoreからプロフィール取得
        const db = getFirestore(app);
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const db = getFirestore(app);
    // 1. jobIdから求人情報を取得
    const jobId = String(params.id);
    const jobDoc = await getDoc(doc(db, "jobs", jobId));
    let companyId = "";
    if (jobDoc.exists()) {
      const jobData = jobDoc.data();
      companyId = jobData.companyId || "";
    } else {
      alert("求人情報が見つかりませんでした");
      setSubmitting(false);
      return;
    }
    // applicationsコレクションに保存（jobId+userIdでユニーク）
    const ref = doc(collection(db, "applications"), `${jobId}_${user.uid}`);
    await setDoc(ref, {
      jobId,
      companyId, // ←必ずセット
      applicantId: user.uid,
      applicantProfile: {
        name: user.displayName || profile?.name || "",
        email: user.email || profile?.email || "",
        selfIntro: profile?.selfIntro || "",
        iconUrl: profile?.iconUrl || "",
        phone1: profile?.phone1 || "",
        phone2: profile?.phone2 || "",
        phone3: profile?.phone3 || "",
      },
      appeal,
      createdAt: serverTimestamp(),
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">応募が完了しました</h1>
        <button 
          type="submit" 
          className="w-full rounded-lg bg-main-600 py-3 px-6 font-semibold text-white text-lg shadow hover:bg-main-700 transition active:scale-95 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => router.push("/jobs")}>求人一覧に戻る</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">応募フォーム</h1>
      {user && (
        <>
          <div className="mb-6 bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-main-700 border-b border-gray-200 pb-2 mb-4">プロフィール情報</h2>
            <div className="text-center mb-6">
            <div className="font-bold text-2xl text-gray-800">{profile?.name || user.displayName || "未設定"}</div>
            {profile?.selfIntro && (
              <div className="text-gray-700 italic mt-2">"{profile.selfIntro}"</div>
            )}
            {/* displayNameとemailをプロフィール情報の真下に中央揃えで表示 */}
            <div className="mt-2">
              <div className="text-gray-500 text-sm">{user.email}</div>
            </div>
          </div>
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
                      <p className="text-gray-800 font-medium">{profile.university}</p>
                    </div>
                  )}
                  {profile?.faculty && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">学部（研究科）</label>
                      <p className="text-gray-800 font-medium">{profile.faculty}</p>
                    </div>
                  )}
                  {profile?.department && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">専攻</label>
                      <p className="text-gray-800 font-medium">{profile.department}</p>
                    </div>
                  )}
                  {profile?.field && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">分野</label>
                      <p className="text-gray-800 font-medium">{profile.field}</p>
                    </div>
                  )}
                  {profile?.gradYear && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">卒業年</label>
                      <p className="text-gray-800 font-medium">{profile.gradYear}年</p>
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
                      <p className="text-gray-800 font-medium">{profile.gender}</p>
                    </div>
                  )}
                  {profile?.area && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">居住地</label>
                      <p className="text-gray-800 font-medium">{profile.area}</p>
                    </div>
                  )}
                  {profile?.phone1 && profile?.phone2 && profile?.phone3 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">電話番号</label>
                      <p className="text-gray-800 font-medium">{profile.phone1}-{profile.phone2}-{profile.phone3}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <form onSubmit={handleSubmit} className="mt-8 bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div>
          <label className="block text-lg font-bold text-main-700 mb-2">自身のアピール</label>
          <Textarea 
            value={appeal} 
            onChange={e => setAppeal(e.target.value)} 
            rows={5} 
            required 
            placeholder="志望動機や自己PRなど"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none text-base shadow-sm bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-2">※ 志望動機や自己PRなどを自由にご記入ください</p>
        </div>
        <button 
          type="submit" 
          className="w-full rounded-lg bg-main-600 py-3 px-6 font-semibold text-white text-lg shadow hover:bg-main-700 transition active:scale-95 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={submitting}
        >
          {submitting ? "送信中..." : "送信"}
        </button>
      </form>
    </div>
  );
} 
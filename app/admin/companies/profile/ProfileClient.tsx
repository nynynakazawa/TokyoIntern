"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";

export default function ProfileClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("companyId") || "";

  const [companyName, setCompanyName] = useState("");
  const [profile, setProfile] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    const fetchCompany = async () => {
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
      setLoading(false);
    };
    fetchCompany();
  }, [companyId]);

  const handleSave = async () => {
    const db = getFirestore(app);
    const ref = doc(db, "companies", companyId);
    await updateDoc(ref, {
      name: companyName,
      profile,
      iconUrl,
      area,
      phone,
      website,
    });
    setEditMode(false);
    alert("保存しました");
  };

  if (!companyId) return <div className="p-8">企業IDが指定されていません</div>;
  if (loading) return <div className="p-8">読み込み中...</div>;

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
              {editMode ? (
                <input
                  className="text-3xl font-bold text-gray-800 mb-2 w-full border-b"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{companyName || "未設定"}</h1>
              )}
              {editMode ? (
                <textarea
                  className="text-gray-700 italic w-full border-b"
                  value={profile}
                  onChange={e => setProfile(e.target.value)}
                />
              ) : (
                profile && <p className="text-gray-700 italic">"{profile}"</p>
              )}
            </div>
          </div>
        </div>

        {/* 企業詳細セクション */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3">企業詳細</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-main-500 rounded mr-3"></span>
                基本情報
              </h3>
              <div className="space-y-3">
                {editMode ? (
                  <input
                    className="bg-gray-50 rounded-lg p-4 w-full border"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                ) : (
                  companyName && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">企業名</label>
                      <p className="text-gray-800 text-medium">{companyName}</p>
                    </div>
                  )
                )}
                {editMode ? (
                  <textarea
                    className="bg-gray-50 rounded-lg p-4 w-full border"
                    value={profile}
                    onChange={e => setProfile(e.target.value)}
                  />
                ) : (
                  profile && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">企業プロフィール</label>
                      <p className="text-gray-800">{profile}</p>
                    </div>
                  )
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
                {editMode ? (
                  <input
                    className="bg-gray-50 rounded-lg p-4 w-full border"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                  />
                ) : (
                  area && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">所在地</label>
                      <p className="text-gray-800 text-medium">{area}</p>
                    </div>
                  )
                )}
                {editMode ? (
                  <input
                    className="bg-gray-50 rounded-lg p-4 w-full border"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                ) : (
                  phone && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-sm font-medium text-gray-600">電話番号</label>
                      <p className="text-gray-800 text-medium">{phone}</p>
                    </div>
                  )
                )}
                {editMode ? (
                  <input
                    className="bg-gray-50 rounded-lg p-4 w-full border"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />
                ) : (
                  website && (
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
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 編集ボタン */}
        <div className="flex gap-4">
          {editMode ? (
            <>
              <button className="px-6 py-2 bg-main-600 text-white rounded-lg" onClick={handleSave}>保存</button>
              <button className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg" onClick={() => setEditMode(false)}>キャンセル</button>
            </>
          ) : (
            <button className="px-6 py-2 bg-main-600 text-white rounded-lg" onClick={() => setEditMode(true)}>編集</button>
          )}
        </div>
      </div>
    </main>
  );
} 
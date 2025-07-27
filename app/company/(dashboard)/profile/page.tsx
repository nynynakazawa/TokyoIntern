"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../../components/ImageUpload";
import AreaFilter from "../../../../components/Filters/AreaFilter";
import LoadingAnimation from "../../../../components/LoadingAnimation";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [profile, setProfile] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [area, setArea] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdTokenResult();
        setCompanyId(typeof token.claims.companyId === "string" ? token.claims.companyId : "");
        setRole(typeof token.claims.role === "string" ? token.claims.role : "");
        if (typeof token.claims.companyId === "string" && token.claims.companyId) {
          const db = getFirestore(app);
          const ref = doc(collection(db, "companies"), token.claims.companyId as string);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setCompanyName(data.name || "");
            setProfile(data.profile || "");
            setIconUrl(data.iconUrl || "");
            setArea(data.area || "");
            // 電話番号を3つの部分に分割
            if (data.phone) {
              const phoneParts = data.phone.split('-');
              setPhone1(phoneParts[0] || "");
              setPhone2(phoneParts[1] || "");
              setPhone3(phoneParts[2] || "");
            }
            setWebsite(data.website || "");
          }
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!companyId) return;
    const db = getFirestore(app);
    const ref = doc(collection(db, "companies"), companyId as string);
    
    // 電話番号を結合
    const phone = [phone1, phone2, phone3].filter(Boolean).join('-');
    
    await setDoc(ref, {
      name: companyName,
      profile,
      iconUrl,
      area,
      phone,
      website,
    }, { merge: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.push("/company");
  };

  if (loading) return <LoadingAnimation />;

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-5xl px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-8 text-center text-main-700">企業プロフィール編集</h1>
          {saved && <p className="text-green-600 text-center font-semibold mb-4">保存しました！</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 基本情報 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">企業名</label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">企業プロフィール</label>
                <textarea className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none"
                  rows={4} value={profile} onChange={e => setProfile(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">所在地</label>
                <AreaFilter value={area} onChange={setArea} />
              </div>
            </div>

            {/* 連絡先情報とアイコン */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                <div className="flex gap-2">
                  <Input 
                    value={phone1} 
                    onChange={e => setPhone1(e.target.value)}
                    placeholder="03"
                    maxLength={4}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" 
                  />
                  <span className="flex items-center text-gray-500">-</span>
                  <Input 
                    value={phone2} 
                    onChange={e => setPhone2(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" 
                  />
                  <span className="flex items-center text-gray-500">-</span>
                  <Input 
                    value={phone3} 
                    onChange={e => setPhone3(e.target.value)}
                    placeholder="5678"
                    maxLength={4}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">企業HP</label>
                <Input 
                  value={website} 
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">企業アイコン</label>
                <ImageUpload onImageUpload={setIconUrl} currentImageUrl={iconUrl} />
              </div>
            </div>
          </div>

          <Button onClick={handleSave}
            className="w-full rounded-lg bg-main-600 py-2 px-6 font-semibold text-white shadow hover:bg-main-700 transition active:scale-95 mt-8">
            保存
          </Button>
        </div>
      </div>
    </main>
  );
} 
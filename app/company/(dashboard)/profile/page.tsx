"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../../components/ImageUpload";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [profile, setProfile] = useState("");
  const [iconUrl, setIconUrl] = useState("");
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
    await setDoc(ref, {
      name: companyName,
      profile,
      iconUrl,
    }, { merge: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.push("/company");
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-8 text-center text-main-700">企業プロフィール編集</h1>
        {saved && <p className="text-green-600 text-center font-semibold mb-4">保存しました！</p>}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">企業アイコン</label>
            <ImageUpload onImageUpload={setIconUrl} currentImageUrl={iconUrl} />
          </div>
        </div>
        <Button onClick={handleSave}
          className="w-full rounded-lg bg-main-600 py-2 px-6 font-semibold text-white shadow hover:bg-main-700 transition active:scale-95 mt-8">
          保存
        </Button>
      </div>
    </main>
  );
} 
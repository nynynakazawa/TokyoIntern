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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdTokenResult();
        setCompanyId(typeof token.claims.companyId === "string" ? token.claims.companyId : "");
        setRole(typeof token.claims.role === "string" ? token.claims.role : "");
        // Firestoreから企業情報取得
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
    alert("保存しました");
    router.push("/company");
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">企業プロフィール編集</h1>
      <div className="mb-4">
        <label className="block font-bold mb-1">ユーザー名</label>
        <Input value={user?.displayName || ""} disabled />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">企業名</label>
        <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">企業プロフィール</label>
        <textarea className="w-full border rounded p-2" rows={4} value={profile} onChange={e => setProfile(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">企業アイコン</label>
        <ImageUpload onImageUpload={setIconUrl} currentImageUrl={iconUrl} />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">ユーザーID</label>
        <Input value={user?.uid || ""} disabled />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">企業ID</label>
        <Input value={companyId} disabled />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">ロール</label>
        <Input value={role} disabled />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
} 
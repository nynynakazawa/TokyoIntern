"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { updateProfile } from "firebase/auth";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        // Firestoreからユーザー情報取得
        const db = getFirestore(app);
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data.profile || "");
          setIconUrl(data.iconUrl || "");
        }
        setLoading(false);
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    // Firebase AuthのdisplayNameも更新
    await updateProfile(user, { displayName: name, photoURL: iconUrl });
    // Firestoreに保存
    const db = getFirestore(app);
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      profile,
      iconUrl,
      name,
      email,
    }, { merge: true });
    alert("保存しました");
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>
      <div className="mb-4">
        <label className="block font-bold mb-1">名前</label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">メールアドレス</label>
        <Input value={email} disabled />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">自己紹介</label>
        <textarea className="w-full border rounded p-2" rows={4} value={profile} onChange={e => setProfile(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">アイコン</label>
        <ImageUpload onImageUpload={setIconUrl} currentImageUrl={iconUrl} />
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-1">ユーザーID</label>
        <Input value={user?.uid || ""} disabled />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import AreaFilter from "../../../components/Filters/AreaFilter";
import LoadingAnimation from "../../../components/LoadingAnimation";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [university, setUniversity] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [field, setField] = useState(""); // 文系/理系
  const [gradYear, setGradYear] = useState("");
  const [gender, setGender] = useState("");
  const [area, setArea] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");

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
          setUniversity(data.university || "");
          setFaculty(data.faculty || "");
          setDepartment(data.department || "");
          setField(data.field || "");
          setGradYear(data.gradYear || "");
          setGender(data.gender || "");
          setArea(data.area || "");
          setPhone1(data.phone1 || "");
          setPhone2(data.phone2 || "");
          setPhone3(data.phone3 || "");
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
    // await updateProfile(user, { displayName: name, photoURL: iconUrl }); // This line was removed as per the new_code
    const db = getFirestore(app);
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      profile,
      iconUrl,
      name,
      email,
      university,
      faculty,
      department,
      field,
      gradYear,
      gender,
      area,
      phone1,
      phone2,
      phone3,
    }, { merge: true });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/mypage");
    }, 2000);
  };

  if (loading) return <LoadingAnimation />;

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-5xl px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-8 text-center text-main-700">プロフィール編集</h1>
          {saved && <p className="text-green-600 text-center font-semibold mb-4">保存しました！</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 基本情報 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
                <Input value={name} onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
                <textarea className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition resize-none"
                  rows={4} value={profile} onChange={e => setProfile(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition"
                >
                  <option value="">選択してください</option>
                  <option value="男性">男性</option>
                  <option value="女性">女性</option>
                  <option value="その他">その他</option>
                  <option value="回答しない">回答しない</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">居住地</label>
                <AreaFilter value={area} onChange={setArea} />
              </div>
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
            </div>

            {/* 学歴情報とアイコン */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">大学</label>
                <Input value={university} onChange={e => setUniversity(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学部（研究科）</label>
                <Input value={faculty} onChange={e => setFaculty(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">専攻</label>
                <Input value={department} onChange={e => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分野</label>
                <Input value={field} onChange={e => setField(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">卒業年</label>
                <Input value={gradYear} onChange={e => setGradYear(e.target.value)}
                  type="number" min="2000" max="2030" placeholder="例: 2025"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-main-300 focus:border-main-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プロフィール画像</label>
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
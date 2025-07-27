"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AdminContentWrapper from "../../../../components/AdminContentWrapper";
import { confirmDelete } from "../../../../lib/utils/deleteConfirmation";

interface UserProfile {
  email: string;
  name?: string;
  displayName?: string;
  university?: string;
  faculty?: string;
  department?: string;
  field?: string;
  gradYear?: string;
  gender?: string;
  area?: string;
  phone?: string;
  profile?: string;
  iconUrl?: string;
  role?: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<(UserProfile & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!params.id) return;
      
      const db = getFirestore(app);
      const userRef = doc(db, "users", params.id as string);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUser({
          id: userSnap.id,
          ...userSnap.data() as UserProfile,
          email: userSnap.data().email || "",
          name: userSnap.data().name || "",
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [params.id]);

  const handleDelete = async () => {
    if (await confirmDelete("このユーザーを削除しますか？")) {
      try {
        setDeleting(true);
        const db = getFirestore(app);
        await deleteDoc(doc(db, "users", params.id as string));
        alert("ユーザーを削除しました。");
        router.push("/admin/users");
      } catch (error) {
        alert("削除中にエラーが発生しました。");
        console.error(error);
      } finally {
        setDeleting(false);
      }
    }
  };

  if (loading) return <LoadingAnimation />;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">ユーザーが見つかりませんでした</p>
          <Button
            variant="link"
            className="text-main-600 hover:text-main-700 mt-2"
            onClick={() => router.push("/admin/users")}
          >
            ユーザー一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AdminContentWrapper>
      <div className="flex flex-col gap-6">
        {/* 戻るボタンと削除ボタン */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => router.push("/admin/users")}
          >
            <ArrowLeft size={16} />
            ユーザー一覧に戻る
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "削除中..." : "ユーザーを削除"}
          </Button>
        </div>

        {/* ユーザーヘッダー */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-6">
            {user.iconUrl ? (
              <img
                src={user.iconUrl}
                alt={`${user.name}のアイコン`}
                className="w-24 h-24 rounded-full border-4 border-main-100 shadow-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-main-100 bg-gradient-to-br from-main-100 to-main-200 flex items-center justify-center text-main-600 font-bold text-2xl shadow-lg">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              {user.role && (
                <span className="inline-block bg-main-100 text-main-600 px-3 py-1 rounded-full text-sm font-medium mt-2">
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ユーザー詳細情報 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-main-700 border-b border-gray-200 pb-3 mb-6">
            ユーザー詳細情報
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 学歴情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-main-500 rounded mr-3"></span>
                学歴情報
              </h3>
              <div className="space-y-3">
                {user.university && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">大学</label>
                    <p className="text-gray-800">{user.university}</p>
                  </div>
                )}
                {user.faculty && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">学部</label>
                    <p className="text-gray-800">{user.faculty}</p>
                  </div>
                )}
                {user.department && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">学科</label>
                    <p className="text-gray-800">{user.department}</p>
                  </div>
                )}
                {user.field && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">専攻</label>
                    <p className="text-gray-800">{user.field}</p>
                  </div>
                )}
                {user.gradYear && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">卒業年度</label>
                    <p className="text-gray-800">{user.gradYear}</p>
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
                {user.gender && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">性別</label>
                    <p className="text-gray-800">{user.gender}</p>
                  </div>
                )}
                {user.area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">居住地</label>
                    <p className="text-gray-800">{user.area}</p>
                  </div>
                )}
                {user.phone && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">電話番号</label>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                )}
                {user.profile && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-600">自己紹介</label>
                    <p className="text-gray-800">{user.profile}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminContentWrapper>
  );
} 
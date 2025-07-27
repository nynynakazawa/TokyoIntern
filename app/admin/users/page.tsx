"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import LoadingAnimation from "../../../components/LoadingAnimation";
import AdminContentWrapper from "../../../components/AdminContentWrapper";
import { confirmDelete } from "../../../lib/utils/deleteConfirmation";

interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  iconUrl?: string;
  photoURL?: string;
  createdAt?: any;
  role?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(app);
      const usersRef = collection(db, "users");
      const snap = await getDocs(usersRef);
      const userList: User[] = await Promise.all(
        snap.docs
          .map(async docSnap => {
            const data = docSnap.data() as User;
            return {
              id: docSnap.id,
              email: data.email,
              name: data.name,
              displayName: data.displayName,
              iconUrl: data.iconUrl,
              photoURL: data.photoURL,
              createdAt: data.createdAt,
              role: data.role,
            };
          })
      ).then(arr =>
        arr.filter(user => user.role === undefined || user.role === null || user.role === "")
      );
      // 新着順ソート
      userList.sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return bDate - aDate;
      });
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // ユーザー名の優先順位: name > displayName > email
  const getDisplayName = (user: User) => user.name || user.displayName || user.email || "-";
  // アイコンの優先順位: iconUrl > photoURL > イニシャル
  const getUserIcon = (user: User) => {
    if (user.iconUrl) return <img src={user.iconUrl} alt="icon" className="w-10 h-10 rounded-full border bg-white object-cover" />;
    if (user.photoURL) return <img src={user.photoURL} alt="icon" className="w-10 h-10 rounded-full border bg-white object-cover" />;
    const initial = getDisplayName(user).charAt(0).toUpperCase();
    return <div className="w-10 h-10 rounded-full border bg-gray-200 flex items-center justify-center text-main-600 font-bold text-lg">{initial}</div>;
  };

  const handleDelete = async (userId: string) => {
    if (await confirmDelete("このユーザーを削除しますか？")) {
      try {
        setDeleting(userId);
        const db = getFirestore(app);
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter(user => user.id !== userId));
        alert("ユーザーを削除しました。");
      } catch (error) {
        alert("削除中にエラーが発生しました。");
        console.error(error);
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <AdminContentWrapper fullWidth>
      <div className="w-full px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">一般ユーザー一覧（新着順）</h1>
        </div>
        <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">アイコン</th>
              <th className="py-3 px-4 text-left">表示名</th>
              <th className="py-3 px-4 text-left">ユーザーID</th>
              <th className="py-3 px-4 text-left">メールアドレス</th>
              <th className="py-3 px-4 text-left">登録日</th>
              <th className="py-3 px-4 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b last:border-none">
                <td className="py-2 px-4">{getUserIcon(user)}</td>
                <td className="py-2 px-4">{getDisplayName(user)}</td>
                <td className="py-2 px-4 font-mono text-xs">{user.id}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : ""}</td>
                <td className="py-2 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="mr-2"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    詳細
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                    disabled={deleting === user.id}
                  >
                    {deleting === user.id ? "削除中..." : "削除"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminContentWrapper>
  );
} 
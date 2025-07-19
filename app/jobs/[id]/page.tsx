"use client";

import { useParams } from "next/navigation";
import { useJobs } from "@/hook/useJobs";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState, useEffect } from "react";

export default function JobDetailPage() {
  const params = useParams();
  const { jobs, loading } = useJobs();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState("");
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const token = await currentUser.getIdTokenResult();
        setRole(typeof token.claims.role === "string" ? token.claims.role : "");
        setCompanyId(typeof token.claims.companyId === "string" ? token.claims.companyId : "");
      } else {
        setRole("");
        setCompanyId("");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleApply = async () => {
    if (!user) {
      // 未ログイン時はGoogleログイン→応募フォーム遷移
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try {
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
          router.push(`/jobs/${params.id}/apply`);
        }
      } catch (e) {
        alert("ログインに失敗しました");
        console.error(e);
      }
    } else {
      // ログイン済みなら直接応募フォームへ
      router.push(`/jobs/${params.id}/apply`);
    }
  };

  if (loading) return <div>読み込み中...</div>;

  // idが一致する求人を取得
  const job = jobs.find((j) => j.id === params.id);

  if (!job) return <div>求人が見つかりませんでした</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* サムネイル */}
        <div className="flex-shrink-0 w-full md:w-96 aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={job.thumbnail ?? "/noimage.png"}
            alt="サムネイル"
            className="w-full h-full object-cover object-center"
            style={{ aspectRatio: "4/3" }}
          />
        </div>
        {/* メイン情報 */}
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
          <div className="text-lg font-semibold text-main-600 mb-2">
            {job.wageMax ?
              `時給 ¥${job.wageMin.toLocaleString()}~${job.wageMax.toLocaleString()}` :
              `時給 ¥${job.wageMin.toLocaleString()}`
            }
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
            {job.area && <span>勤務地: {job.area}</span>}
            {job.occupation && <span>職種: {job.occupation}</span>}
          </div>
          {job.conditions && <div className="text-sm text-gray-700">条件: {job.conditions}</div>}
          {job.duties && <div className="text-sm text-gray-700">業務内容: {job.duties}</div>}
          {job.notes && <div className="text-sm text-gray-700">備考: {job.notes}</div>}
          {/* 企業情報 */}
          <div
            className="flex items-center gap-3 mt-4 cursor-pointer hover:opacity-80"
            onClick={() => job.companyId && router.push(`/companies/${job.companyId}`)}
          >
            {job.companyLogo && (
              <img src={job.companyLogo} alt="企業ロゴ" className="w-10 h-10 rounded-full border" />
            )}
            <span className="font-bold text-main-700">{job.companyName ?? ""}</span>
          </div>
        </div>
      </div>
      {/* 詳細説明 */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-2">仕事内容</h2>
        <p>{job.description}</p>
      </section>
      {/* ボタン表示ロジック */}
      {(() => {
        const myCompanyId = companyId || "";
        const jobCompanyId = job.companyId || "";
        // adminロールまたはcompanyロールかつ自社求人の場合
        if (role === "admin" || (role === "company" && myCompanyId && jobCompanyId && myCompanyId === jobCompanyId)) {
          return (
            <div className="mt-8 flex justify-center">
              <button
                className="btn-primary px-8 py-3 rounded text-lg"
                onClick={() => router.push(`/company/jobs/${params.id}/edit`)}
              >
                求人を修正する
              </button>
            </div>
          );
        }
        // companyロールかつ他社求人の場合はボタンを表示しない
        if (role === "company" && myCompanyId && jobCompanyId && myCompanyId !== jobCompanyId) {
          return null;
        }
        // ownerロールまたは一般ユーザーの場合は従来通り応募ボタン
        return (
          <div className="mt-8 flex justify-center">
            <button
              className="btn-primary px-8 py-3 rounded text-lg"
              onClick={handleApply}
            >
              企業に応募する
            </button>
          </div>
        );
      })()}
    </main>
  );
}
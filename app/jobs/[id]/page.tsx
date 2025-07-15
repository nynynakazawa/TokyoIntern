"use client";

import { useParams } from "next/navigation";
import { useJobs } from "@/hook/useJobs";

export default function JobDetailPage() {
  const params = useParams();
  const { jobs, loading } = useJobs();

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
          <div className="flex items-center gap-3 mt-4">
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
    </main>
  );
}
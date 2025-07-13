"use client";

import { useParams } from "next/navigation";
import { useJobs } from "@/hook/useJobs";
import JobCard from "../../../components/JobCard";

export default function JobDetailPage() {
  const params = useParams();
  const { jobs, loading } = useJobs();

  if (loading) return <div>読み込み中...</div>;

  // idが一致する求人を取得
  const job = jobs.find((j) => j.id === params.id);

  if (!job) return <div>求人が見つかりませんでした</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      {/* 既存のUIをそのまま活かす */}
      <JobCard job={job} />
      {/* ここに詳細情報や他のUIを追加してもOK */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-2">仕事内容</h2>
        <p>{job.description}</p>
        {/* 必要に応じて他のフィールドも表示 */}
      </section>
    </main>
  );
}
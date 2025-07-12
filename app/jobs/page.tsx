// app/jobs/page.tsx  ―  求人一覧（簡易フィルター付）
import { mockJobs } from "../../lib/mock-data";
import JobCard from "../../components/JobCard";

export const dynamic = "force-static";

export default function JobList() {
  // モック：クエリ文字列は無視して全件表示
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">求人一覧</h1>

      {/* --- フィルター UI は後で実装 --- */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="tag py-2 px-5 text-base">エリア</button>
        <button className="tag py-2 px-5 text-base">職種</button>
        <button className="tag py-2 px-5 text-base">業界</button>
      </div>

      {/* --- 求人カード --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </main>
  );
}
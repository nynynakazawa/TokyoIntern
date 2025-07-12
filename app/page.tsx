// app/page.tsx  ―  トップページ “/”
import Link from "next/link";
import JobCard from "../components/JobCard";
import { mockJobs } from "../lib/mock-data";

export const dynamic = "force-static"; // 100% 静的ビルド (モック)

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">
        TokyoIntern
        <br className="block md:hidden" />
        モックへようこそ
      </h1>
      <p className="mb-6">
        学生向けインターンを簡単検索。
        <br className="block md:hidden" />
        会員登録せずに UI 遷移だけ体験できます。
      </p>
      <Link
        href="/jobs"
        className="inline-block rounded bg-main-600 py-3 px-6 font-semibold text-white hover:bg-main-700"
      >
        求人一覧を見る
      </Link>

      {/* --- 求人カード --- */}
      <div className="mt-10 w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </main>
  );
}
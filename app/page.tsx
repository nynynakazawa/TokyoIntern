// app/page.tsx
import Link from "next/link";
import JobList from "../src/JobList";

export const dynamic = "force-static"; // 必要なら残す

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] max-w-5xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">
        トウキョウインターン
        <br className="block md:hidden" />
        へようこそ
      </h1>
      <p className="mb-6">
        学生向けインターンを簡単検索。
        <br className="block md:hidden" />
        やりたいことが見つかる。
      </p>
      <Link
        href="/jobs"
        className="inline-block rounded bg-main-600 py-3 px-6 font-semibold text-white hover:bg-main-700"
      >
        求人一覧を見る
      </Link>

      {/* --- 求人カード --- */}
      <div className="mt-10 w-full">
        <JobList limit={3} />
      </div>
    </main>
  );
}
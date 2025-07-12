// app/jobs/[id]/page.tsx  ―  求人詳細
import { mockJobs } from "../../../lib/mock-data";
import Link from "next/link";
import Image from "next/image";

// 型注釈を外す
export function generateMetadata({ params }) {
  const job = mockJobs.find((j) => j.id === params.id);
  return { title: job ? `${job.title}｜TokyoIntern` : "求人詳細" };
}

export default function JobDetail({ params }) {
  const job = mockJobs.find((j) => j.id === params.id);
  if (!job) return <h1 className="p-10">求人が見つかりません</h1>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="mb-4 text-gray-600">
        {job.area} / {job.occupation}
      </p>

      {/* サムネイル画像 */}
      {job.thumbnail && (
        <div className="mx-auto w-4/5 md:w-1/2 mb-6">
          <Image
            src={job.thumbnail}
            alt={job.title}
            width={800}
            height={450}
            className="w-full h-auto rounded-lg shadow"
            style={{ aspectRatio: "16/9" }}
          />
        </div>
      )}

      <section className="mb-8">
        <h2 className="font-semibold text-main-600 mb-1">時給</h2>
        <p>¥{job.wage.toLocaleString()}</p>
      </section>

      {/* 条件・業務内容・その他事項 */}
      {job.conditions && (
        <section className="mb-4">
          <h2 className="font-semibold text-main-600 mb-1">条件</h2>
          <p>{job.conditions}</p>
        </section>
      )}
      {job.duties && (
        <section className="mb-4">
          <h2 className="font-semibold text-main-600 mb-1">業務内容</h2>
          <p>{job.duties}</p>
        </section>
      )}
      {job.notes && (
        <section className="mb-4">
          <h2 className="font-semibold text-main-600 mb-1">その他事項</h2>
          <p>{job.notes}</p>
        </section>
      )}

      <Link
        href="/jobs"
        className="inline-block mt-4 rounded border px-4 py-2 text-sm hover:bg-gray-50"
      >
        ← 一覧に戻る
      </Link>
    </main>
  );
}
"use client";

import { useSearchParams } from "next/navigation";
import { useJobs } from "@/hook/useJobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteJob } from "../../../../lib/serverActions/jobActions";
import { useState } from "react";

export default function JobsTable() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") || undefined;
  const { jobs, loading } = useJobs(companyId);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 企業名を最初の求人から取得（なければ空文字）
  const companyName = jobs.length > 0 ? jobs[0].companyName || "" : "";

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      setDeleting(id);
      await deleteJob(id);
      setDeleting(null);
    }
  };

  return (
    <>
      {!companyId && <div className="p-8">企業IDが指定されていません</div>}
      {companyId && loading && <div className="p-8">読み込み中...</div>}
      {companyId && !loading && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {companyName && <span>{companyName} </span>}
              <span>（企業ID: {companyId}）</span>
            </h1>
            <Link href={`/admin/companies/profile?companyId=${companyId}`}>
              <Button>企業詳細</Button>
            </Link>
          </div>
          <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">タイトル</th>
                <th className="py-3 px-4 text-left">給与</th>
                <th className="py-3 px-4 text-left">作成日</th>
                <th className="py-3 px-4 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b last:border-none">
                  <td className="py-2 px-4">{job.title}</td>
                  <td className="py-2 px-4">
                    {job.wageMax ?
                      `¥${job.wageMin.toLocaleString()}~${job.wageMax.toLocaleString()}` :
                      `¥${job.wageMin.toLocaleString()}`
                    }
                  </td>
                  <td className="py-2 px-4">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</td>
                  <td className="py-2 px-4">
                    <Link href={`/admin/companies/jobs/${job.id}/edit?companyId=${companyId}`}>
                      <Button size="sm" variant="outline" className="mr-2">編集</Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)} disabled={deleting === job.id}>
                      {deleting === job.id ? "削除中..." : "削除"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
} 
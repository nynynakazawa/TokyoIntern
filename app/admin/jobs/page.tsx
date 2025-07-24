"use client";

import { useJobs } from "@/hook/useJobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteJob } from "../../../lib/serverActions/jobActions";
import { useState } from "react";

export default function AdminAllJobsPage() {
  const { jobs, loading } = useJobs(); // companyIdなしで全件取得
  const [deleting, setDeleting] = useState<string | null>(null);

  // 新着順（createdAt降順）でソート
  const sortedJobs = [...jobs].sort((a, b) => {
    const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bDate - aDate;
  });

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      setDeleting(id);
      await deleteJob(id);
      setDeleting(null);
    }
  };

  return (
    <>
      {loading ? (
        <div className="p-8">読み込み中...</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">全求人一覧（新着順）</h1>
          </div>
          <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">タイトル</th>
                <th className="py-3 px-4 text-left">企業名</th>
                <th className="py-3 px-4 text-left">企業ID</th>
                <th className="py-3 px-4 text-left">給与</th>
                <th className="py-3 px-4 text-left">作成日</th>
                <th className="py-3 px-4 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.map((job) => (
                <tr key={job.id} className="border-b last:border-none">
                  <td className="py-2 px-4">{job.title}</td>
                  <td className="py-2 px-4">{job.companyName}</td>
                  <td className="py-2 px-4 font-mono text-xs">{job.companyId}</td>
                  <td className="py-2 px-4">
                    {job.wageMax ?
                      `¥${job.wageMin.toLocaleString()}~${job.wageMax.toLocaleString()}` :
                      `¥${job.wageMin.toLocaleString()}`
                    }
                  </td>
                  <td className="py-2 px-4">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</td>
                  <td className="py-2 px-4">
                    <Link href={`/admin/companies/jobs/${job.id}/edit?companyId=${job.companyId}`}>
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
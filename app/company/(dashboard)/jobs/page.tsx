"use client";

import { useJobs } from "@/hook/useJobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteJob } from "../../../../lib/serverActions/jobActions";
import { useEffect, useState } from "react";
import { auth } from "../../../../lib/firebaseClient";

export default function JobListTable() {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdTokenResult();
        setCompanyId((token.claims.companyId as string) ?? null);
      }
    };
    fetchCompanyId();
  }, []);

  const { jobs, loading } = useJobs(companyId || undefined);

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      await deleteJob(id);
      // useJobsはonSnapshotなので自動で再取得される
    }
  };

  if (!companyId) return <div>企業情報を取得中...</div>;
  if (loading) return <div>読み込み中...</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">求人管理</h1>
        <Link href="/company/jobs/new">
          <Button>新規求人作成</Button>
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
                <Link href={`/company/jobs/${job.id}/edit`}>
                  <Button size="sm" variant="outline" className="mr-2">編集</Button>
                </Link>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
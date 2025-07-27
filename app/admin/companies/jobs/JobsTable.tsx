"use client";

import { useSearchParams } from "next/navigation";
import { useJobs } from "@/hook/useJobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteJob } from "../../../../lib/serverActions/jobActions";
import { useState } from "react";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import AdminContentWrapper from "../../../../components/AdminContentWrapper";
import { confirmDelete } from "../../../../lib/utils/deleteConfirmation";

export default function JobsTable() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId") || undefined;
  const { jobs, loading } = useJobs(companyId);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (await confirmDelete("この求人を削除しますか？")) {
      try {
        setDeleting(id);
        await deleteJob(id);
      } catch (error) {
        alert("削除中にエラーが発生しました。");
        console.error(error);
      } finally {
        setDeleting(null);
      }
    }
  };

  if (!companyId) return <div className="p-8">企業IDが指定されていません</div>;
  if (loading) return <LoadingAnimation />;

  return (
    <AdminContentWrapper fullWidth>
      <div className="flex items-center justify-between mb-6 px-4">
        <Link href="/admin/companies">
          <Button variant="outline" className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            企業一覧に戻る
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-center">
          求人管理
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
                <Link href={`/admin/jobs/${job.id}/edit?companyId=${companyId}`}>
                  <Button size="sm" variant="outline" className="mr-2">編集</Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(job.id)}
                  disabled={deleting === job.id}
                >
                  {deleting === job.id ? "削除中..." : "削除"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminContentWrapper>
  );
} 
"use client";

import { useJobs } from "@/hook/useJobs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">求人管理</h1>
        <Link href="/company/jobs/new">
          <Button>新規求人作成</Button>
        </Link>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>タイトル</TableHead>
            <TableHead>給与</TableHead>
            <TableHead>作成日</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>
                {job.wageMax ?
                  `¥${job.wageMin.toLocaleString()}~${job.wageMax.toLocaleString()}` :
                  `¥${job.wageMin.toLocaleString()}`
                }
              </TableCell>
              <TableCell>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ""}</TableCell>
              <TableCell>
                <Link href={`/company/jobs/${job.id}/edit`}>
                  <Button size="sm" variant="outline" className="mr-2">編集</Button>
                </Link>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>
                  削除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
import { Suspense } from "react";
import JobsTable from "./JobsTable";

export default function AdminCompanyJobsPageWrapper() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <JobsTable />
    </Suspense>
  );
} 
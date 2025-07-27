import { Suspense } from "react";
import JobEditForm from "./JobEditForm";

export default function AdminJobEditPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <JobEditForm />
    </Suspense>
  );
} 
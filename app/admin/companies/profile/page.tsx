import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export default function AdminCompanyProfilePageWrapper() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ProfileClient />
    </Suspense>
  );
} 
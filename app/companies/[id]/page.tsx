// app/companies/[id]/page.tsx
import React, { ReactElement } from "react";           // ← React と型をインポート
import { mockCompanies } from "../../../lib/mock-data";
import type { Metadata } from "next";

type Params = { id: string };

// ─── 1. generateMetadata は同期関数で OK ───
export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const company = mockCompanies.find((c) => c.id === params.id);
  return {
    title: company ? `${company.name}｜TokyoIntern` : "会社詳細",
  };
}

// ─── 2. ページコンポーネント本体 ───
export default async function CompanyDetail({
  params,
}: {
  params: Params;
}): Promise<ReactElement> {                                 // ← JSX.Element の代わりに ReactElement
  const company = mockCompanies.find((c) => c.id === params.id);

  if (!company) {
    return <h1 className="p-10">会社が見つかりません</h1>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-6">
        <img src={company.logo} alt="" className="w-16 h-16 rounded" />
        <h1 className="text-2xl font-bold">{company.name}</h1>
      </div>
      <p className="mb-2">業種：{company.industry}</p>
      <p className="mb-8">所在地：{company.address}</p>
      <p>（将来：会社紹介・求人一覧などを表示）</p>
    </main>
  );
}
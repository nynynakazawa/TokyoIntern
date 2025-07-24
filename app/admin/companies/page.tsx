import { fetchCompaniesServer } from "../../../lib/api";
import type { Company } from "../../../lib/mock-data";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getCompanyIcon(company: any) {
  // FirestoreのcompanyドキュメントにiconUrlがあればそれを使う
  if (company.iconUrl) return company.iconUrl;
  // logoフィールドがあればそれを使う
  if (company.logo) return company.logo;
  // どちらもなければダミー画像
  return "/noimage.png";
}

export default async function AdminCompaniesPage() {
  const companies: Company[] = await fetchCompaniesServer();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">企業一覧</h1>
        <p className="text-gray-600 text-lg mb-1">登録されている企業の一覧です</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <Link
            key={company.id}
            href={`/admin/companies/jobs?companyId=${company.id}`}
            className="group bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:border-main-300 transition-all duration-300 cursor-pointer"
          >
            <img
              src={getCompanyIcon(company)}
              alt={company.name}
              className="w-16 h-16 rounded-full border-4 border-main-100 shadow-md bg-gray-50 object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-main-700 transition-colors mb-1">
                {company.name}
              </h2>
              <p className="text-gray-600 text-sm mb-1">{company.industry}</p>
              <p className="text-gray-500 text-xs">{company.address}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
} 
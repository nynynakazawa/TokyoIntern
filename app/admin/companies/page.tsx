"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LoadingAnimation from "../../../components/LoadingAnimation";
import AdminContentWrapper from "../../../components/AdminContentWrapper";

interface Company {
  id: string;
  name: string;
  iconUrl?: string;
  profile?: string;
  area?: string;
  phone?: string;
  website?: string;
  createdAt?: any;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      const db = getFirestore(app);
      const companiesRef = collection(db, "companies");
      const snap = await getDocs(companiesRef);
      const companyList = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Company));
      setCompanies(companyList);
      setLoading(false);
    };
    fetchCompanies();
  }, []);

  if (loading) return <LoadingAnimation />;

  return (
    <AdminContentWrapper>
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">企業一覧</h1>
        </div>
        <div className="grid gap-6">
          {companies.map(company => (
            <div key={company.id} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-4">
                {company.iconUrl ? (
                  <img src={company.iconUrl} alt={company.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
                    {company.name?.charAt(0) || "C"}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{company.name}</h2>
                  {company.profile && (
                    <p className="text-gray-600 mt-1">{company.profile}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/companies/profile?companyId=${company.id}`}>
                    <Button variant="outline">詳細</Button>
                  </Link>
                  <Link href={`/admin/companies/jobs?companyId=${company.id}`}>
                    <Button>求人管理</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminContentWrapper>
  );
} 
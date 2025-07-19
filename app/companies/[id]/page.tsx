"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { useJobs } from "../../../src/hook/useJobs";
import JobCard from "../../../components/JobCard";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Globe, Building } from "lucide-react";

interface Company {
  id: string;
  name: string;
  profile: string;
  iconUrl: string;
  area: string;
  phone: string;
  website: string;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { jobs, loading: jobsLoading } = useJobs(companyId);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) return;
      
      const db = getFirestore(app);
      const companyRef = doc(db, "companies", companyId);
      const companySnap = await getDoc(companyRef);
      
      if (companySnap.exists()) {
        const data = companySnap.data();
        setCompany({
          id: companySnap.id,
          name: data.name || "",
          profile: data.profile || "",
          iconUrl: data.iconUrl || "",
          area: data.area || "",
          phone: data.phone || "",
          website: data.website || "",
        });
      }
      setLoading(false);
    };

    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 border-b-2 border-main-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">企業が見つかりませんでした</p>
          <Link href="/jobs" className="text-main-600 hover:text-main-700 underline mt-2 inline-block">
            求人一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[60vh] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link 
            href="/jobs" 
            className="inline-flex items-center gap-2 text-main-600 hover:text-main-700 transition-colors"
          >
            <ArrowLeft size={20} />
            求人一覧に戻る
          </Link>
        </div>

        {/* 企業ヘッダー */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {company.iconUrl ? (
              <img 
                src={company.iconUrl} 
                alt={`${company.name}のアイコン`} 
                className="w-24 h-24 rounded-full border-4 border-main-100 shadow-lg object-cover" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-main-100 bg-gradient-to-br from-main-100 to-main-200 flex items-center justify-center text-main-600 font-bold text-2xl shadow-lg">
                {company.name?.charAt(0) || "C"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {company.name}
              </h1>
              {company.profile && (
                <p className="text-gray-700 text-lg mb-4">{company.profile}</p>
              )}
              
              {/* 企業情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.area && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{company.area}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>{company.phone}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} />
                    <a 
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-main-600 hover:text-main-700 underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 求人一覧 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building size={24} className="text-main-600" />
            <h2 className="text-2xl font-bold text-main-700">
              {company.name}の求人一覧
            </h2>
            <span className="bg-main-100 text-main-600 px-3 py-1 rounded-full text-sm font-medium">
              {jobs.length}件
            </span>
          </div>

          {jobsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 border-b-2 border-main-600 mx-auto mb-4"></div>
              <p className="text-gray-600">求人を読み込み中...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">現在、求人はありません</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
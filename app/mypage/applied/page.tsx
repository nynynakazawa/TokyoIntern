"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { auth } from "../../../lib/firebase";
import Link from "next/link";
import { Job } from "@/types";

type Application = {
  id: string;
  jobId: string;
  companyId: string;
  createdAt: any;
};

type Company = {
  id: string;
  name: string;
};

export default function AppliedListPage() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<{ [key: string]: Job }>({});
  const [companies, setCompanies] = useState<{ [key: string]: Company }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const db = getFirestore(app);
        // 1. 自分の応募データを取得（applications/{userId}/userApplications/{applicationId}/job）
        const userApplicationsRef = collection(db, "applications", currentUser.uid, "userApplications");
        const userApplicationsSnap = await getDocs(userApplicationsRef);
        const apps: Application[] = userApplicationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
        setApplications(apps);

        // 2. 関連する求人・企業データも取得
        const jobIds = Array.from(new Set(apps.map(app => app.jobId)));
        const jobsObj: { [key: string]: Job } = {};
        for (const jobId of jobIds) {
          const jobDoc = await getDoc(doc(db, "jobs", jobId));
          if (jobDoc.exists()) {
            jobsObj[jobId] = { id: jobDoc.id, ...jobDoc.data() } as Job;
          }
        }
        setJobs(jobsObj);

        // 企業情報
        const companyIds = Array.from(new Set(Object.values(jobsObj).map(job => job.companyId)));
        const companiesObj: { [key: string]: Company } = {};
        for (const companyId of companyIds) {
          const companyDoc = await getDoc(doc(db, "companies", companyId));
          if (companyDoc.exists()) {
            companiesObj[companyId] = { id: companyDoc.id, ...companyDoc.data() } as Company;
          }
        }
        setCompanies(companiesObj);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return <div>ログインしてください</div>;
  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">応募した企業一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map(app => {
          const job = jobs[app.jobId];
          if (!job) {
            return (
              <div key={app.id} className="rounded-lg border bg-white p-6 shadow text-gray-400 flex flex-col items-center justify-center">
                <div className="mb-2 font-bold">求人情報取得中</div>
                <div className="text-xs">応募日: {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString() : ""}</div>
              </div>
            );
          }
          const company = companies[job.companyId];
          return (
            <Link
              key={app.id}
              href={`/jobs/${job.id}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* サムネイル */}
              <div className="relative w-full aspect-[4/3] bg-gray-200 flex items-center justify-center">
                <img
                  src={job.thumbnail ?? "/noimage.png"}
                  alt="サムネイル"
                  className="h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>

              {/* 本文 */}
              <div className="flex flex-1 flex-col p-3">
                <ul className="mb-2 flex flex-wrap gap-1">
                  {job.area && <li className="badge">{job.area}</li>}
                  {job.occupation && <li className="badge">{job.occupation}</li>}
                </ul>
                <h3 className="mb-2 line-clamp-2 font-semibold group-hover:text-main-600">
                  {job.title}
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  {job.wageMax ?
                    `時給 ¥${job.wageMin.toLocaleString()}~${job.wageMax.toLocaleString()}` :
                    `時給 ¥${job.wageMin.toLocaleString()}`
                  }
                </p>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  {company?.iconUrl && (
                    <img
                      src={company.iconUrl}
                      alt=""
                      className="h-8 w-8 rounded-full border object-cover"
                    />
                  )}
                  {job.companyName && job.companyId ? (
                    <span className="truncate text-xs text-main-600 font-semibold">
                      {job.companyName}
                    </span>
                  ) : (
                    <p className="truncate text-xs text-gray-500">{job.companyName || ""}</p>
                  )}
                </div>
                {/* 応募日 */}
                <div className="mt-2 text-xs text-gray-500 text-right">
                  応募日: {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString() : ""}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
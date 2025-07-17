"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import app from "../../../lib/firebaseClient";
import { auth } from "../../../lib/firebase";

type Application = {
  id: string;
  jobId: string;
  companyId: string;
  createdAt: any;
};

type Job = {
  id: string;
  title: string;
  companyId: string;
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
        // 1. 自分の応募データを取得
        const q = query(
          collection(db, "applications"),
          where("applicantId", "==", currentUser.uid)
        );
        const snap = await getDocs(q);
        const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Application[];
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
      <ul>
        {applications.map(app => {
          const job = jobs[app.jobId];
          const company = job ? companies[job.companyId] : null;
          return (
            <li key={app.id} className="mb-4 p-4 border rounded">
              <div><strong>求人:</strong> {job?.title || "求人情報取得中"}</div>
              <div><strong>企業:</strong> {company?.name || "企業情報取得中"}</div>
              <div><strong>応募日:</strong> {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleString() : ""}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // ログインユーザーのcompanyId取得
      const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await user.getIdTokenResult();
          const cid = token.claims.companyId;
          setCompanyId(cid);
          // Firestoreから自社求人一覧取得
          const db = getFirestore(app);
          const jobsSnap = await getDocs(query(collection(db, "jobs"), where("companyId", "==", cid)));
          const jobsList = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setJobs(jobsList);
          const jobIds = jobsSnap.docs.map(doc => doc.id);
          // 各求人ごとの応募者取得
          const appsSnap = await getDocs(collection(db, "applications"));
          const apps = appsSnap.docs.map(doc => {
            const data = doc.data();
            return { id: doc.id, jobId: data.jobId, ...data };
          });
          // 自社求人に紐づく応募のみ抽出
          const filtered = apps.filter(app => jobIds.includes(app.jobId));
          setApplications(filtered);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  // 求人ごとにグループ化
  const jobsMap: Record<string, any[]> = {};
  applications.forEach(app => {
    if (!jobsMap[app.jobId]) jobsMap[app.jobId] = [];
    jobsMap[app.jobId].push(app);
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">応募者管理</h1>
      {jobs.length === 0 && <div>自社求人がありません。</div>}
      {jobs.map(job => (
        <div key={job.id} className="mb-8">
          <h2 className="text-lg font-bold mb-2">{job.title || `求人ID: ${job.id}`}</h2>
          <div className="flex flex-wrap gap-4">
            {(jobsMap[job.id] || []).length === 0 && <div>応募者がまだいません。</div>}
            {(jobsMap[job.id] || []).map(app => (
              <div
                key={app.id}
                className="flex flex-col items-center cursor-pointer border rounded p-2 hover:bg-main-50"
                onClick={() => router.push(`/company/(dashboard)/applicants/${app.applicantId}`)}
              >
                {app.applicantProfile?.iconUrl && (
                  <img src={app.applicantProfile.iconUrl} alt="icon" className="w-12 h-12 rounded-full border mb-1" />
                )}
                <span className="text-sm font-bold">{app.applicantProfile?.name || "No Name"}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 
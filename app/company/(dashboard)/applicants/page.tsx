"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where, collectionGroup } from "firebase/firestore";
import app from "../../../../lib/firebaseClient";
import { useRouter } from "next/navigation";
import { auth } from "../../../../lib/firebase";
import LoadingAnimation from "../../../../components/LoadingAnimation";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Calendar } from "lucide-react";

interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantProfile?: {
    name?: string;
    iconUrl?: string;
    email?: string;
    university?: string;
  };
  createdAt?: any;
  status?: string;
}

interface Job {
  id: string;
  title: string;
  companyId: string;
  createdAt?: any;
}

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      const token = await user.getIdTokenResult();
      const cid = token.claims.companyId as string | undefined;
      if (!cid) {
        setLoading(false);
        return;
      }
      setCompanyId(cid);
      const db = getFirestore(app);
      try {
        const jobsSnap = await getDocs(query(collection(db, "jobs"), where("companyId", "==", cid)));
        const jobsList = jobsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsList);

        const appsSnap = await getDocs(
          query(
            collectionGroup(db, "userApplications"),
            where("companyId", "==", cid)
          )
        );
        const allApplications = appsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Application));
        setApplications(allApplications);
      } catch (e) {
        console.error("Error fetching data:", e);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingAnimation />;

  // 求人ごとにグループ化
  const jobsMap: Record<string, Application[]> = {};
  applications.forEach(app => {
    if (!jobsMap[app.jobId]) jobsMap[app.jobId] = [];
    jobsMap[app.jobId].push(app);
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">応募者管理</h1>
          <p className="text-gray-600 mt-2">求人ごとの応募者一覧</p>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <span>求人数: {jobs.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>応募者数: {applications.length}</span>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">自社求人がありません。</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/company/jobs/new")}
          >
            新規求人を作成
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">{job.title || `求人ID: ${job.id}`}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{(jobsMap[job.id] || []).length}名の応募</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {(jobsMap[job.id] || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    まだ応募者がいません
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(jobsMap[job.id] || []).map(app => (
                      <div
                        key={app.id}
                        className="group bg-gray-50 hover:bg-main-50 rounded-xl p-4 cursor-pointer transition-all duration-200"
                        onClick={() => router.push(`/company/applicants/${app.applicantId}`)}
                      >
                        <div className="flex flex-col items-center">
                          {app.applicantProfile?.iconUrl ? (
                            <img
                              src={app.applicantProfile.iconUrl}
                              alt={app.applicantProfile.name || "応募者"}
                              className="w-16 h-16 rounded-full border-2 border-white shadow-md object-cover mb-3"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold border-2 border-white shadow-md mb-3">
                              {(app.applicantProfile?.name || "?")[0]}
                            </div>
                          )}
                          <div className="text-center">
                            <p className="font-semibold text-gray-800 group-hover:text-main-600 transition-colors">
                              {app.applicantProfile?.name || "名前なし"}
                            </p>
                            {app.applicantProfile?.university && (
                              <p className="text-sm text-gray-500 mt-1">
                                {app.applicantProfile.university}
                              </p>
                            )}
                            {app.createdAt && (
                              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-2">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
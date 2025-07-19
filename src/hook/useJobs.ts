// src/hook/useJobs.ts
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, getFirestore, QuerySnapshot, DocumentData, query, where, doc, getDoc } from "firebase/firestore";
import app from "../../lib/firebaseClient";

export type Job = {
  id: string;
  title: string;
  description: string;
  wageMin: number;
  wageMax?: number;
  conditions?: string;
  duties?: string;
  notes?: string;
  companyId: string;
  createdAt?: string;
  thumbnail?: string;
  area?: string;
  occupation?: string;
  companyLogo?: string;
  companyName?: string;
};

export function useJobs(companyId?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const db = getFirestore(app);
    let jobsQuery;
    if (companyId) {
      jobsQuery = query(collection(db, "jobs"), where("companyId", "==", companyId));
    } else {
      jobsQuery = collection(db, "jobs");
    }
    const unsubscribe = onSnapshot(
      jobsQuery,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const jobsData = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data();
              const job: Job = {
                id: docSnapshot.id,
                title: data.title || "",
                description: data.description || "",
                wageMin: typeof data.wageMin === "number" ? data.wageMin : Number(data.wageMin),
                wageMax: data.wageMax !== undefined ? Number(data.wageMax) : undefined,
                conditions: data.conditions || "",
                duties: data.duties || "",
                notes: data.notes || "",
                companyId: data.companyId || "",
                createdAt: data.createdAt || "",
                thumbnail: data.thumbnail || "",
                area: data.area || "",
                occupation: data.occupation || "",
                companyLogo: data.companyLogo || "",
                companyName: data.companyName || "",
              };

              // 会社情報を取得
              if (data.companyId) {
                try {
                  const companyRef = doc(db, "companies", data.companyId);
                  const companySnap = await getDoc(companyRef);
                  if (companySnap.exists()) {
                    const companyData = companySnap.data() as any;
                    job.companyName = companyData.name || "";
                    job.companyLogo = companyData.iconUrl || "";
                  }
                } catch (error) {
                  console.error("会社情報の取得に失敗:", error);
                }
              }

              return job;
            })
          );
          setJobs(jobsData);
        } catch (e) {
          setError("求人情報の取得に失敗しました");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("求人情報の取得に失敗しました");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [companyId]);

  return { jobs, loading, error };
}
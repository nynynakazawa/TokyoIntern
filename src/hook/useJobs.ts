// src/hook/useJobs.ts
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, getFirestore, QuerySnapshot, DocumentData, query, where } from "firebase/firestore";
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
      (snapshot: QuerySnapshot<DocumentData>) => {
        const jobsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            wageMin: typeof data.wageMin === "number" ? data.wageMin : Number(data.wageMin),
            wageMax: data.wageMax !== undefined ? Number(data.wageMax) : undefined,
          } as Job;
        });
        setJobs(jobsData);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [companyId]);

  return { jobs, loading };
}
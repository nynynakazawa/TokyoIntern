// src/components/JobList.tsx
"use client";

import { useJobs } from "@/hook/useJobs";
import JobCard from "../components/JobCard";

export default function JobList({ 
  limit, 
  areaFilter = "", 
  occupationFilter = "", 
  wageFilter = "" 
}: { 
  limit?: number;
  areaFilter?: string;
  occupationFilter?: string;
  wageFilter?: string;
}) {
  const { jobs, loading, error } = useJobs();

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // フィルター適用
  let filteredJobs = jobs;
  
  if (areaFilter) {
    filteredJobs = filteredJobs.filter(job => job.area && job.area.startsWith(areaFilter));
  }
  if (occupationFilter) {
    filteredJobs = filteredJobs.filter(job => job.occupation === occupationFilter);
  }
  if (wageFilter) {
    const wageFilterNum = Number(wageFilter);
    filteredJobs = filteredJobs.filter(job => job.wageMin >= wageFilterNum);
  }

  // 件数制限
  const displayJobs = limit ? filteredJobs.slice(0, limit) : filteredJobs;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

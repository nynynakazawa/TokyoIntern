"use client";

import { useState } from "react";
import JobList from "../../src/JobList";
import AreaFilter from "../../components/Filters/AreaFilter";
import OccupationFilter from "../../components/Filters/OccupationFilter";

export default function JobsPage() {
  const [areaFilter, setAreaFilter] = useState("");
  const [occupationFilter, setOccupationFilter] = useState("");
  const [wageFilter, setWageFilter] = useState("");

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">求人一覧</h1>

      {/* --- フィルター UI --- */}
      <div className="mb-6 p-4 bg-gradient-to-r from-main-50 to-blue-50 rounded-lg border border-main-100">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">エリア</label>
            <AreaFilter 
              value={areaFilter} 
              onChange={setAreaFilter} 
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">職種</label>
            <OccupationFilter 
              value={occupationFilter} 
              onChange={setOccupationFilter} 
            />
          </div>
        </div>
      </div>

      {/* --- 求人カード --- */}
      <JobList 
        areaFilter={areaFilter}
        occupationFilter={occupationFilter}
        wageFilter={wageFilter}
      />
    </main>
  );
}
"use client";

import { useState } from "react";
import JobList from "../../src/JobList";
import AreaFilter from "../../components/Filters/AreaFilter";
import OccupationFilter from "../../components/Filters/OccupationFilter";

export default function JobsPage() {
  const [areaFilter, setAreaFilter] = useState("");
  const [occupationFilter, setOccupationFilter] = useState("");
  const [wageFilter, setWageFilter] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">求人一覧</h1>
      <div className="mb-6 flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">キーワード検索</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              placeholder="タイトル・仕事内容で検索"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
            />
          </div>

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
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">時給</label>
            <select
              value={wageFilter}
              onChange={e => setWageFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-main-300 hover:shadow-md focus:border-main-500 focus:outline-none focus:ring-2 focus:ring-main-200 w-40"
            >
              <option value="">選択</option>
              {Array.from({length: 12}, (_, i) => 900 + i * 100).map(v => (
                <option key={v} value={v}>{`¥${v.toLocaleString()}`}</option>
              ))}
              {Array.from({length: 6}, (_, i) => 2000 + i * 200).map(v => (
                <option key={v} value={v}>{`¥${v.toLocaleString()}`}</option>
              ))}
              {Array.from({length: 5}, (_, i) => 3000 + i * 500).map(v => (
                <option key={v} value={v}>{`¥${v.toLocaleString()}`}</option>
              ))}
              <option value="5000">¥5,000以上</option>
            </select>
            <span className="text-sm text-gray-500">~</span>
          </div>
        </div>
      </div>

      {/* --- 求人カード --- */}
      <JobList 
        areaFilter={areaFilter}
        occupationFilter={occupationFilter}
        wageFilter={wageFilter}
        searchKeyword={searchKeyword}
      />
    </main>
  );
}
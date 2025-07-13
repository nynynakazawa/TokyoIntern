// components/Filters/OccupationFilter.tsx
export const OCCUPATIONS = [
    "営業",
    "マーケティング",
    "エンジニア",
    "デザイナー",
  ] as const;
  
  export default function OccupationFilter({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) {
      return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-main-300 hover:shadow-md focus:border-main-500 focus:outline-none focus:ring-2 focus:ring-main-200"
    >
      <option value="">職種を選択</option>
      {OCCUPATIONS.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
  }
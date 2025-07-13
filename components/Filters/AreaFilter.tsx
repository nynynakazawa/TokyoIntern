// components/Filters/AreaFilter.tsx
export const AREAS = ["全国", "北海道", "東京都", "大阪府"] as const;

export default function AreaFilter({
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
      <option value="">エリアを選択</option>
      {AREAS.map((a) => (
        <option key={a} value={a}>{a}</option>
      ))}
    </select>
  );
}
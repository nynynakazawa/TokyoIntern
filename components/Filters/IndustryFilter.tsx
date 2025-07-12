
// components/Filters/IndustryFilter.tsx
export const INDUSTRIES = ["IT", "人材", "広告/PR", "教育"] as const;

export default function IndustryFilter({
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
      className="filter-select"
    >
      <option value="">業界を選択</option>
      {INDUSTRIES.map((i) => (
        <option key={i}>{i}</option>
      ))}
    </select>
  );
}

/* globals.css
.filter-select { @apply rounded border px-3 py-2 text-sm text-gray-700; }
*/
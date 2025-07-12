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
      className="filter-select"
    >
      {AREAS.map((a) => (
        <option key={a}>{a}</option>
      ))}
    </select>
  );
}
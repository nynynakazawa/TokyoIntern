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
        className="filter-select"
      >
        <option value="">職種を選択</option>
        {OCCUPATIONS.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    );
  }
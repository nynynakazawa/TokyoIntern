// components/Filters/OccupationFilter.tsx
export const OCCUPATIONS = [
  "営業",
  "マーケティング",
  "モデル・芸能・エンタメ",
  "企画・事務・管理",
  "人事・総務・法務",
  "経理・財務・会計",
  "ITエンジニア（開発・SE・インフラ）",
  "Web・アプリ・ゲーム関連",
  "クリエイティブ（デザイン・編集・映像）",
  "製造・生産・品質管理",
  "建築・土木・設備",
  "医療・福祉・介護",
  "保育・教育・公務員",
  "販売・サービス・接客",
  "飲食・フード",
  "物流・運輸・配送",
  "ドライバー・運転手",
  "美容・理容・エステ",
  "警備・清掃・設備管理",
  "農林水産・畜産",
  "研究・開発・専門職",
  "その他"
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
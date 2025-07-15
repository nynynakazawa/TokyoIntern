// components/Filters/AreaFilter.tsx
// 型エラー対策: 'jp-prefecture'の型定義がない場合は、プロジェクト直下に 'jp-prefecture.d.ts' を作成し、
// declare module 'jp-prefecture';
// と記載してください。
import { useState, useMemo } from "react";
import * as jp from "jp-prefecture";
import { City } from "jp-city-lookup";

const REGIONS = [
  "北海道・東北",
  "関東",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄"
] as const;
type Region = typeof REGIONS[number];

const REGION_PREF_MAP: Record<Region, string[]> = {
  "北海道・東北": ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
  "近畿": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  "中国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  "四国": ["徳島県", "香川県", "愛媛県", "高知県"],
  "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
};

// 都道府県名→都道府県コード変換
function getPrefCode(prefName: string): string | undefined {
  const allPrefs = (jp as any).getAllPref ? (jp as any).getAllPref() : [];
  const pref = allPrefs.find((p: { name: string }) => p.name === prefName);
  return pref ? String(pref.id).padStart(2, "0") : undefined;
}

export default function AreaFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [region, setRegion] = useState<string>("");
  const [pref, setPref] = useState<string>("");
  const [city, setCity] = useState<string>("");

  useMemo(() => {
    if (value) {
      const [r, p, c] = value.split("/");
      setRegion((r as Region) || "");
      setPref(p || "");
      setCity(c || "");
    }
  }, [value]);

  const prefList = region && (REGIONS as readonly string[]).includes(region) ? REGION_PREF_MAP[region as Region] : [];
  // 市区町村リスト
  let cityList: string[] = [];
  if (pref) {
    const code = getPrefCode(pref);
    if (code) {
      const cityCodes = City.lookup({ pref: code });
      cityList = cityCodes.map((c: string) => City.name(c)).filter(Boolean) as string[];
    }
  }

  const handleRegion = (r: string) => {
    setRegion(r);
    setPref("");
    setCity("");
    onChange(r ? r : "");
  };
  const handlePref = (p: string) => {
    setPref(p);
    setCity("");
    onChange(region && p ? `${region}/${p}` : region);
  };
  const handleCity = (c: string) => {
    setCity(c);
    onChange(region && pref && c ? `${region}/${pref}/${c}` : region && pref ? `${region}/${pref}` : region);
  };

  return (
    <div className="flex gap-2">
      {/* 地域 */}
      <select
        value={region}
        onChange={e => handleRegion(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-main-300 hover:shadow-md focus:border-main-500 focus:outline-none focus:ring-2 focus:ring-main-200"
      >
        <option value="">地域を選択</option>
        {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      {/* 都道府県 */}
      <select
        value={pref}
        onChange={e => handlePref(e.target.value)}
        disabled={!region}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-main-300 hover:shadow-md focus:border-main-500 focus:outline-none focus:ring-2 focus:ring-main-200"
      >
        <option value="">都道府県を選択</option>
        {prefList.map((p: string) => <option key={p} value={p}>{p}</option>)}
      </select>
      {/* 市区町村 */}
      <select
        value={city}
        onChange={e => handleCity(e.target.value)}
        disabled={!pref}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-main-300 hover:shadow-md focus:border-main-500 focus:outline-none focus:ring-2 focus:ring-main-200"
      >
        <option value="">市区町村を選択</option>
        {cityList.map((c: string) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
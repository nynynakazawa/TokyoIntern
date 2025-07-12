// app/about/page.tsx  ―  会社概要（静的）
export const dynamic = "force-static";

export default function About() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">運営会社</h1>
      <ul className="space-y-1 text-sm">
        <li>社名：TokyoIntern 株式会社</li>
        <li>所在地：東京都渋谷区○○ 1-2-3</li>
        <li>代表者：山田 太郎</li>
        <li>設立：2025 年 4 月</li>
        <li>資本金：10,000,000 円</li>
      </ul>
    </main>
  );
}
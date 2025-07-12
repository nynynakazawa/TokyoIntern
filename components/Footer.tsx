import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 text-base text-gray-600">
        <div className="grid gap-6 md:grid-cols-4">
          <section>
            <h2 className="mb-2 font-bold text-gray-900 text-lg">サービス</h2>
            <ul className="space-y-1">
              <li><Link href="/">トップ</Link></li>
              <li><Link href="/jobs">求人検索</Link></li>
              <li><Link href="/contact">お問い合わせ</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900 text-lg">長期インターンを探す</h2>
            <ul className="space-y-1">
              <li><Link href="/occupation">職種</Link></li>
              <li><Link href="/industry">業界</Link></li>
              <li><Link href="/workstyle">働き方</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-bold text-gray-900 text-lg">会社情報</h2>
            <ul className="space-y-1">
              <li><Link href="/about">会社概要</Link></li>
              <li><Link href="https://github.com/" target="_blank">GitHub</Link></li>
            </ul>
          </section>

          <section className="md:text-right">
            <p className="font-bold text-main-600 text-xl">TokyoIntern Inc.</p>
            <p className="mt-1 text-base">© {new Date().getFullYear()} TokyoIntern</p>
          </section>
        </div>
      </div>
    </footer>
  );
}
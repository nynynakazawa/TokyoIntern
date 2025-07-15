/* ----------------------------- 型定義 ----------------------------- */
export interface Company {
    id: string;
    name: string;
    logo: string;
    industry: string;
    address: string;
  }
  
  export interface Job {
    id: string;
    title: string;
    area: string;
    occupation: string;
    wageMin: number;
    wageMax?: number;
    thumbnail: string;
    conditions?: string;
    duties?: string;
    notes?: string;
    company: Company;
  }
  
  /* --------------------------- モック企業 --------------------------- */
  export const mockCompanies: Company[] = [
    {
      id: "c000",
      name: "株式会社MISM",
      logo: "/logos/sample.svg",
      industry: "広告",
      address: "東京都渋谷区渋谷2丁目6番12号6F",
    },
    {
      id: "c001",
      name: "Sample 株式会社",
      logo: "/logos/sample.svg",
      industry: "IT",
      address: "東京都渋谷区 1-1-1",
    },
    {
      id: "c002",
      name: "Example Inc.",
      logo: "/logos/example.svg",
      industry: "人材",
      address: "大阪府大阪市中央区 2-2-2",
    },
    {
      id: "c003",
      name: "株式会社Alpha",
      logo: "/logos/sample.svg",
      industry: "教育",
      address: "東京都新宿区 3-3-3",
    },
    {
      id: "c004",
      name: "Beta Solutions",
      logo: "/logos/example.svg",
      industry: "コンサル",
      address: "神奈川県横浜市 4-4-4",
    },
    {
      id: "c005",
      name: "Gamma Works",
      logo: "/logos/sample.svg",
      industry: "製造",
      address: "愛知県名古屋市 5-5-5",
    },
    {
      id: "c006",
      name: "Delta Creative",
      logo: "/logos/example.svg",
      industry: "デザイン",
      address: "京都府京都市 6-6-6",
    },
    {
      id: "c007",
      name: "Epsilon Tech",
      logo: "/logos/sample.svg",
      industry: "IT",
      address: "北海道札幌市 7-7-7",
    },
    {
      id: "c008",
      name: "Zeta Holdings",
      logo: "/logos/example.svg",
      industry: "不動産",
      address: "福岡県福岡市 8-8-8",
    },
    {
      id: "c009",
      name: "Eta Partners",
      logo: "/logos/sample.svg",
      industry: "金融",
      address: "兵庫県神戸市 9-9-9",
    },
    {
      id: "c010",
      name: "Theta Group",
      logo: "/logos/example.svg",
      industry: "物流",
      address: "埼玉県さいたま市 10-10-10",
    },
  ];
  
  /* --------------------------- モック求人 --------------------------- */
  export const mockJobs: Job[] = [
    {
      id: "j000",
      title: "SNSマーケターモデル",
      area: "東京都",
      occupation: "モデル,マネージャー",
      wageMin: 1200,
      wageMax: 2000,
      thumbnail: "/thumbnails/MISM.png",
      conditions: "march以上 青学が望ましい、オフィスは青学の横、週3回以上出勤",
      duties: "撮影場所のモデルのマネージャー、素材の撮影の仕事",
      notes: "    3/2〜契約,3/9〜の週から",
      company: mockCompanies[0],
    },
    {
      id: "j001",
      title: "フロントエンドエンジニアインターン",
      area: "東京都",
      occupation: "エンジニア",
      wageMin: 1800,
      thumbnail: "/thumbnails/fe.webp",
      conditions: "週3日以上、リモート可",
      duties: "Webアプリ開発補助、テスト、ドキュメント作成",
      notes: "交通費支給、服装自由",
      company: mockCompanies[1],
    },
    {
      id: "j002",
      title: "SNSマーケターアシスタント（未経験歓迎）",
      area: "大阪府",
      occupation: "マーケティング",
      wageMin: 1300,
      wageMax: 1500,
      thumbnail: "/thumbnails/sns.webp",
      conditions: "週3日以上、リモート可",
      duties: "Webアプリ開発補助、テスト、ドキュメント作成",
      notes: "交通費支給、服装自由",
      company: mockCompanies[2],
    },
    // --- 追加分 ---
    {
      id: "j003",
      title: "営業アシスタントインターン",
      area: "神奈川県",
      occupation: "営業",
      wageMin: 1100,
      wageMax: 1300,
      thumbnail: "/thumbnails/fe.webp",
      conditions: "週2日以上、未経験可",
      duties: "営業資料作成、顧客対応",
      notes: "交通費全額支給",
      company: mockCompanies[3],
    },
    {
      id: "j004",
      title: "デザイナーインターン",
      area: "愛知県",
      occupation: "デザイナー",
      wageMin: 1500,
      wageMax: 1800,
      thumbnail: "/thumbnails/fe.webp",
      conditions: "週3日、ポートフォリオ提出必須",
      duties: "バナー・ロゴ制作、UIデザイン補助",
      notes: "服装自由、リモート可",
      company: mockCompanies[4],
    },
    {
      id: "j005",
      title: "人事サポートインターン",
      area: "京都府",
      occupation: "人事",
      wageMin: 1200,
      wageMax: 1400,
      thumbnail: "/thumbnails/sns.webp",
      conditions: "週2日、未経験歓迎",
      duties: "採用補助、面接調整",
      notes: "交通費支給、社員登用あり",
      company: mockCompanies[5],
    },
    {
      id: "j006",
      title: "バックエンドエンジニアインターン",
      area: "北海道",
      occupation: "エンジニア",
      wageMin: 2000,
      wageMax: 2500,
      thumbnail: "/thumbnails/fe.webp",
      conditions: "週4日、経験者優遇",
      duties: "API開発、DB設計",
      notes: "リモート可、服装自由",
      company: mockCompanies[6],
    },
    {
      id: "j007",
      title: "不動産営業インターン",
      area: "福岡県",
      occupation: "営業",
      wageMin: 1300,
      wageMax: 1500,
      thumbnail: "/thumbnails/sns.webp",
      conditions: "週3日、要普通免許",
      duties: "物件案内、契約書作成補助",
      notes: "交通費支給、インセンティブあり",
      company: mockCompanies[7],
    },
    {
      id: "j008",
      title: "金融アナリストアシスタント",
      area: "兵庫県",
      occupation: "アナリスト",
      wageMin: 1700,
      wageMax: 2000,
      thumbnail: "/thumbnails/fe.webp",
      conditions: "週2日、Excelスキル必須",
      duties: "データ分析、レポート作成",
      notes: "交通費支給、社員登用あり",
      company: mockCompanies[8],
    },
    {
      id: "j009",
      title: "物流管理インターン",
      area: "埼玉県",
      occupation: "物流",
      wageMin: 1400,
      wageMax: 1600,
      thumbnail: "/thumbnails/sns.webp",
      conditions: "週3日、未経験可",
      duties: "倉庫管理、配送補助",
      notes: "交通費支給、制服貸与",
      company: mockCompanies[9],
    },
    {
      id: "j010",
      title: "教育サポートインターン",
      area: "東京都",
      occupation: "教育",
      wageMin: 1250,
      wageMax: 1450,
      thumbnail: "/thumbnails/fe.webp",
      conditions: "週2日、教育学部生歓迎",
      duties: "授業補助、教材作成",
      notes: "交通費支給、社員登用あり",
      company: mockCompanies[10],
    },
  ];
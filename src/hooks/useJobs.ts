export type Job = {
  id: string;
  title: string;
  description: string;
  wage: string;
  conditions?: string;
  duties?: string;
  notes?: string;
  companyId: string;
  createdAt?: string; // Firestore Timestamp型の場合はstringでOK
  // 必要に応じて他のフィールドも追加
}; 
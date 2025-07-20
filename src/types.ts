// 応募者プロフィール型
export type ApplicantProfile = {
  area: string;
  department: string;
  email: string;
  faculty: string;
  field: string;
  gender: string;
  gradYear: string;
  iconUrl: string;
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  profile: string;
  selfIntro: string;
  university: string;
};

// 応募データ型
export type Application = {
  id: string; // FirestoreのドキュメントID
  appeal: string;
  applicantId: string;
  applicantProfile: ApplicantProfile;
  companyId: string;
  createdAt: any; // Firestore Timestamp型
  jobId: string;
};

// 求人データ型
export type Job = {
  id: string; // FirestoreのドキュメントID
  area: string;
  companyId: string;
  companyLogo: string;
  companyName: string;
  conditions: string;
  createdAt: string; // ISO文字列
  description: string;
  duties: string;
  notes: string;
  occupation: string;
  thumbnail: string;
  title: string;
  wageMax: number;
  wageMin: number;
};

// 企業データ型
export type Company = {
  id: string;
  name: string;
  iconUrl: string; // 企業アイコン画像のURL
};

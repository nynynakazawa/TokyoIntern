/**
 * 🔄 後で Firestore / REST API / GraphQL などに差し替えるフック層。
 *   いまは static モックを返すだけ。
 */

import { mockJobs, mockCompanies, Job, Company } from "./mock-data";
import { adminDb } from "./firebaseAdmin";

/* ----------------------------- 求人 ----------------------------- */
export const fetchJobs = async (): Promise<Job[]> => {
  return Promise.resolve(mockJobs);
};

export const fetchJob = async (id: string): Promise<Job | undefined> => {
  return Promise.resolve(mockJobs.find((j) => j.id === id));
};

/* ----------------------------- 企業 ----------------------------- */
export const fetchCompany = async (
  id: string,
): Promise<Company | undefined> => {
  return Promise.resolve(mockCompanies.find((c) => c.id === id));
};

export const fetchCompanies = async (): Promise<Company[]> => {
  return Promise.resolve(mockCompanies);
};

export const fetchCompaniesServer = async (): Promise<Company[]> => {
  const snapshot = await adminDb.collection("companies").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Company[];
};
// lib/serverActions/jobActions.ts
"use server";

import { adminDb } from "../firebaseAdmin";

// ジョブ作成
export async function createJob(job: any) {
  const ref = adminDb.collection("jobs").doc();
  await ref.set(job);
  return { id: ref.id, ...job };
}

// ジョブ更新
export async function updateJob(jobId: string, data: any) {
  const ref = adminDb.collection("jobs").doc(jobId);
  await ref.update(data);
  return { id: jobId, ...data };
}

// ジョブ削除
export async function deleteJob(jobId: string) {
  await adminDb.collection("jobs").doc(jobId).delete();
  return { id: jobId };
}
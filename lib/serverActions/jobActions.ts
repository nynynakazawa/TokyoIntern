// lib/serverActions/jobActions.ts
"use server";

import { db } from "../firebaseAdmin";

// ジョブ作成
export async function createJob(job: any) {
  const ref = db.collection("jobs").doc();
  await ref.set(job);
  return { id: ref.id, ...job };
}

// ジョブ更新
export async function updateJob(jobId: string, data: any) {
  const ref = db.collection("jobs").doc(jobId);
  await ref.update(data);
  return { id: jobId, ...data };
}

// ジョブ削除
export async function deleteJob(jobId: string) {
  await db.collection("jobs").doc(jobId).delete();
  return { id: jobId };
}
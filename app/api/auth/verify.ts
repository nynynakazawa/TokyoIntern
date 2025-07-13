// app/api/auth/verify.ts (例)
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import serviceAccount from "../../../serviceAccountKey.json";

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  });
}

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    // decoded.uid などでユーザー情報が取得可能
    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }
}
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../lib/firebaseAdmin";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 対象パス判定
  const isAdminPath = pathname.startsWith("/admin");
  const isCompanyPath = pathname.startsWith("/company");

  // 認証用CookieからIDトークン取得（例: "token"という名前で保存している場合）
  const token = request.cookies.get("token")?.value;

  if ((isAdminPath || isCompanyPath) && token) {
    try {
      // IDトークンを検証し、カスタムクレームを取得
      const decoded = await adminAuth.verifyIdToken(token);

      if (isAdminPath && decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      if (isCompanyPath && decoded.role !== "owner") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      // 権限OKならそのまま
      return NextResponse.next();
    } catch (e) {
      // トークン不正など
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 未認証 or トークンなし
  if (isAdminPath || isCompanyPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // それ以外は通す
  return NextResponse.next();
}

// 適用するパス
export const config = {
  matcher: ["/admin/:path*", "/company/:path*"],
};
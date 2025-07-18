"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRedirectResult } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { routeByRole, UserRole } from "../../../lib/routeByRole";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getRedirectResult(auth);
        let user = result?.user || auth.currentUser;
        if (user) {
          const token = await user.getIdTokenResult();
          const role = (token.claims.role as UserRole) ?? null;
          router.replace(routeByRole(role));
        } else {
          router.replace("/");
        }
      } catch (e: any) {
        setError(e.message || "認証エラーが発生しました");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">認証処理中...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  return null;
} 
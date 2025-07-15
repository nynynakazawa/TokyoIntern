// app/login/page.tsx  ―  Google ログイン（モック）
"use client";

import { auth } from "../../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const idTokenResult = await currentUser.getIdTokenResult();
        const role = idTokenResult.claims.role;
        
        // ロールに応じてリダイレクト
        if (role === "admin") {
          console.log("adminとしてリダイレクト");
          router.push("/admin"); // 既存のadminダッシュボード
        } else if (role === "owner") {
          console.log("company ownerとしてリダイレクト");
          router.push("/company"); // companyダッシュボード
        } else {
          console.log("一般ユーザーとしてリダイレクト");
          router.push("/"); // または適切なページ
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
    // ポップアップの設定
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    try {
      console.log("ログイン開始");
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user.displayName);
      console.log("ユーザーID:", result.user.uid);
      alert(`ログイン成功: ${result.user.displayName}`);
    } catch (e) {
      console.error("ログインエラー:", e);
      
      // ポップアップブロッカーの場合の処理
      if (typeof e === "object" && e !== null && "code" in e && (e as any).code === 'auth/popup-blocked') {
        alert("ポップアップがブロックされました。ポップアップを許可してください。");
      } else {
        alert("ログインに失敗しました");
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <p className="text-xl font-semibold mb-4">ログインして始めましょう</p>
      <button onClick={handleLogin} className="btn-primary text-2xl font-bold mb-8">
        Sign in with Google
      </button>
    </main>
  );
}
"use client";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function GoogleLoginButton() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert(`ログイン成功: ${result.user.displayName}`);
    } catch (e) {
      alert("ログインに失敗しました");
    }
  };

  return (
    <button onClick={handleLogin} className="btn-primary">
      Sign in with Google
    </button>
  );
}

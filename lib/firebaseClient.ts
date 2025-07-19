// src/lib/firebaseClient.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  // 必要に応じて他の設定も追加
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);

export const clearAuthAndReload = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    // LocalStorage/IndexedDBもクリア（必要に応じて）
    localStorage.clear();
    sessionStorage.clear();
    // IndexedDB削除（firebaseのDB名は"firebaseLocalStorageDb"など）
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
    window.location.reload();
  } catch (e) {
    console.error("認証情報のクリアに失敗:", e);
  }
};

export default app;

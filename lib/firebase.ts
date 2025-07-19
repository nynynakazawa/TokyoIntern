// lib/firebase.ts
// Firebase + Next.js 認証初期化（signInWithRedirect安定稼働構成）
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  Auth
} from "firebase/auth";

// グローバルwindow拡張
declare global {
  interface Window {
    __FIREBASE_INIT_ERROR__?: any;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
let firebaseInitError: any = null;
if (typeof window !== "undefined") {
  try {
    auth = getAuth(app);
    // SafariやIndexedDB制限時のcatch
  } catch (e) {
    try {
      auth = initializeAuth(app, {
        persistence: [indexedDBLocalPersistence, browserLocalPersistence],
        popupRedirectResolver: browserPopupRedirectResolver,
      });
    } catch (err) {
      firebaseInitError = err;
      console.error("[Firebase Auth 初期化失敗]", err);
      // グローバルにエラーをセット
      if (typeof window !== "undefined") {
        window.__FIREBASE_INIT_ERROR__ = err;
      }
      // fallback: ダミーauthを返す（アプリが落ちないように）
      auth = {
        onAuthStateChanged: () => () => {},
        currentUser: null,
      } as any;
    }
  }
} else {
  try {
    auth = getAuth(app);
  } catch (e) {
    firebaseInitError = e;
    console.error("[Firebase Auth 初期化失敗 - SSR]", e);
    auth = {
      onAuthStateChanged: () => () => {},
      currentUser: null,
    } as any;
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, firebaseInitError };

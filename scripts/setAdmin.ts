// scripts/setAdmin.ts
import { adminAuth } from "../lib/firebaseAdmin";

async function setAdminRole(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, {
      role: "admin"
    });
    console.log(`User ${uid} is now admin`);
  } catch (error) {
    console.error("Error setting admin role:", error);
  }
}

// 指定したUIDにadmin権限を付与
setAdminRole("XxwQi2mQQrbIAeFCkYfpVC97Kci1");

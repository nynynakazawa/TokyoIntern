// scripts/checkUserRole.ts
import { adminAuth } from "../lib/firebaseAdmin";

async function checkUserRole(uid: string) {
  try {
    const user = await adminAuth.getUser(uid);
    console.log("User UID:", user.uid);
    console.log("User Email:", user.email);
    console.log("User Display Name:", user.displayName);
    console.log("Custom Claims:", user.customClaims);
    
    if (user.customClaims) {
      const role = user.customClaims.role;
      const companyId = user.customClaims.companyId;
      
      console.log("Role:", role);
      if (companyId) {
        console.log("Company ID:", companyId);
      }
      
      if (role === "admin") {
        console.log("Status: Admin user");
      } else if (role === "owner") {
        console.log("Status: Company owner");
      } else {
        console.log("Status: Regular user");
      }
    } else {
      console.log("Status: No custom claims (Regular user)");
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

// 使用例: 指定したUIDの権限を確認
// checkUserRole("user_uid_here");

// 例: 実際のUIDを指定
// checkUserRole("XxwQi2mQQrbIAeFCkYfpVC97Kci1"); 
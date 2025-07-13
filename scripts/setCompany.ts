// scripts/setCompany.ts
import { adminAuth } from "../lib/firebaseAdmin";

async function setCompanyRole(uid: string, companyId: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, {
      role: "owner",
      companyId: companyId
    });
    console.log(`User ${uid} is now company owner with companyId: ${companyId}`);
  } catch (error) {
    console.error("Error setting company role:", error);
  }
}

// 使用例: 指定したUIDにcompany権限を付与
// setCompanyRole("user_uid_here", "company_id_here");

setCompanyRole("YdRQIcG1AgM854iPj6FpO1OeHtO2", "c001"); 
// lib/routeByRole.ts

export type UserRole = "admin" | "owner" | "company" | null;

export function routeByRole(role: UserRole): string {
  if (role === "admin") return "/admin";
  if (role === "owner" || role === "company") return "/company";
  return "/";
} 
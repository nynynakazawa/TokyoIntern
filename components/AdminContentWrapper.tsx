"use client";

import { ReactNode } from "react";

interface AdminContentWrapperProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function AdminContentWrapper({ children, fullWidth = false }: AdminContentWrapperProps) {
  return (
    <div className={fullWidth ? "w-full" : "max-w-4xl mx-auto"}>
      {children}
    </div>
  );
} 
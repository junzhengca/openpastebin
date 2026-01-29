import React from "react";
import { cn } from "@/lib/utils/cn";

export interface AlertProps {
  variant?: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = "info", children, className }: AlertProps) {
  const variants = {
    success: "border-green-100 text-green-800 bg-green-50/50",
    error: "border-red-100 text-red-800 bg-red-50/50",
    warning: "border-yellow-100 text-yellow-800 bg-yellow-50/50",
    info: "border-primary-100 text-primary-800 bg-primary-50/50",
  };

  return (
    <div
      className={cn(
        "px-4 py-3 border rounded-xl text-sm font-medium",
        variants[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}

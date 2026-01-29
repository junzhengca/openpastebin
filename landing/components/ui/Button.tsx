import React from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 shadow-vista-button active:translate-y-px transition-all",
    secondary:
      "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:translate-y-px transition-all",
    danger:
      "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm active:translate-y-px transition-all",
    ghost:
      "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-transparent transition-all",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-md",
    md: "px-4 py-2 text-sm font-medium rounded-lg",
    lg: "px-6 py-3 text-base font-semibold rounded-xl",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="flex items-center">
        {isLoading ? "Loading..." : children}
      </span>
    </button>
  );
}

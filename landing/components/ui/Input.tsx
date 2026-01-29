import React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 bg-white border text-sm transition-all duration-200 focus:outline-none rounded-lg",
            error
              ? "border-red-500 text-red-600 placeholder-red-300 ring-4 ring-red-50"
              : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 text-slate-900 placeholder-slate-400 shadow-sm",
            className
          )}
          {...props}
        />
        {error && (
          <span className="mt-1 block text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

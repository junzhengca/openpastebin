import React from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full px-4 py-2 bg-white border text-sm focus:outline-none transition-all duration-200 appearance-none rounded-lg",
            error
              ? "border-red-500 text-red-600 ring-4 ring-red-50"
              : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 text-slate-900 shadow-sm",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white text-black">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="mt-1 block text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

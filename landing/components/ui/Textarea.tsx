import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      autoResize = false,
      showCharCount = false,
      maxLength,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    useEffect(() => {
      const element = textareaRef.current;
      if (autoResize && element) {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={textareaRef}
          className={cn(
            "w-full px-4 py-3 bg-white border text-sm focus:outline-none transition-all duration-200 rounded-xl",
            error
              ? "border-red-500 text-red-600 placeholder-red-300 ring-4 ring-red-50"
              : "border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 text-slate-900 placeholder-slate-400 shadow-sm",
            className
          )}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        {(error || (showCharCount && maxLength)) && (
          <div className="mt-1 flex justify-between items-center text-xs">
            {error && (
              <span className="text-red-500">{error}</span>
            )}
            {showCharCount && maxLength && (
              <span
                className={cn(
                  "ml-auto",
                  charCount > maxLength * 0.9
                    ? "text-red-500"
                    : "text-gray-400"
                )}
              >
                {charCount} / {maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

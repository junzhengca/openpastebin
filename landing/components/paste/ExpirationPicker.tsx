"use client";

import React, { useState } from "react";
import { EXPIRATION_OPTIONS, type ExpirationOption } from "@/types/paste";
import { calculateExpirationDate, toISO8601 } from "@/lib/utils/date";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

export interface ExpirationPickerProps {
  value: ExpirationOption;
  customDate?: Date | null;
  onChange: (option: ExpirationOption, customDate?: Date | null) => void;
}

export function ExpirationPicker({
  value,
  customDate,
  onChange,
}: ExpirationPickerProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(
    value === "custom"
  );

  const handleOptionChange = (option: ExpirationOption) => {
    if (option === "custom") {
      setShowCustomPicker(true);
      onChange(option, customDate || null);
    } else {
      setShowCustomPicker(false);
      const expirationDate = calculateExpirationDate(option);
      onChange(option, expirationDate);
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    onChange("custom", date);
  };

  const getDateTimeLocalValue = (date: Date | null | undefined): string => {
    if (!date) return "";
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {EXPIRATION_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center justify-center cursor-pointer px-3 py-2 border rounded-lg transition-all text-xs font-medium",
              value === option.value
                ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <input
              type="radio"
              name="expiration"
              value={option.value}
              checked={value === option.value}
              onChange={() => handleOptionChange(option.value)}
              className="sr-only"
            />
            <span>
              {option.label}
            </span>
          </label>
        ))}
      </div>
      {showCustomPicker && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <Input
            type="datetime-local"
            value={getDateTimeLocalValue(customDate)}
            onChange={handleCustomDateChange}
            min={getDateTimeLocalValue(new Date())}
            className="text-sm py-2"
          />
        </div>
      )}
    </div>
  );
}

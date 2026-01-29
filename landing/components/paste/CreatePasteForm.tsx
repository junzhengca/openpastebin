"use client";

import React, { useState } from "react";
import { useCreatePaste } from "@/hooks/usePaste";
import { ExpirationPicker } from "./ExpirationPicker";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { validatePasteContent, validateExpirationDate } from "@/lib/utils/validation";
import { toISO8601, calculateExpirationDate } from "@/lib/utils/date";
import type { ExpirationOption } from "@/types/paste";
import toast from "react-hot-toast";

export function CreatePasteForm() {
  const [content, setContent] = useState("");
  const [expiration, setExpiration] = useState<ExpirationOption>("never");
  const [customExpirationDate, setCustomExpirationDate] = useState<Date | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const createPasteMutation = useCreatePaste();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate content
    const contentValidation = validatePasteContent(content);
    if (!contentValidation.valid) {
      setError(contentValidation.error || "Invalid content");
      return;
    }

    // Validate expiration date
    const expirationValidation = validateExpirationDate(customExpirationDate);
    if (!expirationValidation.valid) {
      setError(expirationValidation.error || "Invalid expiration date");
      return;
    }

    // Convert expiration to ISO 8601 string
    let expiresAt: string | null = null;
    if (expiration !== "never") {
      if (expiration === "custom") {
        expiresAt = customExpirationDate ? toISO8601(customExpirationDate) : null;
      } else {
        const expirationDate = calculateExpirationDate(expiration);
        expiresAt = expirationDate ? toISO8601(expirationDate) : null;
      }
    }

    try {
      await createPasteMutation.mutateAsync({
        content,
        expiresAt,
      });
      toast.success("Paste created successfully!");
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to create paste. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <Textarea
          placeholder="Paste your code or text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoResize
          rows={12}
          required
          className="font-mono text-sm min-h-[300px] bg-slate-50/50 focus:bg-white transition-all border-slate-200"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            Markdown Supported
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
            Expiration
          </label>
          <ExpirationPicker
            value={expiration}
            customDate={customExpirationDate}
            onChange={(option, date) => {
              setExpiration(option);
              setCustomExpirationDate(date || null);
            }}
          />
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {error && <Alert variant="error" className="w-full py-2">{error}</Alert>}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={createPasteMutation.isPending}
            disabled={!content.trim()}
            className="w-full md:w-auto px-8"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              Create Paste
            </span>
          </Button>
        </div>
      </div>
    </form>
  );
}

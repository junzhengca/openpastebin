"use client";

import React, { useState, useEffect } from "react";
import { useUpdatePaste, useDeletePaste } from "@/hooks/usePaste";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { getSecretToken } from "@/lib/utils/storage";
import { validatePasteContent, validateSecretToken } from "@/lib/utils/validation";
import toast from "react-hot-toast";
import type { GetPasteResponse } from "@/lib/api/types";

export interface PasteEditorProps {
  paste: GetPasteResponse;
}

export function PasteEditor({ paste }: PasteEditorProps) {
  const [content, setContent] = useState(paste.content);
  const [secretToken, setSecretToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateMutation = useUpdatePaste();
  const deleteMutation = useDeletePaste();

  useEffect(() => {
    // Try to get secret token from storage
    const storedToken = getSecretToken(paste.id);
    if (storedToken) {
      setSecretToken(storedToken);
    }
  }, [paste.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate content
    const contentValidation = validatePasteContent(content);
    if (!contentValidation.valid) {
      setError(contentValidation.error || "Invalid content");
      return;
    }

    // Validate secret token
    const tokenValidation = validateSecretToken(secretToken);
    if (!tokenValidation.valid) {
      setError(tokenValidation.error || "Invalid secret token");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: paste.id,
        content,
        secretToken,
      });
      toast.success("Paste updated successfully!");
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to update paste. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    setError(null);

    const tokenValidation = validateSecretToken(secretToken);
    if (!tokenValidation.valid) {
      setError(tokenValidation.error || "Invalid secret token");
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        id: paste.id,
        secretToken,
      });
      toast.success("Paste deleted successfully!");
    } catch (err: any) {
      const errorMessage =
        err?.message || "Failed to delete paste. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="relative group">
          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoResize
            rows={12}
            required
            className="font-mono text-sm min-h-[300px] bg-slate-50/50 focus:bg-white transition-all border-slate-200"
          />
        </div>

        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-4">
          <Input
            type="text"
            label="Secret token"
            value={secretToken}
            onChange={(e) => setSecretToken(e.target.value)}
            placeholder="Enter secret token to authorize changes"
            required
            className="bg-white border-slate-200"
          />
          <p className="text-[11px] text-slate-400 italic px-1">
            Required to verify ownership and authorize updates or deletion.
          </p>
        </div>

        {error && <Alert variant="error" className="py-2">{error}</Alert>}

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteMutation.isPending}
            className="w-full sm:w-auto px-6 border-red-100 text-red-600 hover:bg-red-50"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              Delete Paste
            </span>
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={updateMutation.isPending}
            disabled={!content.trim() || !secretToken.trim()}
            className="w-full sm:w-auto px-8"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Changes
            </span>
          </Button>
        </div>
      </form>

      {showDeleteConfirm && (
        <Alert variant="warning" className="animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4 py-1">
            <div>
              <p className="font-bold text-yellow-900 mb-1">Delete this paste permanently?</p>
              <p className="text-sm text-yellow-700">This action cannot be undone. All data will be removed from our servers.</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                isLoading={deleteMutation.isPending}
                className="bg-red-600 text-white border-red-600 hover:bg-red-700"
              >
                Yes, delete it
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
              >
                No, keep it
              </Button>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { formatDateTime, getTimeUntilExpiration } from "@/lib/utils/date";
import { getSecretToken } from "@/lib/utils/storage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { GetPasteResponse } from "@/lib/api/types";

export interface PasteViewerProps {
  paste: GetPasteResponse;
}

export function PasteViewer({ paste }: PasteViewerProps) {
  const [viewMode, setViewMode] = useState<"raw" | "markdown" | "code">("raw");
  const router = useRouter();
  const hasSecretToken = getSecretToken(paste.id) !== null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/paste/${paste.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Share URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy share URL");
    }
  };

  const handleEdit = () => {
    router.push(`/paste/${paste.id}/edit`);
  };

  const detectLanguage = (content: string): string => {
    // Simple language detection based on common patterns
    if (content.startsWith("```")) {
      const match = content.match(/^```(\w+)/);
      if (match) return match[1];
    }
    // Default to plaintext
    return "plaintext";
  };

  const isMarkdown = (content: string): boolean => {
    const markdownPatterns = [
      /^#{1,6}\s/m, // Headers
      /\*\*.*\*\*/, // Bold
      /\*.*\*/, // Italic
      /\[.*\]\(.*\)/, // Links
      /^[-*+]\s/m, // Unordered lists
      /^\d+\.\s/m, // Ordered lists
      /\|.*\|/m, // Tables
    ];
    return markdownPatterns.some((pattern) => pattern.test(content));
  };

  const renderContent = () => {
    switch (viewMode) {
      case "markdown":
        return (
          <div className={cn(
            "prose prose-slate prose-sm sm:prose-base max-w-none",
            // Headings with distinct sizes - using !important to override defaults
            "[&_h1]:!text-4xl [&_h1]:sm:!text-5xl [&_h1]:!mt-0 [&_h1]:!mb-6 [&_h1]:!font-extrabold [&_h1]:!text-slate-900",
            "[&_h2]:!text-3xl [&_h2]:sm:!text-4xl [&_h2]:!mt-10 [&_h2]:!mb-4 [&_h2]:!font-bold [&_h2]:!text-slate-900",
            "[&_h3]:!text-2xl [&_h3]:sm:!text-3xl [&_h3]:!mt-8 [&_h3]:!mb-3 [&_h3]:!font-bold [&_h3]:!text-slate-900",
            "[&_h4]:!text-xl [&_h4]:sm:!text-2xl [&_h4]:!mt-6 [&_h4]:!mb-2 [&_h4]:!font-semibold [&_h4]:!text-slate-900",
            "[&_h5]:!text-lg [&_h5]:sm:!text-xl [&_h5]:!mt-5 [&_h5]:!mb-2 [&_h5]:!font-semibold [&_h5]:!text-slate-900",
            "[&_h6]:!text-base [&_h6]:sm:!text-lg [&_h6]:!mt-4 [&_h6]:!mb-2 [&_h6]:!font-semibold [&_h6]:!text-slate-900",
            // Paragraphs
            "[&_p]:!text-slate-700 [&_p]:!leading-relaxed [&_p]:!my-4",
            // Links
            "[&_a]:!text-primary-600 [&_a]:!no-underline hover:[&_a]:!underline [&_a]:!font-medium",
            // Text formatting
            "[&_strong]:!text-slate-900 [&_strong]:!font-semibold",
            "[&_em]:!text-slate-800 [&_em]:!italic",
            // Code
            "[&_code]:!text-primary-700 [&_code]:!bg-primary-50 [&_code]:!px-1.5 [&_code]:!py-0.5 [&_code]:!rounded [&_code]:!text-sm [&_code]:!font-mono",
            "[&_pre]:!bg-slate-900 [&_pre]:!text-slate-100 [&_pre]:!rounded-lg [&_pre]:!overflow-x-auto [&_pre_code]:!bg-transparent [&_pre_code]:!text-inherit [&_pre_code]:!px-0",
            // Blockquotes
            "[&_blockquote]:!border-l-4 [&_blockquote]:!border-primary-300 [&_blockquote]:!pl-4 [&_blockquote]:!italic [&_blockquote]:!text-slate-600 [&_blockquote]:!my-4",
            // Lists - unordered and ordered
            "[&_ul]:!list-disc [&_ul]:!my-4 [&_ul]:!pl-6 [&_ul]:!space-y-2",
            "[&_ol]:!list-decimal [&_ol]:!my-4 [&_ol]:!pl-6 [&_ol]:!space-y-2",
            "[&_li]:!text-slate-700 [&_li]:!my-2 [&_li]:!leading-relaxed",
            "[&_li_marker]:!text-slate-400",
            // Tables
            "[&_table]:!w-full [&_table]:!my-6 [&_table]:!border-collapse [&_table]:!border [&_table]:!border-slate-300",
            "[&_thead]:!border-b-2 [&_thead]:!border-slate-300 [&_thead]:!bg-slate-50",
            "[&_th]:!px-4 [&_th]:!py-3 [&_th]:!text-left [&_th]:!font-semibold [&_th]:!text-slate-900 [&_th]:!border [&_th]:!border-slate-300",
            "[&_td]:!px-4 [&_td]:!py-3 [&_td]:!border-b [&_td]:!border-slate-200 [&_td]:!text-slate-700 [&_td]:!border-r [&_td]:!border-slate-200",
            "[&_tr:hover]:!bg-slate-50",
            // Images
            "[&_img]:!rounded-lg [&_img]:!shadow-md [&_img]:!my-6",
            // Horizontal rules
            "[&_hr]:!border-slate-200 [&_hr]:!my-8"
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{paste.content}</ReactMarkdown>
          </div>
        );
      case "code":
        return (
          <SyntaxHighlighter
            language={detectLanguage(paste.content)}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
            }}
          >
            {paste.content}
          </SyntaxHighlighter>
        );
      default:
        return (
          <pre className="whitespace-pre-wrap break-words font-mono text-sm bg-gray-50 p-4 border border-gray-100">
            {paste.content}
          </pre>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <Button
            variant={viewMode === "raw" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("raw")}
            className={viewMode === "raw" ? "shadow-none" : "text-slate-600 hover:bg-slate-200"}
          >
            Raw
          </Button>
          {isMarkdown(paste.content) && (
            <Button
              variant={viewMode === "markdown" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("markdown")}
              className={viewMode === "markdown" ? "shadow-none" : "text-slate-600 hover:bg-slate-200"}
            >
              Markdown
            </Button>
          )}
          <Button
            variant={viewMode === "code" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("code")}
            className={viewMode === "code" ? "shadow-none" : "text-slate-600 hover:bg-slate-200"}
          >
            Code
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy
            </span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleShare}>
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </span>
          </Button>
          {hasSecretToken && (
            <Button variant="secondary" size="sm" onClick={handleEdit}>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-cap-so border border-slate-200 overflow-hidden min-h-[400px]">
        <div className={cn(
          "p-6 md:p-8",
          viewMode === "code" && "p-0"
        )}>
          {renderContent()}
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Created: {formatDateTime(paste.created_at)}
        </div>
        {paste.expires_at && (
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm",
            getTimeUntilExpiration(paste.expires_at) === "Expired" 
              ? "bg-red-50 border-red-100 text-red-500" 
              : "bg-white border-slate-100 text-slate-400"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Expires: {formatDateTime(paste.expires_at)} ({getTimeUntilExpiration(paste.expires_at) || "Expired"})
          </div>
        )}
      </div>
    </div>
  );
}

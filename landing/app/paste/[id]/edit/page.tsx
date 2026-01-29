"use client";

import { useParams } from "next/navigation";
import { useGetPaste } from "@/hooks/usePaste";
import { PasteEditor } from "@/components/paste/PasteEditor";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function EditPastePage() {
  const params = useParams();
  const pasteId = params.id as string;

  const { data: paste, isLoading, error } = useGetPaste(pasteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 animate-pulse">Loading editor...</p>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="space-y-4">
        <Alert variant="error">
          <div className="space-y-2">
            <p className="font-bold">Paste not found</p>
            <p className="text-sm">
              Could not load paste for editing.
            </p>
          </div>
        </Alert>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="primary">Return home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-vista-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Paste</h1>
            <p className="text-sm text-slate-500">Modify your content or expiration</p>
          </div>
        </div>
        <Link href={`/paste/${paste.id}`}>
          <Button variant="secondary" size="sm">
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View paste
            </span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-cap-so border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <PasteEditor paste={paste} />
        </div>
      </div>
    </div>
  );
}

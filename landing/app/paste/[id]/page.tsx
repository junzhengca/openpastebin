"use client";

import { useParams } from "next/navigation";
import { useGetPaste } from "@/hooks/usePaste";
import { PasteViewer } from "@/components/paste/PasteViewer";
import { SecretTokenManager } from "@/components/paste/SecretTokenManager";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function PastePage() {
  const params = useParams();
  const pasteId = params.id as string;

  const { data: paste, isLoading, error } = useGetPaste(pasteId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 animate-pulse">Loading paste...</p>
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
              This paste may have expired or never existed.
            </p>
          </div>
        </Alert>
        <div className="flex justify-center">
          <Link href="/">
            <Button variant="primary">Create new paste</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PasteViewer paste={paste} />
      <SecretTokenManager pasteId={paste.id} />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <Alert variant="error">
        <div className="space-y-2">
          <p className="font-medium">Something went wrong!</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </Alert>
      <div className="flex gap-2 justify-center">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  getSecretToken,
  saveSecretToken,
  clearSecretToken,
  hasSecretToken,
} from "@/lib/utils/storage";

export function useSecretToken(pasteId: string | null) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!pasteId) {
      setIsLoading(false);
      return;
    }

    const storedToken = getSecretToken(pasteId);
    setToken(storedToken);
    setIsLoading(false);
  }, [pasteId]);

  const saveToken = (pasteId: string, newToken: string) => {
    saveSecretToken(pasteId, newToken);
    if (pasteId === pasteId) {
      setToken(newToken);
    }
  };

  const clearToken = (pasteId: string) => {
    clearSecretToken(pasteId);
    if (pasteId === pasteId) {
      setToken(null);
    }
  };

  const hasToken = (pasteId: string) => {
    return hasSecretToken(pasteId);
  };

  return {
    token,
    isLoading,
    saveToken,
    clearToken,
    hasToken,
  };
}

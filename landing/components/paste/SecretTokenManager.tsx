"use client";

import React from "react";
import { getSecretToken, clearSecretToken } from "@/lib/utils/storage";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import toast from "react-hot-toast";

export interface SecretTokenManagerProps {
  pasteId: string;
  onTokenCleared?: () => void;
}

export function SecretTokenManager({
  pasteId,
  onTokenCleared,
}: SecretTokenManagerProps) {
  const [token, setToken] = React.useState<string | null>(null);
  const [showToken, setShowToken] = React.useState(false);

  React.useEffect(() => {
    const storedToken = getSecretToken(pasteId);
    setToken(storedToken);
  }, [pasteId]);

  const handleClearToken = () => {
    clearSecretToken(pasteId);
    setToken(null);
    setShowToken(false);
    if (onTokenCleared) {
      onTokenCleared();
    }
  };

  if (!token) {
    return null;
  }

  return (
    <Alert variant="info" className="mt-8 border-primary-100 bg-primary-50/30 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center text-white text-[10px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p className="font-bold text-primary-900">Secret token saved</p>
          </div>
          <p className="text-sm text-primary-700 leading-relaxed">
            This token is stored in your browser. It allows you to edit or delete this paste later.
          </p>
          {showToken && (
            <div className="mt-3 relative">
              <code className="block p-3 bg-white/50 border border-primary-100 rounded-lg text-[11px] font-mono break-all text-primary-800 pr-10">
                {token}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(token);
                  toast.success("Token copied!");
                }}
                className="absolute top-2 right-2 p-1.5 hover:bg-primary-100 rounded-md transition-colors text-primary-600"
                title="Copy token"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowToken(!showToken)}
            className="flex-1 md:flex-none bg-white/50 border-primary-100 text-primary-700 hover:bg-white hover:text-primary-900"
          >
            {showToken ? "Hide Token" : "Show Token"}
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleClearToken}
            className="flex-1 md:flex-none border-red-100 text-red-600 hover:bg-red-50"
          >
            Forget Token
          </Button>
        </div>
      </div>
    </Alert>
  );
}

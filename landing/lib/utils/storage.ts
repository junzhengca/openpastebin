import { STORAGE_PREFIX } from "@/lib/constants";

export function saveSecretToken(pasteId: string, token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${pasteId}`, token);
  } catch (error) {
    console.error("Failed to save secret token:", error);
  }
}

export function getSecretToken(pasteId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${pasteId}`);
  } catch (error) {
    console.error("Failed to get secret token:", error);
    return null;
  }
}

export function clearSecretToken(pasteId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${pasteId}`);
  } catch (error) {
    console.error("Failed to clear secret token:", error);
  }
}

export function hasSecretToken(pasteId: string): boolean {
  return getSecretToken(pasteId) !== null;
}

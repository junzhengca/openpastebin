import { format, formatDistanceToNow, addHours, parseISO, isValid } from "date-fns";

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "Invalid date";
  return format(dateObj, "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "Invalid date";
  return format(dateObj, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "Invalid date";
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function addDuration(hours: number): Date {
  return addHours(new Date(), hours);
}

export function toISO8601(date: Date): string {
  return date.toISOString();
}

export function calculateExpirationDate(
  option: string,
  customDate?: Date | null
): Date | null {
  switch (option) {
    case "never":
      return null;
    case "1h":
      return addDuration(1);
    case "1d":
      return addDuration(24);
    case "1w":
      return addDuration(168);
    case "custom":
      return customDate || null;
    default:
      return null;
  }
}

export function getTimeUntilExpiration(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const expirationDate = parseISO(expiresAt);
  if (!isValid(expirationDate)) return null;
  if (expirationDate < new Date()) return "Expired";
  return formatDistanceToNow(expirationDate, { addSuffix: true });
}

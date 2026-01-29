// Domain types for client-side paste representation

export interface Paste {
  id: string;
  content: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PasteFormData {
  content: string;
  expiration: ExpirationOption;
  customExpirationDate?: Date;
}

export type ExpirationOption =
  | "never"
  | "1h"
  | "1d"
  | "1w"
  | "custom";

export interface ExpirationDuration {
  label: string;
  value: ExpirationOption;
  hours?: number;
}

export const EXPIRATION_OPTIONS: ExpirationDuration[] = [
  { label: "Never", value: "never" },
  { label: "1 Hour", value: "1h", hours: 1 },
  { label: "1 Day", value: "1d", hours: 24 },
  { label: "1 Week", value: "1w", hours: 168 },
  { label: "Custom", value: "custom" },
];

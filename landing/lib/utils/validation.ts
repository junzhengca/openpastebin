export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePasteContent(content: string): ValidationResult {
  if (!content || content.trim().length === 0) {
    return {
      valid: false,
      error: "Paste content cannot be empty",
    };
  }

  if (content.length > 1000000) {
    // 1MB limit (rough estimate)
    return {
      valid: false,
      error: "Paste content is too long (maximum 1MB)",
    };
  }

  return { valid: true };
}

export function validateExpirationDate(date: Date | null): ValidationResult {
  if (!date) {
    return { valid: true };
  }

  if (date < new Date()) {
    return {
      valid: false,
      error: "Expiration date cannot be in the past",
    };
  }

  return { valid: true };
}

export function validateSecretToken(token: string): ValidationResult {
  if (!token || token.trim().length === 0) {
    return {
      valid: false,
      error: "Secret token is required",
    };
  }

  if (token.length < 32) {
    return {
      valid: false,
      error: "Invalid secret token format",
    };
  }

  return { valid: true };
}

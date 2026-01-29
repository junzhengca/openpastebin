// API Request/Response types matching the server

export interface CreatePasteRequest {
  content: string;
  expires_at?: string | null; // ISO 8601 format
}

export interface CreatePasteResponse {
  id: string;
  content: string;
  secret_token: string;
  expires_at: string | null;
  created_at: string;
}

export interface GetPasteResponse {
  id: string;
  content: string;
  expires_at: string | null;
  created_at: string;
}

export interface UpdatePasteRequest {
  content: string;
  secret_token: string;
}

export interface UpdatePasteResponse {
  id: string;
  content: string;
  expires_at: string | null;
  updated_at: string;
}

export interface DeletePasteRequest {
  secret_token: string;
}

export interface DeletePasteResponse {
  message: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

import { apiRequest } from "./client";
import type {
  CreatePasteRequest,
  CreatePasteResponse,
  GetPasteResponse,
  UpdatePasteRequest,
  UpdatePasteResponse,
  DeletePasteRequest,
  DeletePasteResponse,
} from "./types";

export async function createPaste(
  content: string,
  expiresAt?: string | null
): Promise<CreatePasteResponse> {
  const request: CreatePasteRequest = {
    content,
    expires_at: expiresAt || null,
  };
  return apiRequest<CreatePasteResponse>("/pastes", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function getPaste(id: string): Promise<GetPasteResponse> {
  return apiRequest<GetPasteResponse>(`/pastes/${id}`, {
    method: "GET",
  });
}

export async function updatePaste(
  id: string,
  content: string,
  secretToken: string
): Promise<UpdatePasteResponse> {
  const request: UpdatePasteRequest = {
    content,
    secret_token: secretToken,
  };
  return apiRequest<UpdatePasteResponse>(`/pastes/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deletePaste(
  id: string,
  secretToken: string
): Promise<void> {
  const request: DeletePasteRequest = {
    secret_token: secretToken,
  };
  await apiRequest<DeletePasteResponse>(`/pastes/${id}`, {
    method: "DELETE",
    body: JSON.stringify(request),
  });
}

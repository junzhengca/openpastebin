"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createPaste,
  getPaste,
  updatePaste,
  deletePaste,
} from "@/lib/api/pastes";
import { saveSecretToken } from "@/lib/utils/storage";
import type {
  CreatePasteResponse,
  GetPasteResponse,
  UpdatePasteResponse,
} from "@/lib/api/types";

export function useCreatePaste() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      expiresAt,
    }: {
      content: string;
      expiresAt?: string | null;
    }) => {
      return createPaste(content, expiresAt);
    },
    onSuccess: (data: CreatePasteResponse) => {
      // Save secret token to localStorage
      saveSecretToken(data.id, data.secret_token);
      // Invalidate queries if needed
      queryClient.invalidateQueries({ queryKey: ["pastes"] });
      // Redirect to paste view
      router.push(`/paste/${data.id}`);
    },
  });
}

export function useGetPaste(id: string) {
  return useQuery({
    queryKey: ["paste", id],
    queryFn: () => getPaste(id),
    enabled: !!id && id.length === 6,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors
      if (error?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useUpdatePaste() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      secretToken,
    }: {
      id: string;
      content: string;
      secretToken: string;
    }) => {
      return updatePaste(id, content, secretToken);
    },
    onSuccess: (data: UpdatePasteResponse) => {
      // Update the cache
      queryClient.setQueryData(["paste", data.id], {
        id: data.id,
        content: data.content,
        expires_at: data.expires_at,
        created_at: data.updated_at, // Use updated_at as created_at for display
      } as GetPasteResponse);
      queryClient.invalidateQueries({ queryKey: ["paste", data.id] });
    },
  });
}

export function useDeletePaste() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      secretToken,
    }: {
      id: string;
      secretToken: string;
    }) => {
      return deletePaste(id, secretToken);
    },
    onSuccess: (_, variables) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["paste", variables.id] });
      // Redirect to home
      router.push("/");
    },
  });
}

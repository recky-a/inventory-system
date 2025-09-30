import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;");
}

export function sanitizeSearchQuery(q?: string): string | null {
  if (!q) return null;
  // remove control characters (except newline if you want, here we remove all)
  let cleaned = q.replace(/[\x00-\x1F\x7F]/g, "");
  cleaned = cleaned.trim().replace(/\s+/g, " ");
  if (cleaned.length === 0) return null;
  const MAX_LEN = 200;
  if (cleaned.length > MAX_LEN) cleaned = cleaned.slice(0, MAX_LEN);
  return cleaned;
}

export const SearchQuerySchema = z.string().max(200).optional();

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").trim();
}

export function isValidInstagramUrl(url: string): boolean {
  if (!url) return true;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname === "instagram.com" || u.hostname === "www.instagram.com";
  } catch {
    return false;
  }
}

export function isValidWhatsAppNumber(phone: string): boolean {
  return /^\+?[1-9]\d{6,14}$/.test(phone.replace(/\s+/g, ""));
}

export function getInstagramUsername(url: string): string {
  if (!url) return "";
  const match = url.match(/instagram\.com\/([a-zA-Z0-9_.]+)/);
  return match ? `@${match[1]}` : url;
}

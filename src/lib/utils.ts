import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTags(tags: string | string[] | null | undefined): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

export function getLevelLabel(level: string): string {
  if (level === "BEGINNER") return "Beginner";
  if (level === "INTERMEDIATE") return "Intermediate";
  if (level === "ADVANCED") return "Advanced";
  return level;
}

export function getLevelColor(level: string): string {
  if (level === "BEGINNER") return "bg-green-100 text-green-700";
  if (level === "INTERMEDIATE") return "bg-yellow-100 text-yellow-700";
  if (level === "ADVANCED") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
}

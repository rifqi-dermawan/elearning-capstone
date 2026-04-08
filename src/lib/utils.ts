import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getLevelLabel(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: "Pemula",
    INTERMEDIATE: "Menengah",
    ADVANCED: "Lanjutan",
  };
  return map[level] ?? level;
}

export function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    BEGINNER: "bg-emerald-100 text-emerald-700",
    INTERMEDIATE: "bg-amber-100 text-amber-700",
    ADVANCED: "bg-rose-100 text-rose-700",
  };
  return map[level] ?? "bg-slate-100 text-slate-700";
}

export function parseTags(tagsJson: string): string[] {
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}

// src/types/index.ts
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  image?: string;
}

export type RecommendationType = "content" | "collaborative" | "hybrid" | "popular";

export interface Recommendation {
  moduleId: string;
  title: string;
  description: string;
  tags: string[];
  level: string;
  cbScore: number;
  cfScore: number;
  finalScore: number;
  reason: string;
  reasonType: RecommendationType;
}

export interface ModuleWithStats {
  id: string;
  title: string;
  description: string;
  tags: string[];
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  published: boolean;
  thumbnail?: string | null;
  createdAt: Date;
  _count?: { logs: number };
}

export interface UserLogEntry {
  id: string;
  userId: string;
  moduleId: string;
  action: "CLICK" | "COMPLETE";
  rating?: number | null;
  createdAt: Date;
  module?: { title: string };
  user?: { name: string; email: string };
}

export interface DashboardStats {
  totalModules: number;
  totalUsers: number;
  totalLogs: number;
  completedCount: number;
}

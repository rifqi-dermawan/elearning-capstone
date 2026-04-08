import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";

export interface RecommendationResult {
  moduleId: string;
  title: string;
  description: string;
  tags: string[];
  level: string;
  cbScore: number;
  cfScore: number;
  finalScore: number;
  reason: string;
  reasonType: "content" | "collaborative" | "hybrid" | "popular";
}

const ALPHA = 0.6; // Weight for Content-Based (CB)
const MAX_RECOMMENDATIONS = 5;

// ────────────────────────────────────────────────
// 1. CONTENT-BASED FILTERING (Jaccard Similarity)
// ────────────────────────────────────────────────
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

async function getContentBasedScores(
  userId: string,
  candidateIds: string[],
  allModules: { id: string; tags: string }[]
): Promise<Map<string, { score: number; matchedTags: string[] }>> {
  // Build user interest profile from logs with rating >= 4 OR completed
  const userLogs = await prisma.userLog.findMany({
    where: {
      userId,
      OR: [{ action: "COMPLETE" }, { rating: { gte: 4 } }],
    },
    select: { moduleId: true },
  });

  const likedModuleIds = userLogs.map((l: { moduleId: string }) => l.moduleId);
  const likedModules = allModules.filter((m) => likedModuleIds.includes(m.id));

  // Aggregate all tags from liked modules → user interest profile
  const userTagSet = new Set<string>();
  likedModules.forEach((m) => {
    parseTags(m.tags).forEach((t) => userTagSet.add(t));
  });

  const scores = new Map<string, { score: number; matchedTags: string[] }>();

  for (const modId of candidateIds) {
    const mod = allModules.find((m) => m.id === modId);
    if (!mod) continue;

    const modTagSet = new Set(parseTags(mod.tags));
    const score = jaccardSimilarity(userTagSet, modTagSet);
    const matchedTags = [...modTagSet].filter((t) => userTagSet.has(t));

    scores.set(modId, { score, matchedTags });
  }

  return scores;
}

// ────────────────────────────────────────────────
// 2. COLLABORATIVE FILTERING (Cosine Similarity)
// ────────────────────────────────────────────────
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

async function getCollaborativeScores(
  userId: string,
  candidateIds: string[],
  allModuleIds: string[]
): Promise<Map<string, number>> {
  // Get all user logs
  const allLogs = await prisma.userLog.findMany({
    select: { userId: true, moduleId: true, action: true, rating: true },
  });

  // Build rating matrix: userId → { moduleId → score }
  const ratingMatrix = new Map<string, Map<string, number>>();
  for (const log of allLogs) {
    if (!ratingMatrix.has(log.userId)) {
      ratingMatrix.set(log.userId, new Map());
    }
    const userMap = ratingMatrix.get(log.userId)!;
    // Score: rating (1-5) or action score (CLICK=2, COMPLETE=4)
    const score = log.rating ?? (log.action === "COMPLETE" ? 4 : 2);
    // Take max if multiple logs
    userMap.set(log.moduleId, Math.max(userMap.get(log.moduleId) ?? 0, score));
  }

  // Convert target user to vector
  const targetVec = allModuleIds.map(
    (mid) => ratingMatrix.get(userId)?.get(mid) ?? 0
  );

  if (targetVec.every((v) => v === 0)) {
    return new Map(); // Cold start — no history
  }

  // Find similar users (cosine similarity)
  const similarities: { userId: string; sim: number }[] = [];
  for (const [otherUserId, otherMap] of ratingMatrix.entries()) {
    if (otherUserId === userId) continue;
    const otherVec = allModuleIds.map((mid) => otherMap.get(mid) ?? 0);
    const sim = cosineSimilarity(targetVec, otherVec);
    if (sim > 0) similarities.push({ userId: otherUserId, sim });
  }

  // Sort by similarity, take top 3
  similarities.sort((a, b) => b.sim - a.sim);
  const topSimilarUsers = similarities.slice(0, 3);

  if (topSimilarUsers.length === 0) return new Map();

  // Calculate weighted CF score for each candidate module
  const cfScores = new Map<string, number>();
  for (const modId of candidateIds) {
    let weightedSum = 0;
    let simSum = 0;
    for (const { userId: simUserId, sim } of topSimilarUsers) {
      const rating = ratingMatrix.get(simUserId)?.get(modId) ?? 0;
      weightedSum += sim * rating;
      simSum += sim;
    }
    if (simSum > 0) {
      cfScores.set(modId, weightedSum / simSum / 5); // Normalize to 0-1
    }
  }

  return cfScores;
}

// ────────────────────────────────────────────────
// 3. GENERATE EXPLAINABLE REASON
// ────────────────────────────────────────────────
function generateReason(
  cbScore: number,
  cfScore: number,
  matchedTags: string[]
): { reason: string; type: "content" | "collaborative" | "hybrid" | "popular" } {
  const hasContent = cbScore > 0 && matchedTags.length > 0;
  const hasCollab = cfScore > 0;

  if (hasContent && hasCollab) {
    return {
      reason: `Karena kamu tertarik pada ${matchedTags.slice(0, 2).join(" & ")}, dan pengguna dengan profil serupa menyukainya.`,
      type: "hybrid",
    };
  } else if (hasContent) {
    return {
      reason: `Karena kamu tertarik pada topik ${matchedTags.slice(0, 3).join(", ")}.`,
      type: "content",
    };
  } else if (hasCollab) {
    return {
      reason: "Pengguna dengan histori belajar serupa sangat merekomendasikan materi ini.",
      type: "collaborative",
    };
  } else {
    return {
      reason: "Materi populer yang diminati banyak pengguna.",
      type: "popular",
    };
  }
}

// ────────────────────────────────────────────────
// 4. MAIN HYBRID RECOMMENDER
// ────────────────────────────────────────────────
export async function getHybridRecommendations(
  userId: string
): Promise<RecommendationResult[]> {
  // Get all published modules
  const allModules = await prisma.module.findMany({
    where: { published: true },
    select: { id: true, title: true, description: true, tags: true, level: true },
  });

  // Get modules already interacted by this user
  const userInteracted = await prisma.userLog.findMany({
    where: { userId },
    select: { moduleId: true },
  });
  const interactedIds = new Set(userInteracted.map((l: { moduleId: string }) => l.moduleId));

  // Candidates = modules NOT yet seen by this user
  const candidates = allModules.filter((m: { id: string }) => !interactedIds.has(m.id));

  if (candidates.length === 0) return [];

  const candidateIds = candidates.map((m: { id: string }) => m.id);
  const allModuleIds = allModules.map((m: { id: string }) => m.id);

  // Run both engines in parallel
  const [cbScores, cfScores] = await Promise.all([
    getContentBasedScores(userId, candidateIds, allModules),
    getCollaborativeScores(userId, candidateIds, allModuleIds),
  ]);

  // Merge hybrid scores
  const results: RecommendationResult[] = candidates.map((mod: any) => {
    const cb = cbScores.get(mod.id) ?? { score: 0, matchedTags: [] };
    const cf = cfScores.get(mod.id) ?? 0;

    const finalScore = ALPHA * cb.score + (1 - ALPHA) * cf;
    const { reason, type } = generateReason(cb.score, cf, cb.matchedTags);

    return {
      moduleId: mod.id,
      title: mod.title,
      description: mod.description,
      tags: parseTags(mod.tags),
      level: mod.level,
      cbScore: cb.score,
      cfScore: cf,
      finalScore,
      reason,
      reasonType: type,
    };
  });

  // If no scores at all (cold start), fallback to popular modules by log count
  const hasAnyScore = results.some((r) => r.finalScore > 0);
  if (!hasAnyScore) {
    const popularCounts = await prisma.userLog.groupBy({
      by: ["moduleId"],
      _count: { moduleId: true },
      orderBy: { _count: { moduleId: "desc" } },
      take: MAX_RECOMMENDATIONS,
    });

    const popularIds = new Set(popularCounts.map((p: { moduleId: string }) => p.moduleId));
    return results
      .filter((r) => popularIds.has(r.moduleId))
      .slice(0, MAX_RECOMMENDATIONS)
      .map((r) => ({ ...r, reason: "Materi populer yang diminati banyak pengguna.", reasonType: "popular" as const }));
  }

  return results
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, MAX_RECOMMENDATIONS);
}
